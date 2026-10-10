import { NextResponse } from "next/server";
import { processEmailBatches } from "@/lib/email-processor";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const result = await processEmailBatches();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Cron email processor failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
