import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Create a Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      domain: 'acme.com',
      plan: 'enterprise',
    },
  });
  console.log('Created tenant:', tenant.name);

  // Create Roles
  const adminRole = await prisma.role.upsert({
    where: {
      tenantId_name: { tenantId: tenant.id, name: 'Admin' },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Admin',
      description: 'Full access to all resources',
    },
  });

  const agentRole = await prisma.role.upsert({
    where: {
      tenantId_name: { tenantId: tenant.id, name: 'Agent' },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Agent',
      description: 'Access to CRM and tickets',
    },
  });

  // Create User
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminUser = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@acme.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Admin User',
      email: 'admin@acme.com',
      passwordHash,
    },
  });
  console.log('Created user:', adminUser.email);

  // Create Membership
  await prisma.membership.upsert({
    where: {
      tenantId_userId: {
        tenantId: tenant.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  // Create Customer
  const customer = await prisma.customer.upsert({
    where: {
      tenantId_email: { tenantId: tenant.id, email: 'contact@globex.com' },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      ownerId: adminUser.id,
      name: 'Globex Corporation',
      email: 'contact@globex.com',
      company: 'Globex',
    },
  });
  console.log('Created customer:', customer.name);

  // Create Ticket
  const ticket = await prisma.ticket.create({
    data: {
      tenantId: tenant.id,
      customerId: customer.id,
      createdBy: adminUser.id,
      title: 'Login Issue',
      description: 'User cannot login to the platform.',
      priority: 'high',
      status: 'open',
    },
  });
  console.log('Created ticket:', ticket.title);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
