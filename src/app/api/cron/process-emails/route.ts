import { NextResponse } from "next/server";
import { processEmailBatches } from "@/lib/email-processor";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const reqTime = new Date().toISOString();
  const userAgent = req.headers.get("user-agent") || "unknown";
  console.log(`\n======================================================`);
  console.log(`[CRON API] Hit at ${reqTime} by UA: ${userAgent}`);

  try {
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      const expectedHeader = `Bearer ${cronSecret}`;
      
      if (authHeader !== expectedHeader) {
        console.warn(`[CRON API] ⚠️ 401 Unauthorized!`);
        console.warn(`[CRON API] Received: ${authHeader ? `${authHeader.slice(0, 15)}...` : 'NONE'}`);
        console.warn(`[CRON API] Expected Bearer token matching CRON_SECRET`);

        return NextResponse.json(
          {
            error: "Unauthorized",
            message: "Authorization header does not match CRON_SECRET configured in Vercel environment variables.",
            receivedAuthHeader: !!authHeader,
          },
          { status: 401 }
        );
      }
      console.log(`[CRON API] ✓ Authorization verified successfully.`);
    } else {
      console.log(`[CRON API] ℹ️ CRON_SECRET not set in environment. Allowing request.`);
    }

    // Run the batch email processor
    console.log(`[CRON API] Calling processEmailBatches()...`);
    const result = await processEmailBatches();
    console.log(`[CRON API] Batch execution finished:`, result);
    console.log(`======================================================\n`);

    return NextResponse.json({
      success: true,
      timestamp: reqTime,
      ...result,
    });
  } catch (error: any) {
    console.error(`[CRON API] ❌ Unhandled error in cron email processor:`, error);
    console.log(`======================================================\n`);
    
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "Unknown error",
        timestamp: reqTime,
      },
      { status: 500 }
    );
  }
}
