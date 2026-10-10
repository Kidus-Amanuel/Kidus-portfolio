import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const maxDuration = 60; // Max time for a cron job
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Basic security check (Optional: Vercel CRON_SECRET header)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Find campaigns that are running and due for their next batch
    const now = new Date();
    const campaigns = await prisma.emailCampaign.findMany({
      where: {
        status: "RUNNING",
        OR: [{ nextRunAt: null }, { nextRunAt: { lte: now } }],
      },
      include: { template: true },
    });

    if (campaigns.length === 0) {
      return NextResponse.json({ message: "No campaigns to process right now." });
    }

    // Initialize Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    let totalSentThisRun = 0;

    // 3. Process each due campaign
    for (const campaign of campaigns) {
      // Get the next batch of pending deliveries
      const deliveries = await prisma.emailDelivery.findMany({
        where: { campaignId: campaign.id, status: "PENDING" },
        include: { subscriber: true },
        take: campaign.batchSize,
      });

      if (deliveries.length === 0) {
        // Campaign finished
        await prisma.emailCampaign.update({
          where: { id: campaign.id },
          data: { status: "COMPLETED", nextRunAt: null },
        });
        continue;
      }

      // Process batch
      for (const delivery of deliveries) {
        try {
          const s = delivery.subscriber;
          const subject = campaign.template.subject.replace(/\{\{name\}\}/gi, s.name || "there");
          const html = campaign.template.html
            .replace(/\{\{name\}\}/gi, s.name || "there")
            .replace(/\{\{email\}\}/gi, s.email);

          await transporter.sendMail({
            from: `"Kidus Amanuel" <${process.env.GMAIL_USER}>`,
            to: s.email,
            subject,
            html: html + `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px;"><tr><td align="center" style="font-family: sans-serif; font-size: 12px; color: #888;">You're receiving this because you subscribed to updates from Kidus Amanuel.<br/><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(s.email)}" style="color: #555; text-decoration: underline;">Unsubscribe</a></td></tr></table>`,
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

      // Update nextRunAt
      const nextRunAt = new Date(now.getTime() + campaign.intervalMinutes * 60000);
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { nextRunAt },
      });
    }

    return NextResponse.json({ success: true, processedCampaigns: campaigns.length, totalSentThisRun });
  } catch (error) {
    console.error("Cron email processor failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
