import request from 'supertest';
import app from '../app.js';
import { prisma } from '../infra/db/prisma.js';

describe('Auth Module API Tests', () => {
  it('Should successfully register a new company and user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'John Doe',
      email: 'john@startup.com',
      password: 'StrongPassword123!',
      companyName: 'Startup Inc'
    });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe('john@startup.com');
  });

  it('Should fail registration with weak password', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'John Doe',
      email: 'john2@startup.com',
      password: '123', // Too short
      companyName: 'Startup Inc 2'
    });
    
    expect(res.statusCode).toBe(400); // Validation error
    expect(res.body.code).toBe(400);
  });

  it('Should fail registration if email already exists globally', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@startup.com',
      password: 'StrongPassword123!',
      companyName: 'Startup Inc'
    });

    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Jane Clone',
      email: 'jane@startup.com', // Duplicate
      password: 'StrongPassword123!',
      companyName: 'Another Startup'
    });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/exists/i);
  });

  it('Should successfully login a registered user', async () => {
    // Register first
    await request(app).post('/api/v1/auth/register').send({
      name: 'Login Test',
      email: 'login@startup.com',
      password: 'StrongPassword123!',
      companyName: 'Login Inc'
    });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'login@startup.com',
      password: 'StrongPassword123!'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('Should fail login with wrong password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'login@startup.com', // From previous test
      password: 'WrongPassword!'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });
});
