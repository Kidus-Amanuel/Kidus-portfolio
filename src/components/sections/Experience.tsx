import { prisma } from "@/lib/db";
import { ExperienceCard } from "@/components/ui/ExperienceCard";

const fallbackExperiences = [
  {
    company: "Ethiopian Airlines",
    role: "IT Trainee",
    startDate: "2023",
    endDate: "Present",
    description: "Optimized legacy system performance reducing load times.\nTransitioning enterprise workflows into modern architecture."
  }
];

export async function Experience() {
  let dbExperience: any[] = [];
  try {
    dbExperience = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  } catch {
    // DB not synced
  }

  const displayExperience = dbExperience.length > 0 ? dbExperience : fallbackExperiences;

  return (
    <section id="experience" className="py-8 md:py-12 px-6 md:px-12 lg:px-24 bg-black border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-sm font-medium opacity-50 uppercase tracking-widest mb-16 text-center">Experience</h2>
        <div className="space-y-12">
          {displayExperience.map((exp, i) => (
            <ExperienceCard key={exp.id || i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}