import { prisma } from "@/lib/db";
import { CvProfile } from "./cv-data";

export interface CoverLetterInput {
  company: string;
  role: string;
  recipientName?: string | null;
  recipientTitle?: string | null;
  companyAddress?: string | null;
  date?: string | null;
  body: string;
}

export interface CoverLetterRenderData {
  sender: CvProfile;
  recipient: {
    name: string;
    title: string;
    company: string;
    address: string;
  };
  date: string;
  subject: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
}

export function replacePlaceholders(
  text: string,
  variables: { company?: string; role?: string; recipient_name?: string }
): string {
  let result = text;
  if (variables.company) {
    result = result.replace(/\{\{\s*company\s*\}\}/gi, variables.company);
  }
  if (variables.role) {
    result = result.replace(/\{\{\s*role\s*\}\}/gi, variables.role);
  }
  if (variables.recipient_name) {
    result = result.replace(/\{\{\s*recipient_name\s*\}\}/gi, variables.recipient_name);
  }
  return result;
}

export async function prepareCoverLetterData(
  input: CoverLetterInput
): Promise<CoverLetterRenderData> {
  const settings = await prisma.siteSettings
    .findUnique({ where: { id: "global" } })
    .catch(() => null);

  const sender: CvProfile = {
    fullName: settings?.fullName?.trim() || "Kidus Amanuel",
    headline: settings?.headline?.trim() || "Full-Stack Engineer & AI Builder",
    contactEmail: settings?.contactEmail?.trim() || "kidusamanuel@yahoo.com",
    phone: settings?.phone?.trim() || "+251 900 000 000",
    location: settings?.location?.trim() || "Addis Ababa, Ethiopia (Open to Remote)",
    websiteUrl: settings?.websiteUrl?.trim() || "https://kidus-portfolio-gray.vercel.app",
    linkedinUrl: settings?.linkedinUrl?.trim() || "https://linkedin.com/in/kidus-amanuel",
    githubUrl: settings?.githubUrl?.trim() || "https://github.com/Kidus-Amanuel",
    summary: settings?.summary?.trim() || "",
  };

  const recipientName = input.recipientName?.trim() || "Hiring Team";
  const recipientTitle = input.recipientTitle?.trim() || "Hiring Manager";
  const company = input.company?.trim() || "Prospective Team";
  const role = input.role?.trim() || "Software Engineer";

  const processedBody = replacePlaceholders(input.body, {
    company,
    role,
    recipient_name: recipientName,
  });

  const rawParagraphs = processedBody
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const paragraphs =
    rawParagraphs.length > 0
      ? rawParagraphs
      : [
          `I am writing to express my enthusiastic interest in the ${role} position at ${company}. With my background in engineering performant web systems with Next.js, TypeScript, and modern AI architectures, I am eager to contribute to your team.`,
        ];

  const formattedDate =
    input.date?.trim() ||
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return {
    sender,
    recipient: {
      name: recipientName,
      title: recipientTitle,
      company,
      address: input.companyAddress?.trim() || "",
    },
    date: formattedDate,
    subject: `Application for ${role}`,
    salutation: `Dear ${recipientName},`,
    paragraphs,
    closing: "Sincerely,",
  };
}
