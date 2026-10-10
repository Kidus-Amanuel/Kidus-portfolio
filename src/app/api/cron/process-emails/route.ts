import { NextResponse } from "next/server";
import { processEmailBatches } from "@/lib/email-processor";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await processEmailBatches();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Cron email processor failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
