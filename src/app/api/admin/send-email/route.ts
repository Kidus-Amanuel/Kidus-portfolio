import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { subject, body } = await req.json();

    if (!subject || !body) {
      return NextResponse.json({ error: "Subject and body are required." }, { status: 400 });
    }

    // Get all active subscribers from Neon DB
    const subscribers = await prisma.subscriber.findMany({
      where: { status: "active" },
      select: { email: true, name: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers found." }, { status: 404 });
    }

    // Create a Gmail SMTP transporter using your personal email + App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,        // e.g. kidus@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // Google App Password (not your real password)
      },
    });

    // Send one email per subscriber with personalization
    let sent = 0;
    for (const s of subscribers) {
      // Replace {{name}} with the subscriber's name (or "there" as fallback)
      const personalizedHtml = body
        .replace(/\{\{name\}\}/gi, s.name || "there")
        .replace(/\{\{email\}\}/gi, s.email);

      await transporter.sendMail({
        from: `"Kidus Amanuel" <${process.env.GMAIL_USER}>`,
        to: s.email,
        subject: subject.replace(/\{\{name\}\}/gi, s.name || "there"),
        html: `
          ${personalizedHtml}
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px;">
            <tr>
              <td align="center" style="font-family: sans-serif; font-size: 12px; color: #888;">
                You're receiving this because you subscribed to updates from Kidus Amanuel.<br/>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(s.email)}" style="color: #555; text-decoration: underline;">Unsubscribe</a>
              </td>
            </tr>
          </table>
        `,
      });
      sent++;
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Failed to send emails." }, { status: 500 });
  }
}
