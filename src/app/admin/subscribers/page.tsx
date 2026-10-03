import { prisma } from "@/lib/db";
import { SubscribersClient } from "./SubscribersClient";

export default async function SubscribersPage() {
  let subscribers: any[] = [];
  try {
    subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    // DB not ready
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Subscribers</h1>
        <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
          {subscribers.filter(s => s.status === "active").length} active
        </span>
      </div>
      <p className="text-white/50 mb-10">Add individually or bulk-import via CSV. These are the recipients for your email campaigns.</p>
      <SubscribersClient subscribers={subscribers} />
    </div>
  );
}
