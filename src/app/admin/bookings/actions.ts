"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { finalizeBookingMeeting } from "@/lib/booking/meeting";
import {
  notifyHostOfAcceptance,
  notifyRequesterOfAcceptance,
  notifyRequesterOfDecline,
} from "@/lib/booking/notifications";
import { HOST_TIME_ZONE, zonedDateTimeToUtc } from "@/lib/booking/time";

export interface BookingActionResult {
  ok: boolean;
  message: string;
}

export async function acceptBooking(formData: FormData): Promise<BookingActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Missing booking id." };

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return { ok: false, message: "Booking not found." };
  if (booking.status !== "PENDING") {
    return { ok: false, message: `This request was already processed (${booking.status}).` };
  }

  const override = String(formData.get("startsAt") ?? "").trim();
  const durationInput = Number(formData.get("durationMinutes") ?? 0);
  const manualMeetingUrl = String(formData.get("manualMeetingUrl") ?? "").trim();

  let startsAt = booking.startsAt;
  let durationMinutes = booking.durationMinutes;

  if (override) {
    const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/.exec(override);
    if (!match) return { ok: false, message: "The new date and time could not be read." };

    try {
      startsAt = zonedDateTimeToUtc(match[1], match[2], HOST_TIME_ZONE);
    } catch {
      return { ok: false, message: "The new date and time could not be read." };
    }

    if (durationInput >= 15 && durationInput <= 180) durationMinutes = durationInput;
  }

  if (startsAt.getTime() < Date.now()) {
    return { ok: false, message: "The meeting time is in the past." };
  }

  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60 * 1000);

  // Claim the booking so a double click cannot create two events.
  const claimed = await prisma.booking.updateMany({
    where: { id, status: "PENDING" },
    data: { status: "ACCEPTING", startsAt, endsAt, durationMinutes },
  });

  if (claimed.count === 0) {
    return { ok: false, message: "This request was already processed." };
  }

  try {
    const outcome = await finalizeBookingMeeting(
      { ...booking, startsAt, endsAt, durationMinutes },
      { manualMeetingUrl: manualMeetingUrl || null },
    );

    await prisma.booking.update({
      where: { id },
      data: {
        status: "ACCEPTED",
        decidedAt: new Date(),
        meetingUrl: outcome.meetingUrl,
        meetingId: outcome.meetingId,
        hostUrl: outcome.hostUrl,
        meetingPassword: outcome.meetingPassword,
        calendarEventId: outcome.calendarEventId,
        calendarHtmlLink: outcome.calendarHtmlLink,
        failureReason: outcome.warnings.length ? outcome.warnings.join(" | ") : null,
      },
    });

    const accepted = await prisma.booking.findUnique({ where: { id } });

    if (accepted) {
      try {
        await notifyRequesterOfAcceptance(accepted, outcome);
      } catch (error) {
        console.error("[BOOKING] Visitor confirmation email failed:", error instanceof Error ? error.message : error);
      }

      try {
        await notifyHostOfAcceptance(accepted, outcome);
      } catch (error) {
        console.error("[BOOKING] Host confirmation email failed:", error instanceof Error ? error.message : error);
      }
    }

    revalidatePath("/admin/bookings");

    return {
      ok: true,
      message: outcome.warnings.length
        ? `Accepted, but with warnings: ${outcome.warnings.join(" ")}`
        : "Accepted — calendar invitations and the meeting link are on their way.",
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";

    // Release the booking so it can be retried.
    await prisma.booking.update({
      where: { id },
      data: { status: "PENDING", failureReason: `Accept failed: ${reason}` },
    });

    return { ok: false, message: `Could not complete the booking: ${reason}` };
  }
}

export async function declineBooking(formData: FormData): Promise<BookingActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Missing booking id." };

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return { ok: false, message: "Booking not found." };
  if (booking.status !== "PENDING") {
    return { ok: false, message: `This request was already processed (${booking.status}).` };
  }

  await prisma.booking.update({
    where: { id },
    data: { status: "DECLINED", decidedAt: new Date(), failureReason: null },
  });

  try {
    await notifyRequesterOfDecline(booking);
  } catch (error) {
    console.error("[BOOKING] Decline email failed:", error instanceof Error ? error.message : error);
  }

  revalidatePath("/admin/bookings");
  return { ok: true, message: "Request declined and the visitor has been notified." };
}
