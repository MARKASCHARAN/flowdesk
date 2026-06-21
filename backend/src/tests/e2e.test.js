import request from 'supertest';
import app from '../app.js';
import { prisma } from '../infra/db/prisma.js';

let accessToken;
let tenantId;
let userId;
let customerId;
let ticketId;

describe('FlowDesk End-to-End API Flow', () => {
  it('1. Should register a new company (Auth)', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test Admin',
      email: 'testadmin@company.com',
      password: 'password123',
      companyName: 'Test Company LLC',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.accessToken).toBeDefined();

    accessToken = res.body.data.accessToken;
    userId = res.body.data.user.id;
    tenantId = res.body.data.user.tenantId;
  });

  it('2. Should fetch the user profile (Users)', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe('testadmin@company.com');
  });

  it('3. Should fetch tenant details (Tenants)', async () => {
    const res = await request(app)
      .get(`/api/v1/tenants`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Test Company LLC');
  });

  it('4. Should create a new customer (CRM)', async () => {
    const res = await request(app)
      .post('/api/v1/crm/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Alice Smith',
        email: 'alice@client.com',
        company: 'Client Co',
      });

    expect(res.statusCode).toBe(201);
    customerId = res.body.data.id;
    expect(customerId).toBeDefined();
  });

  it('5. Should create a new support ticket (Tickets)', async () => {
    const res = await request(app)
      .post('/api/v1/tickets')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        customerId,
        title: 'System is down',
        description: 'I cannot log into the dashboard',
        priority: 'high',
      });

    expect(res.statusCode).toBe(201);
    ticketId = res.body.data.id;
    expect(ticketId).toBeDefined();
  });

  it('6. Should add a comment to the ticket (Comments)', async () => {
    const res = await request(app)
      .post(`/api/v1/comments/ticket/${ticketId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        body: 'We are investigating this immediately.',
        isInternal: false,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.body).toBe('We are investigating this immediately.');
  });

  it('7. Should find the ticket and customer via global search (Search)', async () => {
    const res = await request(app)
      .get('/api/v1/search/global?q=Alice')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.customers.length).toBeGreaterThan(0);
    expect(res.body.data.customers[0].name).toBe('Alice Smith');
  });

  it('8. Should verify the ticket creation was logged (Audit Logs)', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100)); // wait for fire-and-forget log

    const res = await request(app)
      .get('/api/v1/audit-logs')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    // There should be multiple logs (Customer created, Ticket created)
    expect(res.body.data.logs.length).toBeGreaterThan(0);

    // One of them should be "ticket.created" or similar
    const ticketLog = res.body.data.logs.find(
      (l) => l.resourceType === 'Ticket'
    );
    expect(ticketLog).toBeDefined();
  });

  it('9. Should have generated a notification (Notifications)', async () => {
    const res = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.notifications)).toBe(true);
  });
});
