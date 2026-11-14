import { getCvData } from "@/lib/cv-data";
import { CvView } from "./CvView";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kidus Amanuel – Curriculum Vitae",
  description: "Curriculum Vitae of Kidus Amanuel – Full-Stack & AI Engineer",
};

export default async function CvPage() {
  const data = await getCvData();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b1220] flex items-center justify-center text-white/50 text-sm">
          Loading CV…
        </div>
      }
    >
      <CvView data={data} />
    </Suspense>
  );
}
