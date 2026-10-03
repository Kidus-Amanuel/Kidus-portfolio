"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addSubscriber(formData: FormData) {
  const email = (formData.get("email") as string).trim().toLowerCase();
  const name = (formData.get("name") as string)?.trim() || null;

  await prisma.subscriber.upsert({
    where: { email },
    create: { email, name, status: "active" },
    update: { name, status: "active" },
  });
  revalidatePath("/admin/subscribers");
}

export async function importSubscribers(rows: { name?: string; email: string }[]) {
  "use server";
  let imported = 0;
  let skipped = 0;
  for (const row of rows) {
    const email = row.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) { skipped++; continue; }
    await prisma.subscriber.upsert({
      where: { email },
      create: { email, name: row.name?.trim() || null, status: "active" },
      update: { name: row.name?.trim() || null, status: "active" },
    });
    imported++;
  }
  revalidatePath("/admin/subscribers");
  return { imported, skipped };
}

export async function deleteSubscriber(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.subscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
}

export async function toggleSubscriberStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const currentStatus = formData.get("status") as string;
  await prisma.subscriber.update({
    where: { id },
    data: { status: currentStatus === "active" ? "unsubscribed" : "active" },
  });
  revalidatePath("/admin/subscribers");
}
