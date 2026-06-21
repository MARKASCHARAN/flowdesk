import { prisma } from './src/infra/db/prisma.js';

async function main() {
  const tickets = await prisma.ticket.findMany({
    include: {
      customer: true,
    },
  });

  const customers = await prisma.customer.findMany();

  console.log('--- TICKETS ---');
  console.log(JSON.stringify(tickets, null, 2));

  console.log('--- CUSTOMERS ---');
  console.log(JSON.stringify(customers, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
