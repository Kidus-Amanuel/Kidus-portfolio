import nodemailer from "nodemailer";
import { Resend } from "resend";
import { prisma } from "@/lib/db";

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
}

export interface EmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

export interface EmailResult {
  ok: boolean;
  provider: "resend" | "nodemailer" | "none";
  error?: string;
}

async function resolveSender(): Promise<{ email: string; name: string }> {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
    return {
      email: settings?.senderEmail?.trim() || "kidusamanuel0371@gmail.com",
      name: "Kidus Amanuel",
    };
  } catch {
    return { email: "kidusamanuel0371@gmail.com", name: "Kidus Amanuel" };
  }
}

/**
 * Resend failures are cached for a short while so an unverified domain (or a
 * bad key) does not cost one failed API call per email. Permanent problems
 * (unverified domain, bad credentials) are parked for 30 minutes, transient
 * ones (rate limits, network blips) for 2 minutes.
 */
let resendDisabledUntil = 0;

function resendBackoff(error: string | undefined): number {
  const message = (error ?? "").toLowerCase();
  const permanent =
    message.includes("not verified") ||
    message.includes("domain") ||
    message.includes("unauthorized") ||
    message.includes("forbidden") ||
    message.includes("invalid");

  return permanent ? 30 * 60 * 1000 : 2 * 60 * 1000;
}

/**
 * Send an email, preferring Resend and falling back to the Gmail SMTP
 * transport that already powers the mass emailer.
 *
 * Never throws — callers get a result object so a mail outage cannot break
 * the booking flow.
 */
export async function sendEmail(input: EmailInput): Promise<EmailResult> {
  const sender = await resolveSender();
  let resendError: string | undefined;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && Date.now() > resendDisabledUntil) {
    try {
      const resend = new Resend(resendKey);
      const { error } = await resend.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        replyTo: input.replyTo,
        attachments: input.attachments?.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.content,
        })),
      });

      if (!error) return { ok: true, provider: "resend" };

      resendError = error.message;
      resendDisabledUntil = Date.now() + resendBackoff(error.message);
    } catch (error) {
      resendError = error instanceof Error ? error.message : "Unknown Resend error";
      resendDisabledUntil = Date.now() + resendBackoff(resendError);
    }
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailPassword) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPassword },
      });

      await transporter.sendMail({
        from: `"${sender.name}" <${gmailUser}>`,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        replyTo: input.replyTo,
        attachments: input.attachments?.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.content,
        })),
      });

      return { ok: true, provider: "nodemailer" };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown SMTP error";
      return {
        ok: false,
        provider: "nodemailer",
        error: `${resendError ? `Resend: ${resendError}. ` : ""}Gmail: ${message}`,
      };
    }
  }

  return {
    ok: false,
    provider: "none",
    error: resendError ?? "No email transport configured (RESEND_API_KEY or GMAIL_* missing).",
  };
}

/** Address that receives booking notifications. */
export async function getHostEmail(): Promise<string> {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
    if (settings?.contactEmail?.trim()) return settings.contactEmail.trim();
  } catch {
    // fall through
  }
  return process.env.GMAIL_USER || "kidusamanuel0371@gmail.com";
}
