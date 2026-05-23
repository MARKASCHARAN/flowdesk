# FlowDesk – Modules Design

---

# 1. Overview

FlowDesk follows a **modular monolith architecture**, where each domain is isolated into its own module.

Each module owns:

- Routes
- Controllers
- Services
- Repositories
- Validation
- Events
- Sockets (if needed)
- Tests

Pattern:

```text
Route → Controller → Service → Repository → Database
```

Goals:

- Domain separation
- Reusability
- Easy maintenance
- Scalability
- Clear ownership
- Easier future microservice split

---

# 2. Module Structure Pattern

Each module follows:

```text
module/
├── routes/
├── controllers/
├── services/
├── repositories/
├── validations/
├── constants/
├── events/
├── sockets/
├── tests/
└── index.js
```

---

# 3. Core Modules

---

# 3.1 Auth Module

## Purpose
Handles authentication & session management.

### Responsibilities
- Signup
- Login
- Logout
- JWT auth
- Refresh tokens
- Password reset
- Email verification
- Google OAuth
- Session revoke
- Logout all devices

### Tables
- users
- sessions

### Depends On
- Users
- Notifications
- Audit Logs

### Emits Events
- auth.login
- auth.logout
- auth.password_reset

---

# 3.2 Users Module

## Purpose
Manages user lifecycle.

### Responsibilities
- Create user
- Update profile
- Delete user
- Avatar upload
- Team members
- User status
- Last login tracking

### Tables
- users

### Depends On
- Files
- RBAC
- Audit Logs

### Emits Events
- user.created
- user.updated

---

# 3.3 Tenant Module

## Purpose
Workspace / organization management.

### Responsibilities
- Create workspace
- Invite users
- Tenant settings
- Subdomain
- Domain config
- Team quotas
- Plan limits

### Tables
- tenants
- memberships

### Depends On
- Users
- Billing
- RBAC

### Emits Events
- tenant.created
- tenant.updated

---

# 3.4 RBAC Module

## Purpose
Role-based access control.

### Responsibilities
- Roles
- Permissions
- Ownership checks
- Route guards
- Feature access
- Access matrix

### Tables
- roles
- permissions
- memberships

### Depends On
- Users
- Tenant

---

# 3.5 CRM Module

## Purpose
Customer relationship management.

### Responsibilities
- Customers
- Leads
- Contacts
- Tags
- Notes
- Follow-ups
- Activity timeline
- Segmentation

### Tables
- customers
- leads
- notes

### Depends On
- Users
- Search
- Audit Logs

### Emits Events
- customer.created
- lead.created

---

# 3.6 Ticket Module

## Purpose
Main support workflow engine.

### Responsibilities
- Create ticket
- Update ticket
- Delete ticket
- Assign agent
- Reassign
- Escalation
- SLA
- Merge
- Reopen
- Close
- Priority
- Soft delete
- Ticket workflow

### Tables
- tickets

### Depends On
- Users
- CRM
- Comments
- Notifications
- Files
- Search

### Emits Events
- ticket.created
- ticket.assigned
- ticket.updated
- ticket.closed

### Cache Usage
- Ticket list
- Dashboard
- Search

### Queue Usage
- Notifications
- SLA reminders

### Realtime
- Live ticket updates

---

# 3.7 Comments Module

## Purpose
Internal collaboration.

### Responsibilities
- Add comments
- Replies
- Mentions
- Internal notes
- Edit comment
- Delete comment
- Threaded comments

### Tables
- comments

### Depends On
- Tickets
- Users
- Notifications

### Emits Events
- comment.created
- comment.updated

### Realtime
- Live comments

---

# 3.8 Notifications Module

## Purpose
Message delivery system.

### Responsibilities
- Email alerts
- In-app notifications
- Retry failed notifications
- Read/unread
- Notification preferences
- History

### Tables
- notifications

### Depends On
- Users
- Queue
- WebSocket

### Emits Events
- notification.sent

### Queue Usage
- Email queue
- Retry queue

### Realtime
- Push notifications

---

# 3.9 Billing Module

## Purpose
Subscription management.

### Responsibilities
- Plans
- Subscriptions
- Seat limits
- Usage billing
- Upgrade
- Downgrade
- Cancel
- Invoices

### Tables
- subscriptions
- invoices

### Depends On
- Tenant
- Payments
- Audit Logs

### Emits Events
- billing.updated
- plan.upgraded

---

# 3.10 Payments Module

## Purpose
Payment handling.

### Responsibilities
- Stripe checkout
- Payment retries
- Webhook verification
- Idempotency
- Refunds
- Payment logs

### Tables
- payments

### Depends On
- Billing
- Queue

### Emits Events
- payment.success
- payment.failed

---

# 3.11 Files Module

## Purpose
Storage & uploads.

### Responsibilities
- Upload
- Delete
- Signed URLs
- Validation
- Attachments
- Avatar storage

### Tables
- attachments

### Depends On
- AWS S3
- Tickets
- Users

### Emits Events
- file.uploaded

---

# 3.12 Search Module

## Purpose
Search engine.

### Responsibilities
- Global search
- CRM search
- Ticket search
- Filters
- Pagination
- Sorting
- Full-text search

### Tables
- customers
- tickets

### Depends On
- CRM
- Tickets
- Redis

### Cache Usage
- Search cache

---

# 3.13 Analytics Module

## Purpose
Business metrics.

### Responsibilities
- Ticket trends
- SLA reports
- Revenue
- Productivity
- Growth metrics
- Usage insights

### Tables
- tickets
- subscriptions
- payments

### Depends On
- Billing
- Tickets
- Redis

### Cache Usage
- Dashboard analytics

---

# 3.14 Audit Logs Module

## Purpose
Tracks system-critical changes.

### Responsibilities
- Login history
- Role changes
- Billing changes
- Ticket changes
- Security events

### Tables
- audit_logs

### Depends On
- All critical modules

---

# 3.15 Reporting Module

## Purpose
Exports & reports.

### Responsibilities
- CSV export
- PDF export
- Usage reports
- Revenue reports
- Ticket reports

### Tables
- reports

### Depends On
- Analytics
- Queue
- Files

### Queue Usage
- Export generation

---

# 3.16 Admin Module

## Purpose
Platform-wide control.

### Responsibilities
- Manage tenants
- Suspend tenant
- Block users
- Revenue overview
- Global analytics
- System health

### Tables
- tenants
- users
- payments

### Depends On
- Billing
- Analytics
- Audit Logs

---

# 3.17 Queue Module

## Purpose
Background async processing.

### Responsibilities
- Email jobs
- Retry jobs
- Reminder jobs
- Invoice generation
- Cleanup jobs
- Export jobs

### Infra
- BullMQ
- Redis

---

# 3.18 WebSocket Module

## Purpose
Realtime communication layer.

### Responsibilities
- Presence
- Typing indicator
- Live comments
- Notifications
- Ticket updates
- Agent availability

### Infra
- Socket.io
- Redis Pub/Sub

---

# 4. Shared Modules / Cross-Cutting Layers

---

## Security Layer
- JWT validation
- Refresh rotation
- Rate limiting
- CORS
- Helmet
- Input sanitization

---

## Cache Layer
- Sessions
- Ticket cache
- Search cache
- Dashboard cache
- Analytics cache

---

## Monitoring Layer
- Pino
- Prometheus
- Grafana
- Sentry

---

## File Layer
- S3
- Multer
- Signed URLs

---

# 5. Dependency Flow

```text
Auth → Users → Tenant → RBAC

CRM → Search → Analytics

Tickets → Comments → Notifications → WebSocket

Billing → Payments → Reporting

Queue → Emails / Retry / Cleanup

Files → S3 → Metadata

Audit Logs ← Critical Modules
```

---

# 6. Why This Module Design

This modular system supports:

- Clear ownership
- Easier testing
- Domain isolation
- Scalable codebase
- Realtime features
- Queue-based workflows
- Multi-tenant SaaS
- Backend-heavy architecture
- Easier future service split
- Resume-grade engineering depth