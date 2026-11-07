"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, Eye, EyeOff, Loader2, Plug, Save } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getIntegrationConfig, saveIntegrationSettings } from "./actions";

const SECRET_FIELDS = new Set([
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "ZOOM_CLIENT_SECRET",
  "TELEGRAM_BOT_TOKEN",
  "WHATSAPP_ACCESS_TOKEN",
]);

interface Field {
  key: string;
  label: string;
  placeholder?: string;
  secret?: boolean;
  help?: string;
}

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
        active
          ? "bg-green-500/10 text-green-300 border-green-400/20"
          : "bg-white/5 text-white/50 border-white/15"
      }`}
    >
      {active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CircleDashed className="w-3.5 h-3.5" />}
      {label}
    </span>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  visible,
  onToggle,
}: {
  field: Field;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  const isSecret = SECRET_FIELDS.has(field.key);

  return (
    <div>
      <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
        {field.label}
      </label>
      <div className="relative">
        <input
          type={isSecret && !visible ? "password" : "text"}
          name={field.key}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 focus:outline-none focus:border-white/30 transition-colors text-sm"
        />
        {isSecret && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={visible ? "Hide value" : "Show value"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {field.help && <p className="text-xs text-white/35 mt-2 leading-relaxed">{field.help}</p>}
    </div>
  );
}

export default function IntegrationsClient() {
  const searchParams = useSearchParams();
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState({
    google: false,
    zoom: false,
    telegram: false,
    whatsappCloud: false,
  });
  const [redirectUri, setRedirectUri] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const googleState = searchParams.get("google");

  useEffect(() => {
    getIntegrationConfig().then((config) => {
      setValues(config.values);
      setStatus(config.status);
      setRedirectUri(config.redirectUri);
      setAppUrl(config.appUrl);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage(null);

    const result = await saveIntegrationSettings(formData);

    setSaving(false);
    setMessage({ ok: result.ok, text: result.message });

    if (result.ok) {
      const config = await getIntegrationConfig();
      setStatus(config.status);
    }
  }

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  const googleFields: Field[] = [
    {
      key: "GOOGLE_CLIENT_ID",
      label: "OAuth client ID",
      placeholder: "xxxx.apps.googleusercontent.com",
      help: "From Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID.",
    },
    {
      key: "GOOGLE_CLIENT_SECRET",
      label: "OAuth client secret",
      secret: true,
      help: "Same credential screen. Stored in your database, never written to logs.",
    },
    {
      key: "GOOGLE_CALENDAR_ID",
      label: "Calendar ID",
      placeholder: "primary",
      help: "Leave as “primary” to use the connected account's main calendar.",
    },
  ];

  const zoomFields: Field[] = [
    {
      key: "ZOOM_ACCOUNT_ID",
      label: "Account ID",
      placeholder: "1234567890",
      help: "Zoom Marketplace → your Server-to-Server OAuth app.",
    },
    {
      key: "ZOOM_CLIENT_ID",
      label: "Client ID",
      placeholder: "Client ID",
    },
    {
      key: "ZOOM_CLIENT_SECRET",
      label: "Client secret",
      secret: true,
    },
    {
      key: "ZOOM_USER_ID",
      label: "Host user ID or email",
      placeholder: "you@example.com",
      help: "The Zoom account that will host the meeting. Server-to-Server OAuth cannot use “me”.",
    },
  ];

  const telegramFields: Field[] = [
    {
      key: "TELEGRAM_BOT_TOKEN",
      label: "Bot token",
      secret: true,
      placeholder: "123456:ABC-DEF…",
      help: "Create a bot with @BotFather and add it as an admin of the target chat.",
    },
    {
      key: "TELEGRAM_CHAT_ID",
      label: "Chat ID",
      placeholder: "-1001234567890",
      help: "The group or channel where bookings should be posted. The bot must be an admin there.",
    },
    {
      key: "TELEGRAM_CHAT_USERNAME",
      label: "Chat username (optional)",
      placeholder: "mychannel",
      help: "Used as a fallback join link when the bot cannot create invite links.",
    },
  ];

  const whatsappFields: Field[] = [
    {
      key: "WHATSAPP_ACCESS_TOKEN",
      label: "Cloud API access token",
      secret: true,
      help: "Optional — WhatsApp deep links work without it. This sends the message for you.",
    },
    {
      key: "WHATSAPP_PHONE_NUMBER_ID",
      label: "Phone number ID",
      placeholder: "123456789012345",
    },
    {
      key: "WHATSAPP_GRAPH_VERSION",
      label: "Graph API version",
      placeholder: "v22.0",
      help: "Leave empty for the default.",
    },
  ];

  function renderSection(
    title: string,
    description: string,
    fields: Field[],
    badge: React.ReactNode,
    extra?: React.ReactNode,
  ) {
    return (
      <section className="border border-white/10 rounded-2xl bg-white/5 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-white/45 mt-1 max-w-xl leading-relaxed">{description}</p>
          </div>
          {badge}
        </div>
        {extra}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {fields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={values[field.key] ?? ""}
              onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
              visible={Boolean(visible[field.key])}
              onToggle={() =>
                setVisible((current) => ({ ...current, [field.key]: !current[field.key] }))
              }
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <Plug className="w-7 h-7" /> Integrations
      </h1>
      <p className="text-white/50 mb-10">
        Connect the meeting providers used by the booking system. Anything left empty falls back to a
        manual meeting link that you can paste when accepting a request.
      </p>

      {googleState === "connected" && (
        <p className="mb-6 text-sm text-green-300 bg-green-500/10 border border-green-400/20 rounded-xl px-4 py-3">
          Google Calendar connected. New bookings will now create a calendar event and send reminders
          to both sides.
        </p>
      )}
      {googleState && googleState !== "connected" && (
        <p className="mb-6 text-sm text-amber-300 bg-amber-500/10 border border-amber-400/20 rounded-xl px-4 py-3">
          Google Calendar connection failed ({googleState}). Check the client ID, secret and the redirect
          URI below.
        </p>
      )}

      <form action={handleSubmit} className="space-y-6">
        <section className="border border-white/10 rounded-2xl bg-white/5 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
            <div>
              <h2 className="text-xl font-bold">Deployment</h2>
              <p className="text-sm text-white/45 mt-1 max-w-xl leading-relaxed">
                The public URL of this app. Used for OAuth redirect URIs and links inside emails.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FieldInput
              field={{
                key: "APP_URL",
                label: "App URL",
                placeholder: "https://kidus.dev",
                help: "No trailing slash.",
              }}
              value={values.APP_URL ?? ""}
              onChange={(value) => setValues((current) => ({ ...current, APP_URL: value }))}
              visible
              onToggle={() => undefined}
            />
          </div>
        </section>

        {renderSection(
          "Google Calendar & Meet",
          "Creates the event on your calendar with the visitor as an attendee, so Google emails the invitation and both calendars get reminders. The same call generates the Google Meet link.",
          googleFields,
          <StatusBadge active={status.google} label={status.google ? "Connected" : "Not connected"} />,
          <div className="mt-6 bg-black/30 border border-white/10 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-white/40 mb-2">OAuth redirect URI</p>
            <code className="text-xs text-white/70 break-all">{redirectUri}</code>
            <p className="text-xs text-white/35 mt-3 leading-relaxed">
              Paste this exact value into the OAuth client&apos;s “Authorized redirect URIs”. Then
              enable the Google Calendar API for the project, save the client ID and secret below, and
              connect the account.
            </p>
            <a
              href="/api/google/connect"
              className="inline-flex items-center gap-2 mt-4 bg-white text-black px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/90 transition-colors"
            >
              {status.google ? "Reconnect Google Calendar" : "Connect Google Calendar"}
            </a>
          </div>,
        )}

        {renderSection(
          "Zoom",
          "Creates a scheduled Zoom meeting through a Server-to-Server OAuth app and stores the join link (plus a host-only start link).",
          zoomFields,
          <StatusBadge active={status.zoom} label={status.zoom ? "Configured" : "Not configured"} />,
        )}

        {renderSection(
          "Telegram",
          "Posts the booking into your Telegram group or channel and creates a one-click invite link. The bot must be an administrator of that chat.",
          telegramFields,
          <StatusBadge active={status.telegram} label={status.telegram ? "Configured" : "Not configured"} />,
        )}

        {renderSection(
          "WhatsApp",
          "Deep links (wa.me) always work — the visitor needs a phone number in international format. Adding the Cloud API lets you send the message for them.",
          whatsappFields,
          <StatusBadge
            active={status.whatsappCloud}
            label={status.whatsappCloud ? "Cloud API on" : "Deep links only"}
          />,
        )}

        <div className="pt-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save settings
          </button>
          {message && (
            <span className={`text-sm ${message.ok ? "text-green-300" : "text-red-300"}`}>
              {message.text}
            </span>
          )}
        </div>
      </form>

      <p className="text-xs text-white/30 mt-10 leading-relaxed">
        Current app URL: {appUrl}. Secrets are stored in the database and are never printed to logs.
      </p>
    </div>
  );
}
