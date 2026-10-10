import { getCampaignsWithStats } from "../actions";
import { QueueClient } from "./QueueClient";

export const dynamic = 'force-dynamic';

export default async function QueuePage() {
  let campaigns: any[] = [];
  try {
    campaigns = await getCampaignsWithStats();
  } catch {
    // DB not ready
  }

  return <QueueClient campaigns={campaigns} />;
}
