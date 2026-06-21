import request from 'supertest';
import app from '../app.js';
import { prisma } from '../infra/db/prisma.js';

let accessToken;

describe('Notifications Module API Tests', () => {
  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Notification Admin',
      email: 'notifadmin@company.com',
      password: 'password123',
      companyName: 'Notif Co',
    });
    accessToken = res.body.data.accessToken;

    // Simulate system generating a notification for this user
    const userId = res.body.data.user.id;
    const tenantId = res.body.data.user.tenantId;

    await prisma.notification.create({
      data: {
        tenantId,
        userId,
        type: 'system_alert',
        title: 'Welcome!',
        body: 'Thanks for signing up.',
        isRead: false,
      },
    });
  });

  it('Should fetch notifications for the user', async () => {
    const res = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.notifications).toBeInstanceOf(Array);
    expect(res.body.data.notifications.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.notifications[0].title).toBe('Welcome!');
  });

  it('Should mark a notification as read', async () => {
    // 1. Get notifications
    const res = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${accessToken}`);

    const notifId = res.body.data.notifications[0].id;

    // 2. Mark as read
    const patchRes = await request(app)
      .patch(`/api/v1/notifications/${notifId}/read`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.body.data.isRead).toBe(true);
  });
});
