import { prisma } from "@/lib/db";

/**
 * Runtime configuration for the booking integrations.
 *
 * Every key can be supplied either through an environment variable (same
 * name) or through the admin UI, which stores it in the `AppSetting` table.
 * Environment variables win so a deployment can override stored values.
 */
export const SETTING_KEYS = [
  "APP_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "GOOGLE_CALENDAR_ID",
  "ZOOM_ACCOUNT_ID",
  "ZOOM_CLIENT_ID",
  "ZOOM_CLIENT_SECRET",
  "ZOOM_USER_ID",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "TELEGRAM_CHAT_USERNAME",
  "WHATSAPP_ACCESS_TOKEN",
  "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_GRAPH_VERSION",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];

export async function getSetting(key: SettingKey): Promise<string | null> {
  const fromEnv = process.env[key];
  if (fromEnv && fromEnv.trim()) return fromEnv.trim();

  try {
    const row = await prisma.appSetting.findUnique({ where: { key } });
    const value = row?.value?.trim();
    return value ? value : null;
  } catch {
    return null;
  }
}

export async function getSettings(keys: readonly SettingKey[]): Promise<Record<string, string | null>> {
  const entries = await Promise.all(
    keys.map(async (key) => [key, await getSetting(key)] as const),
  );
  return Object.fromEntries(entries);
}

export async function setSetting(key: SettingKey, value: string | null): Promise<void> {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    await prisma.appSetting.deleteMany({ where: { key } });
    return;
  }

  await prisma.appSetting.upsert({
    where: { key },
    update: { value: trimmed },
    create: { key, value: trimmed },
  });
}

/**
 * Public base URL of the deployment. Used for OAuth redirect URIs and for
 * links inside emails.
 */
export async function getAppUrl(): Promise<string> {
  const configured = await getSetting("APP_URL");
  const fromEnv = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  const base = configured || fromEnv || "https://kidus-portfolio-gray.vercel.app";
  return base.replace(/\/+$/, "");
}
