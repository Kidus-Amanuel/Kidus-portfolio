import { CalendarClock } from "lucide-react";
import { prisma } from "@/lib/db";
import { BookingCard, BookingCardData } from "./BookingCard";
import {
  dateInputValue,
  formatDateTimeInZone,
  HOST_TIME_ZONE,
  timeInputValue,
} from "@/lib/booking/time";

export const dynamic = "force-dynamic";

type BookingRow = Awaited<ReturnType<typeof prisma.booking.findMany>>[number];

function toCardData(booking: BookingRow): BookingCardData {
  return {
    id: booking.id,
    requesterName: booking.requesterName,
    requesterEmail: booking.requesterEmail,
    requesterPhone: booking.requesterPhone,
    requesterCompany: booking.requesterCompany,
    requesterTimezone: booking.requesterTimezone,
    topic: booking.topic,
    notes: booking.notes,
    durationMinutes: booking.durationMinutes,
    platform: booking.platform,
    status: booking.status,
    meetingUrl: booking.meetingUrl,
    calendarHtmlLink: booking.calendarHtmlLink,
    failureReason: booking.failureReason,
    proposedAtIso: booking.proposedAt.toISOString(),
    proposedAtHost: formatDateTimeInZone(booking.proposedAt, HOST_TIME_ZONE),
    proposedAtVisitor: formatDateTimeInZone(booking.proposedAt, booking.requesterTimezone),
    startsAtHost: formatDateTimeInZone(booking.startsAt, HOST_TIME_ZONE),
    startsAtVisitor: formatDateTimeInZone(booking.startsAt, booking.requesterTimezone),
    defaultDate: dateInputValue(booking.startsAt, HOST_TIME_ZONE),
    defaultTime: timeInputValue(booking.startsAt, HOST_TIME_ZONE),
  };
}

export default async function AdminBookingsPage() {
  let bookings: BookingRow[] = [];

  try {
    bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    // DB not connected yet
  }

  const pending = bookings
    .filter((booking) => booking.status === "PENDING")
    .sort((a, b) => a.proposedAt.getTime() - b.proposedAt.getTime());

  const confirmed = bookings
    .filter((booking) => booking.status === "ACCEPTED")
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

  const closed = bookings
    .filter((booking) => booking.status !== "PENDING" && booking.status !== "ACCEPTED")
    .sort((a, b) => b.proposedAt.getTime() - a.proposedAt.getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Bookings</h1>
        {pending.length > 0 && (
          <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-400/20 px-3 py-1.5 rounded-full">
            {pending.length} awaiting decision
          </span>
        )}
      </div>
      <p className="text-white/50 mb-10">
        Accept a request to create the calendar event, generate the meeting link and email both sides.
      </p>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-white/10 rounded-2xl text-center text-white/30">
          <CalendarClock className="w-10 h-10 mb-3" />
          <p>No booking requests yet. Share /book to start receiving them.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {pending.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                Awaiting decision
              </h2>
              <div className="space-y-4">
                {pending.map((booking) => (
                  <BookingCard key={booking.id} booking={toCardData(booking)} />
                ))}
              </div>
            </section>
          )}

          {confirmed.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">Confirmed</h2>
              <div className="space-y-4">
                {confirmed.map((booking) => (
                  <BookingCard key={booking.id} booking={toCardData(booking)} />
                ))}
              </div>
            </section>
          )}

          {closed.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">Closed</h2>
              <div className="space-y-4">
                {closed.map((booking) => (
                  <BookingCard key={booking.id} booking={toCardData(booking)} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
