import request from 'supertest';
import app from '../app.js';
import { prisma } from '../infra/db/prisma.js';

let accessToken;

describe('Search Module API Tests', () => {
  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Search Admin',
      email: 'searchadmin@company.com',
      password: 'password123',
      companyName: 'Search Co'
    });
    accessToken = res.body.data.accessToken;

    await request(app).post('/api/v1/crm/customers').set('Authorization', `Bearer ${accessToken}`).send({
      name: 'FindMe Customer',
      email: 'findme@client.com'
    });
  });

  it('Should find customer globally', async () => {
    const res = await request(app)
      .get('/api/v1/search/global?q=FindMe')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.customers.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.customers[0].name).toBe('FindMe Customer');
  });

  it('Should return 400 for queries less than 2 characters', async () => {
    const res = await request(app)
      .get('/api/v1/search/global?q=a')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(400); // Validation error
  });
});
