import request from 'supertest';
import app from '../app.js';
import { prisma } from '../infra/db/prisma.js';

let accessToken;
let tenantId;

describe('CRM Module API Tests', () => {
  beforeAll(async () => {
    // We need an authenticated user and a tenant for CRM
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'CRM Admin',
      email: 'crmadmin@company.com',
      password: 'password123',
      companyName: 'CRM Co',
    });
    accessToken = res.body.data.accessToken;
    tenantId = res.body.data.user.tenantId;
  });

  it('Should create a customer successfully', async () => {
    const res = await request(app)
      .post('/api/v1/crm/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'CRM Customer',
        email: 'customer@client.com',
        company: 'Client Org',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe('CRM Customer');
    expect(res.body.data.tenantId).toBe(tenantId); // Validates data isolation
  });

  it('Should fail to create a customer without a name', async () => {
    const res = await request(app)
      .post('/api/v1/crm/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'noname@client.com',
      });

    expect(res.statusCode).toBe(400); // Validation error
  });

  it('Should fail to create a customer with duplicate email in the same tenant', async () => {
    // Create first
    await request(app)
      .post('/api/v1/crm/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Duplicate 1',
        email: 'duplicate@client.com',
      });

    // Try again
    const res = await request(app)
      .post('/api/v1/crm/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Duplicate 2',
        email: 'duplicate@client.com',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/exists/i);
  });

  it('Should retrieve a list of customers for the tenant', async () => {
    const res = await request(app)
      .get('/api/v1/crm/customers')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.customers)).toBe(true);
    expect(res.body.data.customers.length).toBeGreaterThanOrEqual(1);
  });
});
