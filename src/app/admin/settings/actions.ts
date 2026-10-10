"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
  });
  
  if (!settings) {
    return await prisma.siteSettings.create({
      data: { id: "global" }
    });
  }
  
  return settings;
}

export async function updateSettings(data: {
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
  return { success: true };
}
