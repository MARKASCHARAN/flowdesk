import request from 'supertest';
import app from '../app.js';
import { prisma } from '../infra/db/prisma.js';

let accessToken;
let tenantId;
let ticketId;
let commentId;

describe('Comments Module API Tests', () => {
  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Comment Admin',
      email: 'commentadmin@company.com',
      password: 'password123',
      companyName: 'Comment Co'
    });
    accessToken = res.body.data.accessToken;
    tenantId = res.body.data.user.tenantId;

    const crmRes = await request(app).post('/api/v1/crm/customers').set('Authorization', `Bearer ${accessToken}`).send({
      name: 'Comment Customer',
      email: 'comment@client.com'
    });

    const ticketRes = await request(app).post('/api/v1/tickets').set('Authorization', `Bearer ${accessToken}`).send({
      customerId: crmRes.body.data.id,
      title: 'Comment Ticket',
      description: 'Help me',
      priority: 'low'
    });
    ticketId = ticketRes.body.data.id;
  });

  it('Should add a comment to a ticket', async () => {
    const res = await request(app)
      .post(`/api/v1/comments/ticket/${ticketId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        body: 'This is a test comment',
        isInternal: false
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.body).toBe('This is a test comment');
    commentId = res.body.data.id;
  });

  it('Should fetch comments for a ticket', async () => {
    const res = await request(app)
      .get(`/api/v1/comments/ticket/${ticketId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.comments.length).toBeGreaterThanOrEqual(1);
  });

  it('Should fail to comment on a non-existent ticket', async () => {
    const res = await request(app)
      .post(`/api/v1/comments/ticket/00000000-0000-0000-0000-000000000000`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        body: 'Should fail',
        isInternal: false
      });

    expect(res.statusCode).toBe(404);
  });
});
