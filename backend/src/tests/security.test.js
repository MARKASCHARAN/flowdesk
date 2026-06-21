import request from 'supertest';
import app from '../app.js';
import { PrismaClient } from '@prisma/client';
import { redis } from '../infra/cache/redis.js';

const prisma = new PrismaClient();

describe('Tenant Data Isolation Security Tests', () => {
  let tenantA, tenantB;
  let ticketId;

  beforeAll(async () => {
    // 1. Setup Tenant A
    const resA = await request(app).post('/api/v1/auth/register').send({
      name: 'Admin A',
      email: 'admin.a@startup.com',
      password: 'Password123!',
      companyName: 'Company A',
    });
    tenantA = resA.body.data;

    // 2. Setup Tenant B
    const resB = await request(app).post('/api/v1/auth/register').send({
      name: 'Admin B',
      email: 'admin.b@corp.com',
      password: 'Password123!',
      companyName: 'Company B',
    });
    tenantB = resB.body.data;
  });

  afterAll(async () => {
    // Teardown
    await prisma.ticket.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.tenant.deleteMany();
    await prisma.$disconnect();
    await redis.quit();
  });

  it('Tenant A should be able to create a ticket', async () => {
    // Create customer first
    const custRes = await request(app)
      .post('/api/v1/crm/customers')
      .set('Authorization', `Bearer ${tenantA.accessToken}`)
      .send({ name: 'Customer A', email: 'cust.a@test.com' });

    expect(custRes.status).toBe(201);
    const customerId = custRes.body.data.id;

    // Create ticket
    const ticketRes = await request(app)
      .post('/api/v1/tickets')
      .set('Authorization', `Bearer ${tenantA.accessToken}`)
      .send({
        customerId,
        title: 'Tenant A Secret Ticket',
        description: 'Only Tenant A should see this',
        priority: 'high',
      });

    expect(ticketRes.status).toBe(201);
    ticketId = ticketRes.body.data.id;
  });

  it('Tenant B MUST NOT be able to access Tenant A ticket', async () => {
    // Tenant B attempts to fetch Tenant A's ticket by ID
    const res = await request(app)
      .get(`/api/v1/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${tenantB.accessToken}`);

    // Because of our strict Prisma tenant scopes, it should completely pretend the ticket doesn't exist.
    expect(res.status).toBe(404);
    expect(res.body.message).toContain('not found');
  });

  it('Tenant B MUST NOT be able to access Tenant A customers', async () => {
    const res = await request(app)
      .get(`/api/v1/crm/customers`)
      .set('Authorization', `Bearer ${tenantB.accessToken}`);

    expect(res.status).toBe(200);
    // Tenant B's list should be completely empty, unable to see Customer A
    expect(res.body.data.customers.length).toBe(0);
  });
});
