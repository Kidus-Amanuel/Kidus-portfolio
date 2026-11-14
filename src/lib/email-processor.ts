import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

export interface BatchProcessingResult {
  processedCampaigns: number;
  totalSentThisRun: number;
  message?: string;
  details?: Array<{
    campaignId: string;
    email: string;
    status: "SENT" | "FAILED" | "SKIPPED";
    reason?: string;
  }>;
}

export async function processEmailBatches(): Promise<BatchProcessingResult> {
  const now = new Date();
  console.log(`[EMAIL PROCESSOR] ──────────────────────────────────────────────`);
  console.log(`[EMAIL PROCESSOR] Run initiated at ${now.toISOString()}`);

  // Check email transport credentials
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    const errorMsg = "GMAIL_USER or GMAIL_APP_PASSWORD missing in environment variables.";
    console.error(`[EMAIL PROCESSOR] ❌ ${errorMsg}`);
    return {
      processedCampaigns: 0,
      totalSentThisRun: 0,
      message: errorMsg,
    };
  }

  // Find campaigns ready to run
  const campaigns = await prisma.emailCampaign.findMany({
    where: {
      status: "RUNNING",
      OR: [{ nextRunAt: null }, { nextRunAt: { lte: now } }],
    },
    include: { template: true },
  });

  console.log(`[EMAIL PROCESSOR] Found ${campaigns.length} RUNNING campaign(s) eligible for processing.`);

  if (campaigns.length === 0) {
    const totalRunning = await prisma.emailCampaign.count({ where: { status: "RUNNING" } });
    const totalPaused = await prisma.emailCampaign.count({ where: { status: "PAUSED" } });
    const pendingDeliveries = await prisma.emailDelivery.count({ where: { status: "PENDING" } });

    const statusNote = `No campaigns due right now. (Stats: ${totalRunning} running, ${totalPaused} paused, ${pendingDeliveries} pending deliveries in queue).`;
    console.log(`[EMAIL PROCESSOR] ℹ️ ${statusNote}`);
    return {
      processedCampaigns: 0,
      totalSentThisRun: 0,
      message: statusNote,
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  let totalSentThisRun = 0;
  const deliveryDetails: Array<{
    campaignId: string;
    email: string;
    status: "SENT" | "FAILED" | "SKIPPED";
    reason?: string;
  }> = [];

  for (const campaign of campaigns) {
    console.log(`\n[EMAIL PROCESSOR] Processing Campaign ID: ${campaign.id}`);
    console.log(`[EMAIL PROCESSOR] Batch Size configured: ${campaign.batchSize}, Interval: ${campaign.intervalMinutes}m`);

    const deliveries = await prisma.emailDelivery.findMany({
      where: { campaignId: campaign.id, status: "PENDING" },
      include: { subscriber: true },
      take: campaign.batchSize,
    });

    console.log(`[EMAIL PROCESSOR] Found ${deliveries.length} pending deliveries for this batch.`);

    if (deliveries.length === 0) {
      console.log(`[EMAIL PROCESSOR] All deliveries completed for Campaign ${campaign.id}. Marking COMPLETED.`);
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: "COMPLETED", nextRunAt: null },
      });
      continue;
    }

    const siteSettings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
    const linkedinUrl = siteSettings?.linkedinUrl || "https://linkedin.com/in/kidus-amanuel";
    const githubUrl = siteSettings?.githubUrl || "https://github.com/Kidus-Amanuel";
    const portfolioUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "https://kidus-portfolio-gray.vercel.app";

    for (const delivery of deliveries) {
      const s = delivery.subscriber;

      // Skip if they unsubscribed while waiting in the queue
      if (s.status === "unsubscribed") {
        console.log(`[EMAIL PROCESSOR] ⚠️ Skipping ${s.email} — subscriber has unsubscribed.`);
        await prisma.emailDelivery.update({
          where: { id: delivery.id },
          data: { status: "FAILED", error: "User unsubscribed" },
        });
        deliveryDetails.push({
          campaignId: campaign.id,
          email: s.email,
          status: "SKIPPED",
          reason: "User unsubscribed",
        });
        continue;
      }

      try {
        const unsubUrl = `${portfolioUrl}/unsubscribe?email=${encodeURIComponent(s.email)}`;
        let subject = campaign.template.subject;
        let html = campaign.template.html;

        // Replace both {{name}} and {name} formats
        const replaceVars = (text: string) => {
          return text
            .replace(/\{\{?name\}?\}/gi, s.name || "there")
            .replace(/\{\{?email\}?\}/gi, s.email)
            .replace(/\{\{?portfolio_url\}?\}/gi, portfolioUrl)
            .replace(/\{\{?linkedin_url\}?\}/gi, linkedinUrl)
            .replace(/\{\{?github_url\}?\}/gi, githubUrl)
            .replace(/\{\{?unsubscribe_url\}?\}/gi, unsubUrl);
        };

        subject = replaceVars(subject);
        html = replaceVars(html);

        const footer = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:40px;border-top:1px solid #eaeaea;padding-top:20px;"><tr><td align="center" style="font-family:sans-serif;font-size:12px;color:#888;">You're receiving this because you subscribed to updates from Kidus Amanuel.<br/><a href="${unsubUrl}" style="color:#555;text-decoration:underline;">Unsubscribe</a></td></tr></table>`;

        console.log(`[EMAIL PROCESSOR] 📤 Sending to ${s.email}...`);

        await transporter.sendMail({
          from: `"Kidus Amanuel" <${gmailUser}>`,
          to: s.email,
          subject,
          html: html + footer,
        });

        await prisma.emailDelivery.update({
          where: { id: delivery.id },
          data: { status: "SENT", sentAt: new Date() },
        });

        console.log(`[EMAIL PROCESSOR] ✓ Successfully delivered to ${s.email}`);
        totalSentThisRun++;
        deliveryDetails.push({
          campaignId: campaign.id,
          email: s.email,
          status: "SENT",
        });
      } catch (error: any) {
        const errorText = error?.message || "Unknown error";
        console.error(`[EMAIL PROCESSOR] ✗ Failed to send to ${s.email}:`, errorText);

        await prisma.emailDelivery.update({
          where: { id: delivery.id },
          data: { status: "FAILED", error: errorText },
        });

        deliveryDetails.push({
          campaignId: campaign.id,
          email: s.email,
          status: "FAILED",
          reason: errorText,
        });
      }
    }

    // Schedule next run
    const nextRunAt = new Date(now.getTime() + campaign.intervalMinutes * 60000);
    console.log(`[EMAIL PROCESSOR] Campaign ${campaign.id} nextRunAt scheduled for ${nextRunAt.toISOString()}`);

    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { nextRunAt },
    });
  }

  console.log(`\n[EMAIL PROCESSOR] Summary: Sent ${totalSentThisRun} email(s) across ${campaigns.length} campaign(s).`);
  console.log(`[EMAIL PROCESSOR] ──────────────────────────────────────────────`);

  return {
    processedCampaigns: campaigns.length,
    totalSentThisRun,
    details: deliveryDetails,
    message: `Processed ${campaigns.length} campaign(s), sent ${totalSentThisRun} email(s).`,
  };
}
