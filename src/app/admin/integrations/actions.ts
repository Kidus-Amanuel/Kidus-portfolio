"use server";

import { revalidatePath } from "next/cache";
import { getAppUrl, getSetting, getSettings, setSetting, SETTING_KEYS } from "@/lib/settings";
import { getGoogleRedirectUri } from "@/lib/booking/google-calendar";

export interface IntegrationStatus {
  google: boolean;
  zoom: boolean;
  telegram: boolean;
  whatsappCloud: boolean;
}

export interface IntegrationConfig {
  values: Record<string, string>;
  status: IntegrationStatus;
  redirectUri: string;
  appUrl: string;
}

export async function getIntegrationConfig(): Promise<IntegrationConfig> {
  const values = await getSettings(SETTING_KEYS);
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) flat[key] = value ?? "";

  const appUrl = await getAppUrl();
  const redirectUri = await getGoogleRedirectUri();

  return {
    values: flat,
    status: {
      google: Boolean(flat.GOOGLE_CLIENT_ID && flat.GOOGLE_CLIENT_SECRET && flat.GOOGLE_REFRESH_TOKEN),
      zoom: Boolean(
        flat.ZOOM_ACCOUNT_ID &&
          flat.ZOOM_CLIENT_ID &&
          flat.ZOOM_CLIENT_SECRET &&
          flat.ZOOM_USER_ID,
      ),
      telegram: Boolean(flat.TELEGRAM_BOT_TOKEN && flat.TELEGRAM_CHAT_ID),
      whatsappCloud: Boolean(flat.WHATSAPP_ACCESS_TOKEN && flat.WHATSAPP_PHONE_NUMBER_ID),
    },
    redirectUri,
    appUrl,
  };
}

export async function saveIntegrationSettings(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const allowed = new Set<string>(SETTING_KEYS);
  const entries = Array.from(formData.entries());

  for (const [key, rawValue] of entries) {
    if (!allowed.has(key)) continue;
    const value = typeof rawValue === "string" ? rawValue : "";
    await setSetting(key as (typeof SETTING_KEYS)[number], value);
  }

  revalidatePath("/admin/integrations");
  return { ok: true, message: "Integration settings saved." };
}

export async function clearIntegrationSetting(key: string): Promise<{ ok: boolean; message: string }> {
  if (!(SETTING_KEYS as readonly string[]).includes(key)) {
    return { ok: false, message: "Unknown setting." };
  }

  await setSetting(key as (typeof SETTING_KEYS)[number], null);
  revalidatePath("/admin/integrations");
  return { ok: true, message: `${key} cleared.` };
}

export async function getGoogleConnectionState(): Promise<{ connected: boolean }> {
  const refreshToken = await getSetting("GOOGLE_REFRESH_TOKEN");
  return { connected: Boolean(refreshToken) };
}
