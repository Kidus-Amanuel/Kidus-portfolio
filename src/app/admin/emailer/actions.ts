"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveTemplate(formData: FormData) {
  const name = formData.get("templateName") as string;
  const subject = formData.get("subject") as string;
  const html = formData.get("body") as string;

  if (!name || !subject || !html) return;

  await prisma.emailTemplate.create({
    data: { name, subject, html }
  });
  revalidatePath("/admin/emailer");
}

export async function deleteTemplate(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.emailTemplate.delete({ where: { id } });
  revalidatePath("/admin/emailer");
}

export async function createCampaign(templateId: string, batchSize: number, intervalMinutes: number) {
  const subscribers = await prisma.subscriber.findMany({ where: { status: "active" } });
  if (subscribers.length === 0) return { error: "No subscribers found" };

  const campaign = await prisma.emailCampaign.create({
    data: {
      templateId,
      status: "RUNNING",
      batchSize,
      intervalMinutes,
      nextRunAt: new Date(), // Start immediately
    }
  });

  const deliveryData = subscribers.map(sub => ({
    campaignId: campaign.id,
    subscriberId: sub.id,
    templateId,
    status: "PENDING",
  }));

  try {
    await prisma.emailDelivery.createMany({
      data: deliveryData,
      skipDuplicates: true, 
    });
  } catch (err) {
    console.error("Failed to create some deliveries, likely duplicates", err);
  }

  revalidatePath("/admin/emailer");
  return { success: true, campaignId: campaign.id };
}

export async function toggleCampaignStatus(id: string, currentStatus: string) {
  if (currentStatus === "RUNNING") {
    await prisma.emailCampaign.update({
      where: { id },
      data: { status: "PAUSED", nextRunAt: null }
    });
  } else if (currentStatus === "PAUSED") {
    await prisma.emailCampaign.update({
      where: { id },
      data: { status: "RUNNING", nextRunAt: new Date() }
    });
  }
  revalidatePath("/admin/emailer");
}

export async function getCampaignsWithStats() {
  const campaigns = await prisma.emailCampaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      template: true,
      deliveries: {
        select: { status: true }
      }
    }
  });

  return campaigns.map(c => {
    const total = c.deliveries.length;
    const sent = c.deliveries.filter(d => d.status === "SENT").length;
    const failed = c.deliveries.filter(d => d.status === "FAILED").length;
    const pending = c.deliveries.filter(d => d.status === "PENDING").length;
    return { ...c, total, sent, failed, pending };
  });
}

// Triggered from the admin Queue page — runs on the server so CRON_SECRET stays private
export async function triggerCronNow(): Promise<{ ok: boolean; message: string }> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const cronSecret = process.env.CRON_SECRET;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (cronSecret) {
      headers["Authorization"] = `Bearer ${cronSecret}`;
    }

    const res = await fetch(`${appUrl}/api/cron/process-emails`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, message: data?.error || `HTTP ${res.status}` };
    }

    revalidatePath("/admin/emailer/queue");
    return {
      ok: true,
      message: `Batch sent! ${data.totalSentThisRun ?? 0} email(s) processed across ${data.processedCampaigns ?? 0} campaign(s).`,
    };
  } catch (err: any) {
    return { ok: false, message: err?.message || "Unknown error" };
  }
}
