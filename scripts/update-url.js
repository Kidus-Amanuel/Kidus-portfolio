const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 'global' } });
  console.log('Current settings websiteUrl in DB:', s?.websiteUrl);
  if (!s || s.websiteUrl.includes('kidus.dev')) {
    await prisma.siteSettings.upsert({
      where: { id: 'global' },
      update: { websiteUrl: 'https://kidus-portfolio-gray.vercel.app' },
      create: { id: 'global', websiteUrl: 'https://kidus-portfolio-gray.vercel.app' },
    });
    console.log('Updated websiteUrl to https://kidus-portfolio-gray.vercel.app');
  } else {
    console.log('websiteUrl already set to:', s.websiteUrl);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
