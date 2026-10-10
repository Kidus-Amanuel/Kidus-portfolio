import { prisma } from "@/lib/db";
import { EmailerClient } from "./EmailerClient";
import { getCampaignsWithStats } from "./actions";

export const dynamic = 'force-dynamic';

export default async function EmailerPage() {
  let templates: any[] = [];
  let campaigns: any[] = [];
  try {
    templates = await prisma.emailTemplate.findMany({ orderBy: { createdAt: "desc" } });
    campaigns = await getCampaignsWithStats();
  } catch {
    // DB not ready
  }

  return <EmailerClient templates={templates} campaigns={campaigns} />;
}
