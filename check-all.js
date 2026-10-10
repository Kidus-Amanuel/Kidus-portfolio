const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const contact = await prisma.contactMessage.count();
  const subs = await prisma.subscriber.count();
  const invites = await prisma.inviteResponse.count();
  const certs = await prisma.certificate.count();
  const edu = await prisma.education.count();
  const exp = await prisma.experience.count();
  const proj = await prisma.project.count();
  console.log({ contact, subs, invites, certs, edu, exp, proj });
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
