# FlowDesk – System Architecture

---

# 1. Architecture Overview

FlowDesk is a **backend-first, multi-tenant SaaS platform** built using a **Modular Monolith + Layered Architecture + Event-Driven Processing + Realtime Pub/Sub**.

It is intentionally designed like a **real startup-grade support + CRM + billing platform**.

Main goals:

- Modular backend design
- Clear domain separation
- Multi-tenant isolation
- Queue-based async processing
- Realtime communication
- Low-latency caching
- Strong observability
- Horizontal scaling support
- Production deployment readiness

---

# 2. High-Level System Architecture

FlowDesk separates:

- API path
- Business logic path
- Realtime path
- Queue path
- File path
- Monitoring path

```text
                                 ┌──────────────────────┐
                                 │   Frontend (React)   │
                                 │ CRM / Billing / UI   │
                                 └──────────┬───────────┘
                                            │ HTTPS
                                            ▼
                              ┌─────────────────────────────┐
                              │   Nginx Reverse Proxy       │
                              │ SSL / Rate Limit / Routing  │
                              └──────────┬──────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
       ┌───────────────────────────┐              ┌────────────────────┐
       │    REST API Server        │              │ WebSocket Server   │
       │ Node.js + Express         │              │ Socket.io          │
       └───────────────────────────┘              └────────────────────┘
                    │                                         │
                    └───────────────┬─────────────────────────┘
                                    ▼
                  ┌────────────────────────────────────────────┐
                  │          Business Module Layer             │
                  └────────────────────────────────────────────┘
```

---

# 3. Business Module Layer

All major modules inside backend.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        BUSINESS MODULES                                │
├────────────────────────────────────────────────────────────────────────┤
│ Auth Module              │ Users Module          │ Tenant Module       │
│ RBAC Module              │ CRM Module            │ Ticket Module       │
│ Comments Module          │ Notification Module   │ Billing Module      │
│ Payments Module          │ Files Module          │ Search Module       │
│ Analytics Module         │ Audit Logs Module     │ Admin Module        │
│ Queue Module            │ Realtime Module       │ Reporting Module    │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 4. Core Servers

FlowDesk uses multiple logical server responsibilities.

---

## 4.1 API Server (Primary)

**Node.js + Express**

Handles:

- REST APIs
- Auth
- CRUD
- Validation
- Billing
- Search
- CRM
- Analytics
- File requests
- Admin actions

---

## 4.2 WebSocket Server

**Socket.io**

Handles:

- Live comments
- Ticket updates
- Presence
- Typing indicators
- Notification push
- Agent availability

---

## 4.3 Queue Workers

**BullMQ Workers**

Handles:

- Emails
- Invoice generation
- Retry jobs
- Cleanup jobs
- Reminder jobs
- Export jobs
- Webhook retries

---

## 4.4 Monitoring Stack

Handles:

- Metrics
- Error tracking
- Queue lag
- Latency
- DB health

Uses:

- Prometheus
- Grafana
- Sentry
- Pino

---

# 5. Layered Architecture

Each module follows:

```text
Route → Controller → Service → Repository → Database
```

---

## Request Lifecycle

```text
Client Request
     │
     ▼
Route Layer
     │
     ▼
Controller Layer
(req/res handling)
     │
     ▼
Validation Layer
(Joi)
     │
     ▼
Service Layer
(Business Logic)
     │
     ▼
Repository Layer
(Prisma Queries)
     │
     ▼
PostgreSQL / Redis / S3
```

---

# 6. Module Architecture

Each module is isolated.

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

# 7. Full Backend Module Responsibilities

## Auth Module
- Signup
- Login
- JWT
- Refresh tokens
- Password reset
- OAuth
- Sessions

---

## Users Module
- User CRUD
- Profile
- Avatar
- Status
- Team members

---

## Tenant Module
- Create workspace
- Invite users
- Plan limits
- Tenant settings
- Subdomain

---

## RBAC Module
- Roles
- Permissions
- Route guards
- Ownership checks

---

## CRM Module
- Customers
- Leads
- Contacts
- Tags
- Notes
- Follow-ups

---

## Ticket Module
- Create ticket
- Assign
- Reopen
- Merge
- Escalate
- SLA
- Soft delete

---

## Comments Module
- Replies
- Mentions
- Internal notes
- Collaboration

---

## Notification Module
- Email alerts
- In-app notifications
- Retry handling
- Read/unread

---

## Billing Module
- Plans
- Subscriptions
- Invoices
- Seat limits
- Usage tracking

---

## Payments Module
- Stripe checkout
- Webhooks
- Idempotency
- Retry payments

---

## Files Module
- Upload
- Validation
- Signed URLs
- Attachments

---

## Search Module
- Global search
- Ticket search
- CRM search
- Full-text search

---

## Analytics Module
- Ticket trends
- Revenue
- SLA
- Productivity

---

## Audit Logs Module
- Login history
- Permission changes
- Billing actions
- Security events

---

## Reporting Module
- CSV
- PDF
- Export jobs

---

## Admin Module
- Tenant control
- Revenue view
- Block tenant
- Global analytics

---

# 8. Data Layer Architecture

---

## PostgreSQL

Main relational DB.

```text
users
tenants
memberships
roles
permissions
customers
leads
tickets
comments
attachments
subscriptions
payments
invoices
notifications
audit_logs
sessions
reports
```

Used for:
- Strong relations
- Transactions
- Search
- Analytics

---

## Redis

Used for:

- Cache
- Sessions
- Rate limiting
- Queue backend
- Pub/Sub
- Dashboard cache

---

## AWS S3

Used for:

- Attachments
- PDFs
- Avatars
- Reports
- Media

---

# 9. Event-Driven Architecture

Async work moved out of request path.

```text
Client Request
     │
     ▼
Service Layer
     │
     ▼
Create Queue Job
     │
     ▼
BullMQ
     │
     ▼
Worker
     │
     ▼
Email / Retry / Invoice / Cleanup
```

Benefits:
- Lower API latency
- Retry safety
- Scalable workers

---

# 10. Realtime Architecture

Uses Pub/Sub.

```text
User Action
   │
   ▼
REST API / Service
   │
   ▼
Socket Event
   │
   ▼
Socket Server
   │
   ▼
Tenant Room
   │
   ▼
Connected Users
```

---

# 11. Caching Architecture

```text
API Request
   │
   ▼
Check Redis
   │
   ├── Cache Hit
   │      ▼
   │   Fast Response
   │
   └── Cache Miss
          │
          ▼
     PostgreSQL
          │
          ▼
     Save to Redis
          │
          ▼
       Response
```

Used for:
- Ticket list
- Sessions
- Permissions
- Search
- Dashboard
- Analytics

---

# 12. File Upload Architecture

```text
Client Upload
    │
    ▼
Multer
    │
    ▼
Validation
    │
    ▼
AWS S3
    │
    ▼
Save Metadata → PostgreSQL
```

---

# 13. Multi-Tenant Isolation

Uses `tenant_id`.

```text
Platform
 ├── Tenant A
 │   ├── Users
 │   ├── CRM
 │   ├── Tickets
 │   └── Billing
 │
 ├── Tenant B
 │   ├── Users
 │   ├── CRM
 │   └── Tickets
 │
 └── Tenant C
```

---

# 14. Security Architecture

Layers:

- JWT auth
- Refresh rotation
- RBAC
- Joi validation
- Rate limiting
- Helmet
- CORS
- bcrypt
- Signed URLs
- Input sanitization
- Audit logs

---

# 15. Observability Stack

Uses:

- Pino
- Sentry
- Prometheus
- Grafana

Tracks:

- Req/sec
- P50 / P95 / P99
- Error %
- Queue lag
- DB latency
- CPU
- Memory
- WebSocket connections

---

# 16. Deployment Architecture

```text
                        ┌──────────────┐
                        │    Nginx     │
                        └──────┬───────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
 ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
 │ Node App 1   │       │ Node App 2   │       │ Node App 3   │
 └──────┬───────┘       └──────┬───────┘       └──────┬───────┘
        └───────────────┬──────┴───────────────┬──────┘
                        ▼                      ▼
                ┌──────────────┐        ┌──────────────┐
                │ Redis Cloud  │        │ PostgreSQL   │
                └──────────────┘        └──────────────┘
                        │
                        ▼
                  Queue Workers
                        │
                        ▼
                     AWS S3
```

---

# 17. Scaling Path

### Stage 1
Single Node instance

### Stage 2
Optimization
- Redis caching
- DB indexing
- Pooling
- Queue workers

### Stage 3
Horizontal scale
- Multiple Node servers
- Load balancing
- Shared Redis
- Worker separation
- DB replicas

---

# 18. Why This Architecture

This supports:

- Backend-heavy SaaS
- Multi-tenant systems
- Queue-driven workloads
- Realtime communication
- Scalable infra
- Strong modularity
- Observability
- Production deployment
- Resume-grade engineering depth