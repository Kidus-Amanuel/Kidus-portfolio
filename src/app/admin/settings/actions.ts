"use server";

import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
  });

  if (!settings) {
    return await prisma.siteSettings.create({
      data: { id: "global" },
    });
  }

  return settings;
}

export async function updateSettings(data: {
  fullName?: string;
  headline?: string;
  phone?: string;
  location?: string;
  websiteUrl?: string;
  summary?: string;
  contactEmail: string;
  senderEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  upworkUrl: string;
}) {
  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: data,
    create: {
      id: "global",
      ...data,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/api/cv/download");
  try {
    revalidateTag("cv-data");
  } catch {
    // tag revalidation fallback
  }

  return { success: true };
}
