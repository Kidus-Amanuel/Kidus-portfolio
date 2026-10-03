"use server";

import { prisma } from "@/lib/db";

export async function submitContact(data: { name: string; email: string; message: string }) {
  try {
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to submit contact:", error);
    return { success: false, error: "Failed to submit" };
  }
}

export async function acceptInvite(data: { senderName: string; friendName: string; plan: string }) {
  try {
    await prisma.inviteResponse.create({
      data: {
        senderName: data.senderName,
        friendName: data.friendName,
        plan: data.plan,
        // Optional: Hash IP for rate limiting here
      }
    });
    // Optional: We can add a Telegram/Email notification hook here later
    return { success: true };
  } catch (error) {
    console.error("Failed to accept invite:", error);
    return { success: false, error: "Failed to submit" };
  }
}
