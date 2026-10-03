import { prisma } from "@/lib/db";
import { ProjectCard } from "@/components/ui/ProjectCard";

const hardcodedProjects = [
  {
    title: "AI Cover Letter Builder",
    category: "Lab / AI Integration",
    description: "Paste a job description and Gemini 1.5 Pro instantly streams a highly tailored cover letter proving why my Next.js and AI experience makes me the perfect fit.",
    tags: ["Vercel AI SDK", "Gemini 1.5 Pro", "Tailwind"],
    link: "/lab/cover-letter"
  },
  {
    title: "Yes-Only Invite",
    category: "Lab / Interactive",
    description: "A playful web game for inviting friends where the 'No' button playfully dodges cursor interactions. Built to prove execution speed and UI polish.",
    tags: ["Next.js", "Framer Motion", "Supabase", "Server Actions"],
    link: "/lab/invite/new"
  },
  {
    title: "[SaaS Product Name]",
    category: "Full-Stack SaaS",
    description: "A comprehensive dashboard for [industry] that scaled to [METRIC] users. Features complex data visualization and role-based access.",
    tags: ["React", "TypeScript", "Tailwind", "PostgreSQL"],
    link: "/work/saas-product"
  }
];

export async function Projects() {
  let dbProjects: any[] = [];
  try {
    dbProjects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  } catch {
    // DB not connected yet
  }

  // Graceful fallback: If nothing is in the database yet, show the hardcoded ones!
  const displayProjects = dbProjects.length > 0 ? dbProjects : hardcodedProjects;

  return (
    <section id="work" className="py-8 md:py-12 px-6 md:px-12 lg:px-24 bg-black border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm font-medium opacity-50 uppercase tracking-widest mb-12">Featured Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProjects.map((project, i) => (
            <ProjectCard key={project.id || i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}