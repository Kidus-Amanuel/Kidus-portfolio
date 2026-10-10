import { prisma } from "@/lib/db";
import { EmailerClient } from "./EmailerClient";
import { getCampaignsWithStats } from "./actions";

export const dynamic = 'force-dynamic';

export default async function EmailerPage() {
  let templates: any[] = [];
  let campaigns: any[] = [];
  let settings = null;
  try {
    templates = await prisma.emailTemplate.findMany({ orderBy: { createdAt: "desc" } });
    campaigns = await getCampaignsWithStats();
    settings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
  } catch {
    // DB not ready
  }

  return <EmailerClient templates={templates} campaigns={campaigns} settings={settings} />;
}
