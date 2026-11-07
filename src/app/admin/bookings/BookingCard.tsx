"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { acceptBooking, declineBooking } from "./actions";

export interface BookingCardData {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string | null;
  requesterCompany: string | null;
  requesterTimezone: string;
  topic: string;
  notes: string | null;
  durationMinutes: number;
  platform: string;
  status: string;
  meetingUrl: string | null;
  calendarHtmlLink: string | null;
  failureReason: string | null;
  proposedAtIso: string;
  proposedAtHost: string;
  proposedAtVisitor: string;
  startsAtHost: string;
  startsAtVisitor: string;
  defaultDate: string;
  defaultTime: string;
}

export function BookingCard({ booking }: { booking: BookingCardData }) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [expanded, setExpanded] = useState(false);

  function handleAccept(formData: FormData) {
    setFeedback(null);
    startTransition(async () => {
      const result = await acceptBooking(formData);
      setFeedback({ ok: result.ok, text: result.message });
    });
  }

  function handleDecline(formData: FormData) {
    setFeedback(null);
    startTransition(async () => {
      const result = await declineBooking(formData);
      setFeedback({ ok: result.ok, text: result.message });
    });
  }

  const isPending = booking.status === "PENDING";

  return (
    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
          <div>
            <h3 className="font-bold text-lg">{booking.requesterName}</h3>
            <a
              href={`mailto:${booking.requesterEmail}`}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {booking.requesterEmail}
            </a>
            {booking.requesterPhone && (
              <a
                href={`tel:${booking.requesterPhone}`}
                className="text-sm text-white/50 hover:text-white transition-colors ml-3"
              >
                {booking.requesterPhone}
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider border border-white/15 px-3 py-1.5 rounded-full text-white/60">
              {booking.platform.replace("_", " ")}
            </span>
            <span
              className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full ${
                booking.status === "ACCEPTED"
                  ? "bg-green-500/15 text-green-300 border border-green-400/20"
                  : booking.status === "DECLINED"
                    ? "bg-red-500/15 text-red-300 border border-red-400/20"
                    : "bg-white/10 text-white/70 border border-white/15"
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        <p className="text-white/80 text-sm mb-1">{booking.topic}</p>
        {booking.requesterCompany && (
          <p className="text-white/40 text-xs mb-1">{booking.requesterCompany}</p>
        )}

        <p className="text-xs text-white/50 mt-3">
          {booking.startsAtHost}
          {booking.requesterTimezone !== "Africa/Nairobi" && (
            <span className="text-white/30"> · their time: {booking.startsAtVisitor}</span>
          )}
          {" · "}
          {booking.durationMinutes} min
        </p>

        {booking.notes && (
          <p className="mt-3 text-sm text-white/60 border-l-2 border-white/15 pl-3 whitespace-pre-wrap">
            {booking.notes}
          </p>
        )}

        {booking.meetingUrl && (
          <a
            href={booking.meetingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-xs border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            Open meeting link
          </a>
        )}

        {booking.calendarHtmlLink && (
          <a
            href={booking.calendarHtmlLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 ml-2 inline-block text-xs border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            Calendar event
          </a>
        )}

        {booking.failureReason && (
          <p className="mt-4 text-xs text-amber-300/80 bg-amber-500/10 border border-amber-400/20 rounded-xl px-3 py-2">
            {booking.failureReason}
          </p>
        )}
      </div>

      {isPending && (
        <div className="border-t border-white/10 bg-black/20 p-6">
          {!expanded ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors"
              >
                Review &amp; accept
              </button>
              <form action={handleDecline}>
                <input type="hidden" name="id" value={booking.id} />
                <button
                  type="submit"
                  disabled={pending}
                  className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Decline
                </button>
              </form>
            </div>
          ) : (
            <form action={handleAccept} className="space-y-5">
              <input type="hidden" name="id" value={booking.id} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">
                    Date &amp; time (EAT)
                  </label>
                  <input
                    type="datetime-local"
                    name="startsAt"
                    defaultValue={`${booking.defaultDate}T${booking.defaultTime}`}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/30 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Duration</label>
                  <select
                    name="durationMinutes"
                    defaultValue={booking.durationMinutes}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                  >
                    {[15, 30, 45, 60, 90, 120].map((duration) => (
                      <option key={duration} value={duration}>
                        {duration} minutes
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">
                    Manual link (optional)
                  </label>
                  <input
                    type="url"
                    name="manualMeetingUrl"
                    placeholder="https://…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <p className="text-xs text-white/40">
                Leave the date empty to keep the proposed time. A manual link overrides the generated
                one — useful when a provider is not connected yet.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={pending}
                  className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {pending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Accept &amp; send invites
                </button>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {feedback && (
            <p
              className={`mt-4 text-sm rounded-xl px-4 py-3 border ${
                feedback.ok
                  ? "text-green-300 bg-green-500/10 border-green-400/20"
                  : "text-red-300 bg-red-500/10 border-red-400/20"
              }`}
            >
              {feedback.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
