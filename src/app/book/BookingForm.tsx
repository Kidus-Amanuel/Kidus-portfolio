"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Camera, Check, Loader2, MessageCircle, Send, Video } from "lucide-react";
import { submitBooking } from "./actions";
import { COMMON_TIME_ZONES, formatDateTimeInZone, zonedDateTimeToUtc } from "@/lib/booking/time";
import { DURATIONS, PLATFORM_DESCRIPTIONS, PLATFORM_LABELS, PLATFORMS, Platform } from "@/lib/booking/types";

const PLATFORM_ICONS: Record<Platform, typeof Video> = {
  GOOGLE_MEET: Video,
  ZOOM: Camera,
  WHATSAPP: MessageCircle,
  TELEGRAM: Send,
};

function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    topic: "",
    notes: "",
    date: "",
    time: "",
    durationMinutes: 30,
    timezone: "Africa/Nairobi",
    platform: "GOOGLE_MEET" as Platform,
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => localDateString(new Date()), []);
  const maxDate = useMemo(() => {
    const limit = new Date();
    limit.setDate(limit.getDate() + 180);
    return localDateString(limit);
  }, []);

  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected) setForm((current) => ({ ...current, timezone: detected }));
  }, []);

  const timeZones = useMemo(() => {
    const options = new Set<string>([...COMMON_TIME_ZONES, form.timezone]);
    return Array.from(options);
  }, [form.timezone]);

  const preview = useMemo(() => {
    if (!form.date || !form.time) return null;
    try {
      const instant = zonedDateTimeToUtc(form.date, form.time, form.timezone);
      return formatDateTimeInZone(instant, form.timezone);
    } catch {
      return null;
    }
  }, [form.date, form.time, form.timezone]);

  const update = (patch: Partial<typeof form>) => setForm((current) => ({ ...current, ...patch }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const result = await submitBooking(form);

    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("idle");
      setError(result.error);
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-white/15 rounded-3xl bg-white/5 p-8 sm:p-10"
      >
        <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center mb-6">
          <Check className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">Request received</h2>
        <p className="text-mutedForeground leading-relaxed">
          Thanks {form.name.split(" ")[0]} — your request for <strong className="text-white">{form.topic}</strong> is in.
          I review every request personally and will confirm by email, usually within a day.
        </p>
        {preview && (
          <p className="text-sm text-white/70 mt-4">
            You asked for <span className="text-white">{preview}</span> via {PLATFORM_LABELS[form.platform]}.
          </p>
        )}
        <p className="text-sm text-white/40 mt-6">
          Once you accept, a Google Calendar invitation with reminders lands in both calendars.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setForm({
              name: "",
              email: "",
              phone: "",
              company: "",
              topic: "",
              notes: "",
              date: "",
              time: "",
              durationMinutes: 30,
              timezone: form.timezone,
              platform: "GOOGLE_MEET",
            });
          }}
          className="mt-8 text-xs uppercase tracking-wider border border-white/20 px-5 py-3 rounded-full hover:bg-white/10 transition-colors"
        >
          Book another meeting
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Name</label>
          <input
            type="text"
            required
            maxLength={80}
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Email</label>
          <input
            type="email"
            required
            maxLength={120}
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
            className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors"
            placeholder="jane@company.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
            Phone {form.platform === "WHATSAPP" ? "(with country code)" : "(optional)"}
          </label>
          <input
            type="tel"
            required={form.platform === "WHATSAPP"}
            maxLength={32}
            value={form.phone}
            onChange={(e) => update({ phone: e.target.value })}
            className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors"
            placeholder="+251 91 234 5678"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
            Company (optional)
          </label>
          <input
            type="text"
            maxLength={120}
            value={form.company}
            onChange={(e) => update({ company: e.target.value })}
            className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors"
            placeholder="Acme Inc."
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Topic</label>
        <input
          type="text"
          required
          maxLength={140}
          value={form.topic}
          onChange={(e) => update({ topic: e.target.value })}
          className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors"
          placeholder="Portfolio review, freelance project, chat about AI..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Date</label>
          <input
            type="date"
            required
            min={today}
            max={maxDate}
            value={form.date}
            onChange={(e) => update({ date: e.target.value })}
            className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Time</label>
          <input
            type="time"
            required
            value={form.time}
            onChange={(e) => update({ time: e.target.value })}
            className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Duration</label>
          <select
            value={form.durationMinutes}
            onChange={(e) => update({ durationMinutes: Number(e.target.value) })}
            className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors"
          >
            {DURATIONS.map((duration) => (
              <option key={duration} value={duration} className="bg-black">
                {duration} minutes
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
          Your timezone
        </label>
        <select
          value={form.timezone}
          onChange={(e) => update({ timezone: e.target.value })}
          className="w-full sm:w-1/2 bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors"
        >
          {timeZones.map((zone) => (
            <option key={zone} value={zone} className="bg-black">
              {zone.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        {preview && (
          <p className="text-xs text-white/50 mt-3 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" /> {preview}
          </p>
        )}
      </div>

      <div>
        <p className="text-xs font-medium mb-4 opacity-50 uppercase tracking-wider">How should we meet?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLATFORMS.map((platform) => {
            const Icon = PLATFORM_ICONS[platform];
            const active = form.platform === platform;

            return (
              <button
                key={platform}
                type="button"
                onClick={() => update({ platform })}
                className={`flex items-start gap-4 text-left p-5 rounded-2xl border transition-colors ${
                  active
                    ? "border-white bg-white/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    active ? "bg-white text-black" : "bg-white/10 text-white/70"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium mb-1">{PLATFORM_LABELS[platform]}</span>
                  <span className="block text-xs text-white/50 leading-relaxed">
                    {PLATFORM_DESCRIPTIONS[platform]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
          Anything I should know? (optional)
        </label>
        <textarea
          maxLength={2000}
          value={form.notes}
          onChange={(e) => update({ notes: e.target.value })}
          className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors resize-none h-24"
          placeholder="Context, links, agenda..."
        />
      </div>

      {error && (
        <p className="text-sm text-red-300 border border-red-400/30 bg-red-500/10 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none w-full sm:w-auto disabled:opacity-70"
      >
        <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
        <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-white backdrop-blur-3xl transition-colors hover:bg-white/10">
          {status === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Sending...
            </>
          ) : (
            "Request a meeting"
          )}
        </span>
      </button>
    </form>
  );
}
