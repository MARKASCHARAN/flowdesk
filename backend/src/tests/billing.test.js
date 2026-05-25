import request from 'supertest';
import app from '../app.js';
import { prisma } from '../infra/db/prisma.js';

let accessToken;
let tenantId;

describe('Billing Module API Tests', () => {
  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Billing Admin',
      email: 'billingadmin@company.com',
      password: 'password123',
      companyName: 'Billing Co'
    });
    accessToken = res.body.data.accessToken;
    tenantId = res.body.data.user.tenantId;
  });

  it('Should fetch the default subscription details', async () => {
    const res = await request(app)
      .get('/api/v1/billing/subscription')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.plan).toBe('free');
    expect(res.body.data.status).toBe('active');
  });

  it('Should create a checkout session URL', async () => {
    const res = await request(app)
      .post('/api/v1/billing/checkout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        priceId: 'price_12345',
        frontendUrl: 'https://flowdesk.app'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.url).toBeDefined();
    expect(res.body.data.url).toContain('flowdesk.app/billing/success');
  });

  it('Should create a customer portal URL', async () => {
    const res = await request(app)
      .post('/api/v1/billing/portal')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        returnUrl: 'https://flowdesk.app/dashboard'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.url).toBe('https://flowdesk.app/dashboard');
  });

  it('Should successfully process a mock Stripe webhook', async () => {
    // Construct a mock checkout.session.completed event
    const mockPayload = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_mock_123',
          client_reference_id: tenantId // This ties the checkout to our tenant
        }
      }
    };

    // We send it as a raw string so express.raw() parses it into a buffer correctly
    const res = await request(app)
      .post('/api/v1/billing/webhook')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 't=123,v1=mock_signature') // Mock signature
      .send(JSON.stringify(mockPayload));

    expect(res.statusCode).toBe(200);
    expect(res.body.received).toBe(true);

    // Verify the tenant plan was upgraded to premium
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    expect(tenant.plan).toBe('premium');
    
    // Verify a subscription record was created
    const sub = await prisma.subscription.findFirst({ where: { tenantId } });
    expect(sub).toBeDefined();
    expect(sub.plan).toBe('premium');
  });
});
