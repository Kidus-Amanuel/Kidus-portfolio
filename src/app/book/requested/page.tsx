import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Request received | Kidus Amanuel",
  robots: { index: false, follow: false },
};

export default function BookingRequestedPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-28 sm:pt-32 pb-20 px-5 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">Booking</p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">Request received</h1>
        <p className="text-mutedForeground leading-relaxed mb-10">
          Your request is with me now. I confirm every booking personally, and you will receive a Google
          Calendar invitation with reminders for both of us — plus your meeting link — as soon as I accept.
        </p>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider border border-white/20 px-5 py-3 rounded-full hover:bg-white/10 transition-colors"
        >
          Book another meeting
        </Link>
      </div>
    </main>
  );
}
