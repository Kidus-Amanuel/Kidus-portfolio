import { prisma } from "@/lib/db";
import { EmailerClient } from "./EmailerClient";

export default async function EmailerPage() {
  let templates: any[] = [];
  try {
    templates = await prisma.emailTemplate.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    // DB not ready
  }

  return <EmailerClient templates={templates} />;
}
