import { getSetting } from "@/lib/settings";

/** Strip formatting and keep digits; WhatsApp links need the full international number. */
export function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  const normalized = digits.startsWith("00") ? digits.slice(2) : digits;
  if (normalized.length < 8 || normalized.length > 15) return null;
  return normalized;
}

/**
 * wa.me deep link — opens WhatsApp with the message pre-filled.
 * Works without any WhatsApp Business account or API approval.
 */
export function buildWhatsAppLink(phone: string, message: string): string | null {
  const digits = normalizePhone(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Optional: send the message through the WhatsApp Cloud API.
 * Falls back to the deep link when the API is not configured or fails.
 */
export async function sendWhatsAppMessage(input: {
  to: string;
  body: string;
}): Promise<{ ok: boolean; error?: string }> {
  const accessToken = await getSetting("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = await getSetting("WHATSAPP_PHONE_NUMBER_ID");
  const graphVersion = (await getSetting("WHATSAPP_GRAPH_VERSION")) || "v22.0";

  if (!accessToken || !phoneNumberId) {
    return { ok: false, error: "WhatsApp Cloud API is not configured." };
  }

  const digits = normalizePhone(input.to);
  if (!digits) return { ok: false, error: "Invalid WhatsApp number." };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${graphVersion}/${encodeURIComponent(phoneNumberId)}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: digits,
          type: "text",
          text: { preview_url: true, body: input.body },
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 200);
      return { ok: false, error: `WhatsApp API error ${response.status}: ${detail}` };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unknown WhatsApp error" };
  }
}
