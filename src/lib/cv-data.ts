import { prisma } from "@/lib/db";

export interface CvProfile {
  fullName: string;
  headline: string;
  contactEmail: string;
  phone: string;
  location: string;
  websiteUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  summary: string;
}

export interface CvExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
  order: number;
}

export interface CvEducation {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  order: number;
}

export interface CvSkillGroup {
  category: string;
  skills: string[];
}

export interface CvProject {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  link?: string | null;
  github?: string | null;
  featured: boolean;
  order: number;
}

export interface CvCertificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string | null;
  order: number;
}

export interface CvData {
  profile: CvProfile;
  experience: CvExperience[];
  education: CvEducation[];
  skills: CvSkillGroup[];
  projects: CvProject[];
  certifications: CvCertificate[];
}

const fallbackProfile: CvProfile = {
  fullName: "Kidus Amanuel",
  headline: "Full-Stack Engineer & AI Builder",
  contactEmail: "kidusamanuel@yahoo.com",
  phone: "+251 900 000 000",
  location: "Addis Ababa, Ethiopia (Open to Remote)",
  websiteUrl: "https://kidus.dev",
  linkedinUrl: "https://linkedin.com/in/kidus-amanuel",
  githubUrl: "https://github.com/Kidus-Amanuel",
  summary:
    "Product-focused full-stack software engineer with 3+ years of experience delivering performant SaaS web applications and production AI workflows. Specialized in Next.js App Router, TypeScript, PostgreSQL, and LLM integrations.",
};

const fallbackExperiences: CvExperience[] = [
  {
    id: "exp-fallback-1",
    company: "Ethiopian Airlines",
    role: "IT Trainee / Software Engineer",
    startDate: "2023",
    endDate: "Present",
    description:
      "Optimized legacy enterprise system performance reducing load times by 40%.\nTransitioning mission-critical airline workflows into modern web services.\nArchitecting automated monitoring pipelines and internal developer tooling.",
    bullets: [
      "Optimized legacy enterprise system performance, reducing page load times by 40%.",
      "Transitioning mission-critical enterprise workflows into high-throughput modern services.",
      "Architected automated data reconciliation pipelines improving data consistency.",
    ],
    order: 0,
  },
];

const fallbackEducation: CvEducation[] = [
  {
    id: "edu-fallback-1",
    school: "Debre Tabor University",
    degree: "BSc in Electrical & Computer Engineering",
    startDate: "2019",
    endDate: "2025",
    description: "Foundation in computer systems architecture, algorithms, and hardware-software integration.",
    order: 0,
  },
];

const fallbackSkills: CvSkillGroup[] = [
  {
    category: "Languages & Core",
    skills: ["TypeScript", "JavaScript (ESNext)", "Python", "SQL", "HTML5/CSS3"],
  },
  {
    category: "Frameworks & Frontend",
    skills: ["Next.js (App Router)", "React 18", "Tailwind CSS", "Framer Motion", "Three.js"],
  },
  {
    category: "Backend & Cloud",
    skills: ["Node.js", "PostgreSQL", "Neon DB", "Supabase", "REST APIs", "Prisma ORM"],
  },
  {
    category: "AI & Modern Tooling",
    skills: ["Vercel AI SDK", "Prompt Engineering", "pgvector", "RAG Architectures", "Git/GitHub"],
  },
];

const fallbackProjects: CvProject[] = [
  {
    id: "proj-fallback-1",
    title: "AI Cover Letter & CV Engine",
    category: "AI Integration / SaaS",
    description:
      "Engineered real-time streaming LLM system tailoring ATS-optimized cover letters and dynamic PDF generation.",
    tags: ["Next.js", "Vercel AI SDK", "@react-pdf/renderer", "PostgreSQL"],
    link: "https://kidus.dev",
    github: "https://github.com/Kidus-Amanuel",
    featured: true,
    order: 0,
  },
  {
    id: "proj-fallback-2",
    title: "Full-Stack SaaS Platform",
    category: "Full-Stack SaaS",
    description:
      "Multi-tenant application featuring role-based access, real-time analytics, and automated email campaign queue.",
    tags: ["React", "TypeScript", "Tailwind", "Neon Postgres", "Prisma"],
    link: "https://kidus.dev",
    github: "https://github.com/Kidus-Amanuel",
    featured: true,
    order: 1,
  },
];

function parseBullets(description: string): string[] {
  if (!description) return [];
  return description
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•\-*]+/, "").trim())
    .filter((line) => line.length > 0);
}

export async function getCvData(): Promise<CvData> {
  try {
    const [settings, experiences, educations, skillsList, projects, certificates] =
      await Promise.all([
        prisma.siteSettings.findUnique({ where: { id: "global" } }).catch(() => null),
        prisma.experience.findMany({ orderBy: { order: "asc" } }).catch(() => []),
        prisma.education.findMany({ orderBy: { order: "asc" } }).catch(() => []),
        prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }).catch(() => []),
        prisma.project.findMany({ orderBy: { order: "asc" } }).catch(() => []),
        prisma.certificate.findMany({ orderBy: { order: "asc" } }).catch(() => []),
      ]);

    const profile: CvProfile = {
      fullName: settings?.fullName?.trim() || fallbackProfile.fullName,
      headline: settings?.headline?.trim() || fallbackProfile.headline,
      contactEmail: settings?.contactEmail?.trim() || fallbackProfile.contactEmail,
      phone: settings?.phone?.trim() || fallbackProfile.phone,
      location: settings?.location?.trim() || fallbackProfile.location,
      websiteUrl: settings?.websiteUrl?.trim() || fallbackProfile.websiteUrl,
      linkedinUrl: settings?.linkedinUrl?.trim() || fallbackProfile.linkedinUrl,
      githubUrl: settings?.githubUrl?.trim() || fallbackProfile.githubUrl,
      summary: settings?.summary?.trim() || fallbackProfile.summary,
    };

    const formattedExperiences: CvExperience[] =
      experiences.length > 0
        ? experiences.map((exp) => ({
            id: exp.id,
            company: exp.company,
            role: exp.role,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description,
            bullets: parseBullets(exp.description),
            order: exp.order,
          }))
        : fallbackExperiences;

    const formattedEducation: CvEducation[] =
      educations.length > 0
        ? educations.map((edu) => ({
            id: edu.id,
            school: edu.school,
            degree: edu.degree,
            startDate: edu.startDate,
            endDate: edu.endDate,
            description: edu.description,
            order: edu.order,
          }))
        : fallbackEducation;

    let formattedSkills: CvSkillGroup[] = [];
    if (skillsList.length > 0) {
      const groupMap = new Map<string, string[]>();
      for (const s of skillsList) {
        const cat = s.category || "General";
        if (!groupMap.has(cat)) groupMap.set(cat, []);
        groupMap.get(cat)!.push(s.name);
      }
      formattedSkills = Array.from(groupMap.entries()).map(([category, skills]) => ({
        category,
        skills,
      }));
    } else {
      formattedSkills = fallbackSkills;
    }

    const formattedProjects: CvProject[] =
      projects.length > 0
        ? projects.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            description: p.description,
            tags: p.tags,
            link: p.link,
            github: p.github,
            featured: p.featured,
            order: p.order,
          }))
        : fallbackProjects;

    const formattedCertificates: CvCertificate[] = certificates.map((c) => ({
      id: c.id,
      name: c.name,
      issuer: c.issuer,
      date: c.date,
      url: c.url,
      order: c.order,
    }));

    return {
      profile,
      experience: formattedExperiences,
      education: formattedEducation,
      skills: formattedSkills,
      projects: formattedProjects,
      certifications: formattedCertificates,
    };
  } catch (error) {
    console.error("Error fetching CV data from database:", error);
    return {
      profile: fallbackProfile,
      experience: fallbackExperiences,
      education: fallbackEducation,
      skills: fallbackSkills,
      projects: fallbackProjects,
      certifications: [],
    };
  }
}
