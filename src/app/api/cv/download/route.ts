import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { getCvData } from "@/lib/cv-data";
import { CvDocument } from "@/components/pdf/CvDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cvData = await getCvData();
    const element = React.createElement(CvDocument, { data: cvData });
    // @react-pdf/renderer expects a Document element
    const pdfBuffer = await renderToBuffer(element as unknown as React.ReactElement<any>);

    const safeFilename = `${cvData.profile.fullName.replace(/[^a-zA-Z0-9_-]/g, "-")}-CV.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Server error generating CV PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to generate CV PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
