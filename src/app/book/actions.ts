"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashIdentifier, rateLimit } from "@/lib/rate-limit";
import { notifyHostOfNewRequest } from "@/lib/booking/notifications";
import { isValidTimeZone, zonedDateTimeToUtc } from "@/lib/booking/time";
import { MAX_ADVANCE_DAYS, MIN_LEAD_MINUTES, PLATFORMS } from "@/lib/booking/types";

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().trim().email("Please enter a valid email address.").max(120),
  phone: z.string().trim().max(32).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  topic: z.string().trim().min(3, "Please add a short topic.").max(140),
  notes: z.string().trim().max(2000).optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid date."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Please choose a valid time."),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(15, "Minimum duration is 15 minutes.")
    .max(180, "Maximum duration is 180 minutes."),
  timezone: z.string().trim().min(1, "Please choose a timezone.").max(64),
  platform: z.enum(PLATFORMS),
});

export type BookingFormResult = { ok: true; id: string } | { ok: false; error: string };

export async function submitBooking(input: unknown): Promise<BookingFormResult> {
  const parsed = bookingSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid booking details." };
  }

  const data = parsed.data;

  if (!isValidTimeZone(data.timezone)) {
    return { ok: false, error: "That timezone is not recognised." };
  }

  if (data.platform === "WHATSAPP" && !data.phone) {
    return { ok: false, error: "WhatsApp meetings need a phone number in international format." };
  }

  let startsAt: Date;
  try {
    startsAt = zonedDateTimeToUtc(data.date, data.time, data.timezone);
  } catch {
    return { ok: false, error: "That date and time could not be read." };
  }

  const now = Date.now();
  if (startsAt.getTime() < now + MIN_LEAD_MINUTES * 60 * 1000) {
    return {
      ok: false,
      error: `Please pick a time at least ${MIN_LEAD_MINUTES} minutes from now.`,
    };
  }

  if (startsAt.getTime() > now + MAX_ADVANCE_DAYS * 24 * 60 * 60 * 1000) {
    return { ok: false, error: `Bookings can be made up to ${MAX_ADVANCE_DAYS} days ahead.` };
  }

  // Best-effort spam guard (per-instance, see lib/rate-limit.ts).
  const forwardedFor = headers().get("x-forwarded-for") ?? headers().get("x-real-ip") ?? "unknown";
  const clientKey = hashIdentifier(forwardedFor.split(",")[0].trim());
  const limit = rateLimit(`booking:${clientKey}`, 5, 60 * 60 * 1000);

  if (!limit.allowed) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfterSeconds / 60));
    return {
      ok: false,
      error: `Too many booking requests. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  const endsAt = new Date(startsAt.getTime() + data.durationMinutes * 60 * 1000);

  // Do not stack duplicate requests for the same slot.
  const duplicate = await prisma.booking.findFirst({
    where: {
      requesterEmail: data.email.toLowerCase(),
      status: "PENDING",
      startsAt,
    },
    select: { id: true },
  });

  if (duplicate) {
    return { ok: false, error: "You already have a pending request for that exact time." };
  }

  const booking = await prisma.booking.create({
    data: {
      requesterName: data.name,
      requesterEmail: data.email.toLowerCase(),
      requesterPhone: data.phone || null,
      requesterCompany: data.company || null,
      requesterTimezone: data.timezone,
      topic: data.topic,
      notes: data.notes || null,
      durationMinutes: data.durationMinutes,
      proposedAt: startsAt,
      startsAt,
      endsAt,
      platform: data.platform,
      status: "PENDING",
    },
  });

  // Never let a mail outage fail the request.
  try {
    await notifyHostOfNewRequest(booking);
  } catch (error) {
    console.error("[BOOKING] Failed to notify host:", error instanceof Error ? error.message : error);
  }

  return { ok: true, id: booking.id };
}
