import request from 'supertest';
import app from '../app.js';
import { prisma } from '../infra/db/prisma.js';

let accessToken;
let tenantId;
let userId;

describe('Users Module API Tests', () => {
  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'User Admin',
      email: 'useradmin@company.com',
      password: 'password123',
      companyName: 'User Co'
    });
    accessToken = res.body.data.accessToken;
    tenantId = res.body.data.user.tenantId;
    userId = res.body.data.user.id;
  });

  it('Should fetch current user profile', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe('useradmin@company.com');
  });

  it('Should update user profile', async () => {
    const res = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'User Admin Updated'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('User Admin Updated');
  });

  it('Should retrieve team members', async () => {
    const res = await request(app)
      .get('/api/v1/users/team')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.users).toBeInstanceOf(Array);
    expect(res.body.data.users.length).toBeGreaterThanOrEqual(1);
  });
});
