import request from 'supertest';
import app from '../app.js';
import { prisma } from '../infra/db/prisma.js';

let accessToken;
let tenantId;
let customerId;
let otherTenantAccessToken;

describe('Tickets Module API Tests', () => {
  beforeAll(async () => {
    // Setup Primary Tenant
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Ticket Admin',
      email: 'ticketadmin@company.com',
      password: 'password123',
      companyName: 'Ticket Co'
    });
    accessToken = res.body.data.accessToken;
    tenantId = res.body.data.user.tenantId;

    // Create a customer for the tickets
    const crmRes = await request(app)
      .post('/api/v1/crm/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Ticket Customer',
        email: 'ticketcustomer@client.com'
      });
    customerId = crmRes.body.data.id;

    // Setup Secondary Tenant (for isolation tests)
    const otherRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Other Admin',
      email: 'otheradmin@company.com',
      password: 'password123',
      companyName: 'Other Co'
    });
    otherTenantAccessToken = otherRes.body.data.accessToken;
  });

  it('Should successfully create a ticket', async () => {
    const res = await request(app)
      .post('/api/v1/tickets')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        customerId,
        title: 'Need help with billing',
        description: 'Where is my invoice?',
        priority: 'medium'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('Need help with billing');
    expect(res.body.data.status).toBe('open'); // Default
  });

  it('Should fail to create ticket if customerId is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/tickets')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        customerId: 'not-a-uuid',
        title: 'Bad customer ID',
        description: 'Should fail',
        priority: 'low'
      });

    expect(res.statusCode).toBe(400); // Validation error for UUID
  });

  it('Should fail to read a ticket from another tenant', async () => {
    // 1. Create ticket in Tenant A
    const res = await request(app)
      .post('/api/v1/tickets')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        customerId,
        title: 'Secret ticket',
        description: 'Should be isolated',
        priority: 'high'
      });
    const ticketId = res.body.data.id;

    // 2. Try to read from Tenant B
    const readRes = await request(app)
      .get(`/api/v1/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${otherTenantAccessToken}`);

    expect(readRes.statusCode).toBe(404); // Data isolation enforced
  });

  it('Should successfully filter tickets by status and priority', async () => {
    const res = await request(app)
      .get('/api/v1/tickets?status=open&priority=medium')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.tickets.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.tickets[0].priority).toBe('medium');
  });
});
