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
