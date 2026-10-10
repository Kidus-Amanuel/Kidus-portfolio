const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.subscriber.count();
  console.log('Subscriber count:', count);
  const subs = await prisma.subscriber.findMany({ take: 5 });
  console.log('Sample subs:', subs);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
