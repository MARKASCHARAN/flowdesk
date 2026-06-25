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
  console.log('Starting bulk seed...');

  // 1. Create a Tenant
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

  // 2. Create Roles
  const adminRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Admin' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Admin', description: 'Full access' },
  });

  const agentRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Agent' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Agent', description: 'Support access' },
  });

  const managerRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Support Manager' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Support Manager', description: 'Can view and assign tickets' },
  });

  const salesRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Sales Rep' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Sales Rep', description: 'Access to CRM contacts only' },
  });

  const billingRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Billing Admin' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Billing Admin', description: 'Manage subscription and invoices' },
  });

  // 3. Create Admin & Team Members
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const teamData = [
    { name: 'Admin User', email: 'admin@acme.com', roleId: adminRole.id },
    { name: 'Sarah Connor', email: 'sarah@acme.com', roleId: managerRole.id },
    { name: 'John Smith', email: 'jsmith@acme.com', roleId: salesRole.id },
    { name: 'Emma Davis', email: 'emma@acme.com', roleId: agentRole.id },
    { name: 'Michael Chang', email: 'mike@acme.com', roleId: billingRole.id },
  ];

  const createdUsers = [];
  for (const t of teamData) {
    const u = await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: t.email } },
      update: {},
      create: {
        tenantId: tenant.id,
        name: t.name,
        email: t.email,
        passwordHash,
      },
    });
    createdUsers.push(u);

    await prisma.membership.upsert({
      where: { tenantId_userId: { tenantId: tenant.id, userId: u.id } },
      update: {},
      create: { tenantId: tenant.id, userId: u.id, roleId: t.roleId },
    });
  }
  const adminUser = createdUsers[0];
  console.log(`Created ${createdUsers.length} team members.`);

  // 4. Create Customers (Companies)
  const companies = [
    { name: 'Globex Corporation', domain: 'globex.com', industry: 'Manufacturing', mrr: '$12,500' },
    { name: 'Initech', domain: 'initech.com', industry: 'Software', mrr: '$4,500' },
    { name: 'Umbrella Corp', domain: 'umbrella.com', industry: 'Biotech', mrr: '$89,000' },
    { name: 'Stark Industries', domain: 'stark.com', industry: 'Defense', mrr: '$150,000' },
    { name: 'Wayne Enterprises', domain: 'wayne.com', industry: 'Conglomerate', mrr: '$200,000' },
    { name: 'Massive Dynamic', domain: 'massive.com', industry: 'Technology', mrr: '$45,000' },
    { name: 'Dunder Mifflin', domain: 'dunder.com', industry: 'Paper', mrr: '$2,100' },
    { name: 'Pied Piper', domain: 'piedpiper.com', industry: 'Software', mrr: '$800' },
    { name: 'Hooli', domain: 'hooli.com', industry: 'Technology', mrr: '$120,000' },
    { name: 'Cyberdyne Systems', domain: 'cyberdyne.com', industry: 'AI', mrr: '$95,000' }
  ];

  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  const createdCustomers = [];
  
  for (const comp of companies) {
    // Generate 1-4 contacts per company
    const numContacts = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < numContacts; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@${comp.domain}`;
      
      const c = await prisma.customer.upsert({
        where: { tenantId_email: { tenantId: tenant.id, email } },
        update: {},
        create: {
          tenantId: tenant.id,
          ownerId: adminUser.id,
          name: `${fName} ${lName}`,
          email,
          company: comp.name,
          phone: `+1555${Math.floor(1000000 + Math.random() * 9000000)}`,
        },
      });
      createdCustomers.push(c);
    }
  }
  console.log(`Created ${createdCustomers.length} customer contacts across ${companies.length} companies.`);

  // 5. Create Tickets (Mixed Solved / Unsolved)
  const ticketIssues = [
    { title: 'Cannot access dashboard', desc: 'Getting a 403 forbidden error when trying to view analytics.' },
    { title: 'Billing failed', desc: 'My credit card was charged twice for the monthly subscription.' },
    { title: 'How to export data?', desc: 'I need to export all my CRM contacts to a CSV file.' },
    { title: 'API rate limit exceeded', desc: 'Our integration stopped working due to rate limits.' },
    { title: 'Forgot password reset not working', desc: 'I am not receiving the reset email.' },
    { title: 'Feature request: Dark mode', desc: 'Would love to see a dark mode option in settings.' },
    { title: 'Integration with Slack', desc: 'Can we push notifications to a Slack channel?' },
    { title: 'Data sync is slow', desc: 'It takes over 5 minutes for our external data to sync.' },
    { title: 'Account suspended', desc: 'Why was our testing account suspended without warning?' },
    { title: 'Typo on landing page', desc: 'There is a spelling mistake on your pricing page.' }
  ];

  const priorities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['open', 'in_progress', 'resolved', 'closed'];
  
  let ticketCount = 0;
  
  for (const customer of createdCustomers) {
    // 1-5 tickets per customer
    const numTickets = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < numTickets; i++) {
      const issue = ticketIssues[Math.floor(Math.random() * ticketIssues.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      // Weight the statuses to have a good mix of resolved vs open
      const statusRoll = Math.random();
      let status = 'open';
      if (statusRoll < 0.2) status = 'open';
      else if (statusRoll < 0.4) status = 'in_progress';
      else if (statusRoll < 0.8) status = 'resolved';
      else status = 'closed';
      
      // Assign to a random team member
      const assignee = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      // Randomize created date within last 6 months
      const createdAgoDays = Math.floor(Math.random() * 180);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - createdAgoDays);
      
      const updatedAt = new Date(createdAt);
      if (status === 'resolved' || status === 'closed') {
        updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * 5) + 1); // resolved 1-5 days later
      }

      await prisma.ticket.create({
        data: {
          tenantId: tenant.id,
          customerId: customer.id,
          createdBy: adminUser.id,
          assigneeId: assignee.id,
          title: issue.title,
          description: issue.desc,
          priority,
          status,
          createdAt,
          updatedAt,
        }
      });
      ticketCount++;
    }
  }
  
  console.log(`Created ${ticketCount} tickets (mixed statuses and priorities).`);
  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
