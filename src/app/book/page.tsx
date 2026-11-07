import type { Metadata } from "next";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = {
  title: "Book a meeting | Kidus Amanuel",
  description:
    "Request a one-on-one meeting with Kidus Amanuel. Pick Google Meet, Zoom, WhatsApp or Telegram and get a calendar invite with reminders for both of us.",
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-28 sm:pt-32 pb-20 px-5 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">Booking</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
          Let&apos;s talk.
        </h1>
        <p className="text-mutedForeground text-base sm:text-lg leading-relaxed max-w-2xl mb-12">
          Pick a time that suits you and choose how we should meet. Once I accept, a Google Calendar
          invitation with reminders lands in both our calendars, together with your meeting link.
        </p>

        <BookingForm />

        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="text-white/50 mb-1">Response time</p>
            <p className="text-white">Usually within a day</p>
          </div>
          <div>
            <p className="text-white/50 mb-1">Reminders</p>
            <p className="text-white">24 hours and 1 hour before</p>
          </div>
          <div>
            <p className="text-white/50 mb-1">Timezone</p>
            <p className="text-white">Handled automatically</p>
          </div>
        </div>
      </div>
    </main>
  );
}
