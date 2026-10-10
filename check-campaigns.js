const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const deliveries = await prisma.emailDelivery.count();
  console.log('Deliveries:', deliveries);
  const campaigns = await prisma.emailCampaign.findMany({ include: { deliveries: true } });
  console.log('Campaigns:', JSON.stringify(campaigns, null, 2));
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
