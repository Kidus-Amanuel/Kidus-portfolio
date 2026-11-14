"use server";
import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/content");
  revalidatePath("/api/cv/download");
  try {
    revalidateTag("cv-data");
  } catch {
    // tag revalidation fallback
  }
}

// --- EXPERIENCE ACTIONS ---
export async function addExperience(formData: FormData) {
  await prisma.experience.create({
    data: {
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      description: formData.get("description") as string,
      order: parseInt((formData.get("order") as string) || "0"),
    },
  });
  revalidateAll();
}

export async function deleteExperience(formData: FormData) {
  await prisma.experience.delete({ where: { id: formData.get("id") as string } });
  revalidateAll();
}

export async function editExperience(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.experience.update({
    where: { id },
    data: {
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      description: formData.get("description") as string,
      order: parseInt((formData.get("order") as string) || "0"),
    },
  });
  revalidateAll();
}

// --- PROJECT ACTIONS ---
export async function addProject(formData: FormData) {
  const tagsString = formData.get("tags") as string;
  const tags = tagsString
    ? tagsString
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  await prisma.project.create({
    data: {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      link: (formData.get("link") as string) || null,
      github: (formData.get("github") as string) || null,
      tags: tags,
      order: parseInt((formData.get("order") as string) || "0"),
    },
  });
  revalidateAll();
}

export async function deleteProject(formData: FormData) {
  await prisma.project.delete({ where: { id: formData.get("id") as string } });
  revalidateAll();
}

export async function editProject(formData: FormData) {
  const id = formData.get("id") as string;
  const tagsString = formData.get("tags") as string;
  const tags = tagsString
    ? tagsString
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  await prisma.project.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      link: (formData.get("link") as string) || null,
      github: (formData.get("github") as string) || null,
      tags,
      order: parseInt((formData.get("order") as string) || "0"),
    },
  });
  revalidateAll();
}

// --- CERTIFICATE ACTIONS ---
export async function addCertificate(formData: FormData) {
  await prisma.certificate.create({
    data: {
      name: formData.get("name") as string,
      issuer: formData.get("issuer") as string,
      date: formData.get("date") as string,
      url: (formData.get("url") as string) || null,
      order: parseInt((formData.get("order") as string) || "0"),
    },
  });
  revalidateAll();
}

export async function deleteCertificate(formData: FormData) {
  await prisma.certificate.delete({ where: { id: formData.get("id") as string } });
  revalidateAll();
}

export async function editCertificate(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.certificate.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      issuer: formData.get("issuer") as string,
      date: formData.get("date") as string,
      url: (formData.get("url") as string) || null,
      order: parseInt((formData.get("order") as string) || "0"),
    },
  });
  revalidateAll();
}

// --- SKILL ACTIONS ---
export async function addSkill(formData: FormData) {
  await prisma.skill.create({
    data: {
      category: formData.get("category") as string,
      name: formData.get("name") as string,
      order: parseInt((formData.get("order") as string) || "0"),
    },
  });
  revalidateAll();
}

export async function deleteSkill(formData: FormData) {
  await prisma.skill.delete({ where: { id: formData.get("id") as string } });
  revalidateAll();
}
