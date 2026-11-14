import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { prepareCoverLetterData } from "@/lib/cover-letter-data";
import { CoverLetterDocument } from "@/components/pdf/CoverLetterDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(req.url);
    const company = url.searchParams.get("company") || "Company";
    const role = url.searchParams.get("role") || "Software Engineer";
    const recipientName = url.searchParams.get("recipientName") || undefined;
    const bodyContent =
      url.searchParams.get("body") ||
      `Application for ${role} position at ${company}.`;

    const letterData = await prepareCoverLetterData({
      company,
      role,
      recipientName,
      body: bodyContent,
    });

    const element = React.createElement(CoverLetterDocument, { data: letterData });
    const pdfBuffer = await renderToBuffer(element as unknown as React.ReactElement<any>);

    const filename = `Kidus-Amanuel-Cover-Letter-${params.id}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating cover letter PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to generate Cover Letter PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
