import type { Booking } from "@prisma/client";
import { getHostEmail, sendEmail } from "@/lib/email";
import { getAppUrl } from "@/lib/settings";
import { buildIcs } from "./ics";
import { MeetingOutcome, meetingSummary } from "./meeting";
import { formatDateTimeInZone, HOST_TIME_ZONE } from "./time";
import { platformLabel } from "./types";
import { sendWhatsAppMessage } from "./whatsapp";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailShell(title: string, bodyHtml: string, cta?: { label: string; url: string }): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
            <tr>
              <td style="padding:28px 32px 8px 32px;">
                <p style="margin:0 0 4px 0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8a8a;">Kidus Amanuel</p>
                <h1 style="margin:0;font-size:22px;line-height:1.3;color:#111111;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 8px 32px;font-size:15px;line-height:1.6;color:#333333;">
                ${bodyHtml}
              </td>
            </tr>
            ${
              cta
                ? `<tr><td style="padding:16px 32px 8px 32px;">
                     <a href="${cta.url}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;font-weight:600;">${escapeHtml(cta.label)}</a>
                   </td></tr>`
                : ""
            }
            <tr>
              <td style="padding:24px 32px 28px 32px;border-top:1px solid #eeeeee;">
                <p style="margin:0;font-size:12px;color:#999999;">Sent automatically by the booking system on https://kidus-portfolio-gray.vercel.app.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function timeRows(booking: Booking): string {
  const visitorTime = formatDateTimeInZone(booking.startsAt, booking.requesterTimezone);
  const hostTime = formatDateTimeInZone(booking.startsAt, HOST_TIME_ZONE);
  const sameZone = booking.requesterTimezone === HOST_TIME_ZONE;

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      <tr><td style="padding:6px 0;color:#888888;font-size:13px;">Your time</td><td align="right" style="padding:6px 0;color:#111111;font-weight:600;">${escapeHtml(visitorTime)}</td></tr>
      ${
        sameZone
          ? ""
          : `<tr><td style="padding:6px 0;color:#888888;font-size:13px;">My time</td><td align="right" style="padding:6px 0;color:#111111;font-weight:600;">${escapeHtml(hostTime)}</td></tr>`
      }
      <tr><td style="padding:6px 0;color:#888888;font-size:13px;">Duration</td><td align="right" style="padding:6px 0;color:#111111;font-weight:600;">${booking.durationMinutes} minutes</td></tr>
      <tr><td style="padding:6px 0;color:#888888;font-size:13px;">Platform</td><td align="right" style="padding:6px 0;color:#111111;font-weight:600;">${escapeHtml(platformLabel(booking.platform))}</td></tr>
    </table>`;
}

/** Tell the host that a new request is waiting for a decision. */
export async function notifyHostOfNewRequest(booking: Booking): Promise<void> {
  const hostEmail = await getHostEmail();
  const appUrl = await getAppUrl();

  const body = `
    <p><strong>${escapeHtml(booking.requesterName)}</strong> wants to meet about
    <strong>${escapeHtml(booking.topic)}</strong>.</p>
    ${timeRows(booking)}
    <p style="color:#555555;font-size:14px;">
      ${booking.requesterCompany ? `Company: ${escapeHtml(booking.requesterCompany)}<br/>` : ""}
      Email: <a href="mailto:${booking.requesterEmail}" style="color:#111111;">${escapeHtml(booking.requesterEmail)}</a>
      ${booking.requesterPhone ? `<br/>Phone: ${escapeHtml(booking.requesterPhone)}` : ""}
    </p>
    ${booking.notes ? `<p style="color:#555555;font-size:14px;"><strong>Notes:</strong><br/>${escapeHtml(booking.notes)}</p>` : ""}
    <p style="color:#888888;font-size:13px;">Confirm or decline this request from the admin bookings inbox.</p>`;

  await sendEmail({
    to: hostEmail,
    subject: `New booking request — ${booking.topic}`,
    html: emailShell("New booking request", body, {
      label: "Review in admin",
      url: `${appUrl}/admin/bookings`,
    }),
    text: `New booking request from ${booking.requesterName} (${booking.requesterEmail}) about "${booking.topic}". Review it at ${appUrl}/admin/bookings`,
  });
}

/** Confirmation email sent to the visitor once the host accepts. */
export async function notifyRequesterOfAcceptance(
  booking: Booking,
  outcome: MeetingOutcome,
): Promise<void> {
  const appUrl = await getAppUrl();

  const joinBlock = outcome.meetingUrl
    ? `<p style="margin:20px 0;">
         <a href="${outcome.meetingUrl}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;font-weight:600;">Join the ${escapeHtml(platformLabel(booking.platform))} meeting</a>
       </p>
       <p style="color:#888888;font-size:12px;word-break:break-all;">${escapeHtml(outcome.meetingUrl)}</p>`
    : `<p style="color:#555555;font-size:14px;">The meeting link will be shared by Kidus shortly — a calendar invitation is on its way.</p>`;

  const body = `
    <p>Hi ${escapeHtml(booking.requesterName)}, your booking is <strong>confirmed</strong>.</p>
    ${timeRows(booking)}
    ${joinBlock}
    <p style="color:#555555;font-size:14px;">
      ${
        outcome.calendarEventId
          ? "A Google Calendar invitation with reminders has been sent to both of us."
          : "The attached <strong>.ics</strong> file adds the meeting to your calendar with a 24h and a 1h reminder."
      }
    </p>
    <p style="color:#555555;font-size:14px;">Need to change something? Just reply to this email.</p>`;

  const attachments = outcome.calendarEventId
    ? undefined
    : [
        {
          filename: "kidus-meeting.ics",
          content: buildIcs({
            uid: `${booking.id}@${new URL(appUrl).hostname}`,
            summary: meetingSummary(booking),
            description: `Topic: ${booking.topic}\nBooked through https://kidus-portfolio-gray.vercel.app`,
            location: outcome.meetingUrl ?? undefined,
            url: outcome.meetingUrl ?? undefined,
            start: booking.startsAt,
            end: booking.endsAt,
            organizerName: "Kidus Amanuel",
            organizerEmail: await getHostEmail(),
          }),
        },
      ];

  await sendEmail({
    to: booking.requesterEmail,
    subject: `Confirmed: ${booking.topic}`,
    html: emailShell("Your meeting is confirmed", body, outcome.meetingUrl ? {
      label: "Join the meeting",
      url: outcome.meetingUrl,
    } : undefined),
    text: `Your meeting "${booking.topic}" is confirmed. Join link: ${outcome.meetingUrl ?? "to follow"}`,
    attachments,
    replyTo: await getHostEmail(),
  });

  // Optional proactive WhatsApp message when the Cloud API is configured.
  if (booking.platform === "WHATSAPP" && booking.requesterPhone && outcome.meetingUrl) {
    await sendWhatsAppMessage({
      to: booking.requesterPhone,
      body: `Hi ${booking.requesterName}, your meeting "${booking.topic}" is confirmed for ${formatDateTimeInZone(
        booking.startsAt,
        HOST_TIME_ZONE,
      )} (EAT). Meet link: ${outcome.meetingUrl}`,
    });
  }
}

/** Copy of the confirmation sent to the host. */
export async function notifyHostOfAcceptance(booking: Booking, outcome: MeetingOutcome): Promise<void> {
  const hostEmail = await getHostEmail();

  const body = `
    <p><strong>${escapeHtml(booking.requesterName)}</strong> is confirmed for
    <strong>${escapeHtml(booking.topic)}</strong>.</p>
    ${timeRows(booking)}
    ${
      outcome.meetingUrl
        ? `<p style="color:#555555;font-size:14px;word-break:break-all;">Join link: ${escapeHtml(outcome.meetingUrl)}</p>`
        : "<p style=\"color:#555555;font-size:14px;\">No meeting link was generated — add one manually if needed.</p>"
    }
    ${
      outcome.hostUrl
        ? `<p style="color:#555555;font-size:14px;word-break:break-all;">Host start link: ${escapeHtml(outcome.hostUrl)}</p>`
        : ""
    }
    ${
      outcome.calendarHtmlLink
        ? `<p style="color:#555555;font-size:14px;"><a href="${outcome.calendarHtmlLink}" style="color:#111111;">Open the calendar event</a></p>`
        : "<p style=\"color:#888888;font-size:13px;\">No calendar event was created — connect Google Calendar in Integrations.</p>"
    }
    ${
      outcome.warnings.length
        ? `<p style="color:#888888;font-size:13px;">Warnings: ${escapeHtml(outcome.warnings.join(" "))}</p>`
        : ""
    }`;

  await sendEmail({
    to: hostEmail,
    subject: `Booking confirmed — ${booking.requesterName}`,
    html: emailShell("Booking confirmed", body),
    text: `Booking confirmed with ${booking.requesterName} for ${booking.topic}. Join link: ${outcome.meetingUrl ?? "none"}`,
  });
}

/** Polite decline sent to the visitor. */
export async function notifyRequesterOfDecline(booking: Booking): Promise<void> {
  const hostEmail = await getHostEmail();

  const body = `
    <p>Hi ${escapeHtml(booking.requesterName)},</p>
    <p>Thanks for reaching out about <strong>${escapeHtml(booking.topic)}</strong>.
    Unfortunately I am not available for that slot.</p>
    <p>You are welcome to send me another time — I usually reply within a day.</p>`;

  await sendEmail({
    to: booking.requesterEmail,
    subject: `About your meeting request — ${booking.topic}`,
    html: emailShell("Scheduling update", body),
    text: `Thanks for your booking request about "${booking.topic}". I am not available for that slot — please try another time.`,
    replyTo: hostEmail,
  });
}
