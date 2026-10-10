import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

export async function processEmailBatches(): Promise<{
  processedCampaigns: number;
  totalSentThisRun: number;
  message?: string;
}> {
  const now = new Date();

  const campaigns = await prisma.emailCampaign.findMany({
    where: {
      status: "RUNNING",
      OR: [{ nextRunAt: null }, { nextRunAt: { lte: now } }],
    },
    include: { template: true },
  });

  if (campaigns.length === 0) {
    return { processedCampaigns: 0, totalSentThisRun: 0, message: "No campaigns to process right now." };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  let totalSentThisRun = 0;

  for (const campaign of campaigns) {
    const deliveries = await prisma.emailDelivery.findMany({
      where: { campaignId: campaign.id, status: "PENDING" },
      include: { subscriber: true },
      take: campaign.batchSize,
    });

    if (deliveries.length === 0) {
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: "COMPLETED", nextRunAt: null },
      });
      continue;
    }

    const siteSettings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
    const linkedinUrl = siteSettings?.linkedinUrl || "https://linkedin.com/in/kidus-amanuel";
    const githubUrl = siteSettings?.githubUrl || "https://github.com/Kidus-Amanuel";
    const portfolioUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kidus.dev";
    
    for (const delivery of deliveries) {
      try {
        const s = delivery.subscriber;
        
        // Skip if they unsubscribed while waiting in the queue
        if (s.status === "unsubscribed") {
          await prisma.emailDelivery.update({
            where: { id: delivery.id },
            data: { status: "FAILED", error: "User unsubscribed" },
          });
          continue;
        }

        const unsubUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(s.email)}`;
        
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

        await transporter.sendMail({
          from: `"Kidus Amanuel" <${process.env.GMAIL_USER}>`,
          to: s.email,
          subject,
          html: html + footer,
        });

        await prisma.emailDelivery.update({
          where: { id: delivery.id },
          data: { status: "SENT", sentAt: new Date() },
        });
        totalSentThisRun++;
      } catch (error: any) {
        console.error("Failed to send to", delivery.subscriber.email, error);
        await prisma.emailDelivery.update({
          where: { id: delivery.id },
          data: { status: "FAILED", error: error?.message || "Unknown error" },
        });
      }
    }

    const nextRunAt = new Date(now.getTime() + campaign.intervalMinutes * 60000);
    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { nextRunAt },
    });
  }

  return { processedCampaigns: campaigns.length, totalSentThisRun };
}
