import request from 'supertest';
import app from '../app.js';
import { prisma } from '../infra/db/prisma.js';

let accessToken;

describe('Audit Logs Module API Tests', () => {
  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Audit Admin',
      email: 'auditadmin@company.com',
      password: 'password123',
      companyName: 'Audit Co'
    });
    accessToken = res.body.data.accessToken;

    // Trigger an audit log creation by creating a customer
    await request(app).post('/api/v1/crm/customers').set('Authorization', `Bearer ${accessToken}`).send({
      name: 'Audit Customer',
      email: 'auditcustomer@client.com'
    });
    
    // Wait slightly to let async log write finish
    await new Promise(resolve => setTimeout(resolve, 200));
  });

  it('Should fetch audit logs for the tenant', async () => {
    const res = await request(app)
      .get('/api/v1/audit-logs')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.logs).toBeInstanceOf(Array);
    // At least one log for Customer creation
    expect(res.body.data.logs.length).toBeGreaterThanOrEqual(1);
    
    const customerLog = res.body.data.logs.find(l => l.resourceType === 'Customer');
    expect(customerLog).toBeDefined();
    expect(customerLog.action).toBe('create');
  });
});
