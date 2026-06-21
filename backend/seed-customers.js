import { prisma } from './src/infra/db/prisma.js';

async function main() {
  const latestTenant = await prisma.tenant.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!latestTenant) {
    console.log('No tenant found!');
    return;
  }

  console.log(`Found tenant: ${latestTenant.name} (${latestTenant.id})`);

  const customers = [
    {
      tenantId: latestTenant.id,
      name: 'Stark Industries',
      email: 'tony@stark.com',
      company: 'Stark Industries',
      status: 'active'
    },
    {
      tenantId: latestTenant.id,
      name: 'Wayne Enterprises',
      email: 'bruce@wayne.com',
      company: 'Wayne Enterprises',
      status: 'active'
    },
    {
      tenantId: latestTenant.id,
      name: 'Acme Corp',
      email: 'wile@acme.com',
      company: 'Acme Corp',
      status: 'churned'
    }
  ];

  for (const c of customers) {
    await prisma.customer.create({ data: c });
  }

  console.log('Successfully injected 3 fake customers.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
