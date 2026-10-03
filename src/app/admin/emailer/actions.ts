"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveTemplate(formData: FormData) {
  const name = formData.get("templateName") as string;
  const subject = formData.get("subject") as string;
  const html = formData.get("body") as string;

  if (!name || !subject || !html) return;

  await prisma.emailTemplate.create({
    data: { name, subject, html }
  });
  revalidatePath("/admin/emailer");
}

export async function deleteTemplate(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.emailTemplate.delete({ where: { id } });
  revalidatePath("/admin/emailer");
}
