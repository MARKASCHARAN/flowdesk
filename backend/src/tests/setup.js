import { prisma } from '../infra/db/prisma.js';
import { redis } from '../infra/cache/redis.js';

// Clean DB before all tests
beforeAll(async () => {
  // Danger: this deletes all data. In a real project you'd use a separate test DB.
  // For this local test suite we will just clear tables.
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.attachment.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.ticket.deleteMany(),
    prisma.note.deleteMany(),
    prisma.lead.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.membership.deleteMany(),
    prisma.rolePermission.deleteMany(),
    prisma.permission.deleteMany(),
    prisma.role.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.tenant.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
  redis.disconnect();
});
