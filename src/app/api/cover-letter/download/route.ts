import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { prepareCoverLetterData } from "@/lib/cover-letter-data";
import { CoverLetterDocument } from "@/components/pdf/CoverLetterDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      company = "Company",
      role = "Software Engineer",
      recipientName,
      recipientTitle,
      companyAddress,
      date,
      content = "",
    } = body;

    const letterData = await prepareCoverLetterData({
      company,
      role,
      recipientName,
      recipientTitle,
      companyAddress,
      date,
      body: content,
    });

    const element = React.createElement(CoverLetterDocument, { data: letterData });
    const pdfBuffer = await renderToBuffer(element as unknown as React.ReactElement<any>);

    const safeRole = role.replace(/[^a-zA-Z0-9_-]/g, "-");
    const safeCompany = company.replace(/[^a-zA-Z0-9_-]/g, "-");
    const filename = `Kidus-Amanuel-Cover-Letter-${safeCompany}-${safeRole}.pdf`;

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
