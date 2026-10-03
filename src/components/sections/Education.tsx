import { prisma } from "@/lib/db";
import { EducationCard } from "@/components/ui/EducationCard";

export async function Education() {
  let dbEducation: any[] = [];
  try {
    dbEducation = await prisma.education.findMany({ orderBy: { order: "asc" } });
  } catch {
    // DB not synced
  }

  // Fallback if the database is empty
  const displayEducation = dbEducation.length > 0 ? dbEducation : [
    {
      school: "Debre Tabor University",
      degree: "BSc Electrical & Computer Engineering",
      startDate: "2019",
      endDate: "2025",
      description: "Foundation in systems architecture and hardware-software integration."
    }
  ];

  return (
    <section id="education" className="py-8 md:py-12 px-6 md:px-12 lg:px-24 bg-black border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-sm font-medium opacity-50 uppercase tracking-widest mb-12 text-center">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayEducation.map((edu, i) => (
            <EducationCard key={edu.id || i} edu={edu} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}