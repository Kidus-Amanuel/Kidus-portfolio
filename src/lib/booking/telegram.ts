import { getSetting } from "@/lib/settings";

export interface TelegramResult {
  ok: boolean;
  /** Per-booking invite link (bot must be an admin of the chat). */
  inviteLink?: string;
  /** Public chat link, used as a fallback. */
  chatLink?: string;
  /** Whether the bot posted the booking details into the chat. */
  messageSent?: boolean;
  error?: string;
}

interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

interface ChatInviteLink {
  invite_link?: string;
}

interface TelegramMessage {
  message_id?: number;
}

/** Telegram rejects expire_date values more than 30 days out. */
const MAX_INVITE_LIFETIME_MS = 29 * 24 * 60 * 60 * 1000;

/**
 * Publish the booking into a Telegram chat.
 *
 * The Bot API can no longer start video chats, so "Telegram" here means:
 * a one-click invite link into your group/channel plus a message with the
 * meeting details. The bot must be an administrator of that chat.
 */
export async function publishTelegramBooking(input: {
  chatId: string;
  bookingId: string;
  topic: string;
  attendeeName: string;
  startsAtLabel: string;
  meetingUrl?: string | null;
  expiresAt: Date;
}): Promise<TelegramResult> {
  const [botToken, chatUsername] = await Promise.all([
    getSetting("TELEGRAM_BOT_TOKEN"),
    getSetting("TELEGRAM_CHAT_USERNAME"),
  ]);

  const chatLink = chatUsername ? `https://t.me/${chatUsername.replace(/^@/, "")}` : undefined;

  if (!botToken || !input.chatId) {
    return {
      ok: false,
      chatLink,
      error: "Telegram is not configured — add a bot token and a chat id.",
    };
  }

  const api = (method: string) => `https://api.telegram.org/bot${botToken}/${method}`;

  const warning: string[] = [];

  // 1. Per-booking invite link.
  let inviteLink: string | undefined;
  try {
    const requestedExpiry = Math.floor(input.expiresAt.getTime() / 1000);
    const maxExpiry = Math.floor((Date.now() + MAX_INVITE_LIFETIME_MS) / 1000);
    const expireDate = Math.min(requestedExpiry, maxExpiry);

    const response = await fetch(api("createChatInviteLink"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: input.chatId,
        name: `booking-${input.bookingId.slice(0, 16)}`,
        expire_date: expireDate,
        member_limit: 10,
      }),
      cache: "no-store",
    });

    const data = (await response.json()) as TelegramResponse<ChatInviteLink>;

    if (response.ok && data.ok && data.result?.invite_link) {
      inviteLink = data.result.invite_link;
    } else {
      warning.push(data.description ?? `Telegram invite link failed (${response.status}).`);
    }
  } catch (error) {
    warning.push(error instanceof Error ? error.message : "Unknown Telegram invite error");
  }

  // 2. Post the booking details into the chat.
  let messageSent = false;
  try {
    const text = [
      `📅 <b>New booking request</b>`,
      `<b>Topic:</b> ${escapeHtml(input.topic)}`,
      `<b>From:</b> ${escapeHtml(input.attendeeName)}`,
      `<b>When:</b> ${escapeHtml(input.startsAtLabel)}`,
      input.meetingUrl ? `<b>Meeting:</b> ${escapeHtml(input.meetingUrl)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetch(api("sendMessage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: input.chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      cache: "no-store",
    });

    const data = (await response.json()) as TelegramResponse<TelegramMessage>;
    messageSent = response.ok && data.ok;
    if (!messageSent) warning.push(data.description ?? `Telegram message failed (${response.status}).`);
  } catch (error) {
    warning.push(error instanceof Error ? error.message : "Unknown Telegram message error");
  }

  return {
    ok: Boolean(inviteLink || messageSent || chatLink),
    inviteLink,
    chatLink,
    messageSent,
    error: warning.length ? warning.join(" ") : undefined,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
