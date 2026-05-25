import request from 'supertest';
import app from '../app.js';
import { prisma } from '../infra/db/prisma.js';

let accessToken;
let tenantId;

describe('RBAC Module API Tests', () => {
  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'RBAC Admin',
      email: 'rbacadmin@company.com',
      password: 'password123',
      companyName: 'RBAC Co'
    });
    accessToken = res.body.data.accessToken;
    tenantId = res.body.data.user.tenantId;
  });

  it('Should fetch all roles for the tenant', async () => {
    const res = await request(app)
      .get('/api/v1/rbac/roles')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].name).toBe('Admin');
  });

  it('Should create a new custom role', async () => {
    const res = await request(app)
      .post('/api/v1/rbac/roles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Support Agent',
        description: 'Handles support tickets'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe('Support Agent');
  });
});
