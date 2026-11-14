import { prisma } from "@/lib/db";
import { SkillsClient } from "./SkillsClient";

const fallbackSkills: Record<string, string[]> = {
  "Core Stack": ["Next.js App Router", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  "Backend & DB": ["Node.js", "Supabase", "PostgreSQL", "Neon DB", "Firebase"],
  "AI & Lab": ["Vercel AI SDK", "Prompt Engineering", "pgvector", "RAG Systems", "Three.js"],
};

export async function Skills() {
  let skillsData: Record<string, string[]> = {};

  try {
    const dbSkills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    if (dbSkills.length > 0) {
      for (const item of dbSkills) {
        const cat = item.category || "General";
        if (!skillsData[cat]) {
          skillsData[cat] = [];
        }
        skillsData[cat].push(item.name);
      }
    }
  } catch (err) {
    // If DB is empty or disconnected, use fallback
  }

  const finalSkills = Object.keys(skillsData).length > 0 ? skillsData : fallbackSkills;

  return <SkillsClient skillsData={finalSkills} />;
}
