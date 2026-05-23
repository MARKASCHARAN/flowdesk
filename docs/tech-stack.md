# FlowDesk – Tech Stack

---

# 1. Overview

FlowDesk is built using a **modern backend-heavy JavaScript SaaS architecture** focused on:

- Scalable backend systems
- Multi-tenant SaaS design
- Async processing
- Queue-driven workflows
- Realtime communication
- Secure auth
- Performance optimization
- Cloud deployment
- Testing & observability

The stack is intentionally chosen to reflect **real startup-grade backend engineering**, not a simple MERN CRUD application.

---

# 2. Backend Stack (Primary Engineering Focus)

This is the core of FlowDesk.

---

## 2.1 Node.js

### Purpose
Backend runtime.

### Why chosen
- Non-blocking I/O
- Async-first
- Great for APIs
- Realtime support
- Startup standard

### Used for
- REST APIs
- Business logic
- Queue workers
- Realtime server

---

## 2.2 Express.js

### Purpose
Backend framework.

### Why chosen
- Lightweight
- Flexible
- Easy middleware
- Modular architecture
- Fast to scale

### Used for
- Routing
- Middleware
- Auth handling
- API versioning

---

## 2.3 Prisma ORM

### Purpose
ORM + schema layer.

### Why chosen
- Clean relations
- PostgreSQL support
- Migrations
- Safer DB access
- Strong startup adoption

### Used for
- Schema
- Migrations
- Relations
- Queries
- Seed data

---

## 2.4 PostgreSQL

### Purpose
Primary relational database.

### Why chosen
- ACID
- Great for SaaS
- Strong indexing
- Joins
- Full-text search
- Reliable scaling

### Used for
- Users
- Tenants
- Tickets
- CRM
- Billing
- Permissions
- Analytics

---

## 2.5 Redis

### Purpose
In-memory system.

### Why chosen
- Very low latency
- Great caching
- Queue backend
- Session support

### Used for
- Cache
- Sessions
- Rate limiting
- Queue storage
- Pub/Sub

---

## 2.6 BullMQ

### Purpose
Background jobs.

### Why chosen
- Reliable
- Retry support
- Dead letter queue
- Redis-powered

### Used for
- Emails
- Retry jobs
- Reminders
- Invoice generation
- Cleanup jobs
- Report exports

---

## 2.7 Socket.io

### Purpose
Realtime communication.

### Used for
- Live comments
- Ticket updates
- Presence
- Notifications
- Agent status

---

## 2.8 JWT

### Purpose
Authentication.

### Used for
- Access token auth
- Protected APIs
- Session verification

---

## 2.9 Passport.js

### Purpose
OAuth support.

### Used for
- Google login
- Social auth

---

## 2.10 Joi

### Purpose
Validation layer.

### Used for
- Request validation
- Payload checks
- Schema enforcement

---

## 2.11 Multer

### Purpose
Upload middleware.

### Used for
- File uploads
- Attachments
- Avatars
- Temporary file handling

---

## 2.12 AWS S3

### Purpose
Cloud file storage.

### Used for
- Ticket attachments
- PDFs
- Images
- Reports
- Avatars

---

## 2.13 Pino

### Purpose
Logging.

### Why chosen
- Faster than Winston
- Structured logs
- Lightweight

### Tracks
- Request logs
- Errors
- API latency
- Debug tracing

---

## 2.14 Supertest

### Purpose
API testing.

### Used for
- Auth route tests
- Ticket APIs
- Billing APIs
- Integration tests

---

## 2.15 Jest

### Purpose
Backend unit testing.

### Used for
- Services
- Middleware
- Utilities
- Helpers
- Business logic

---

## 2.16 k6

### Purpose
Load testing.

### Used for
- Concurrent user simulation
- API stress testing
- Throughput
- Req/sec
- P95/P99 latency

---

# 3. DevOps & Infrastructure

---

## 3.1 Docker
Containerization.

Used for:
- Backend container
- Local setup
- Deploy consistency

---

## 3.2 Nginx
Reverse proxy + load balancing.

Used for:
- SSL
- Proxy
- Load balancing
- Traffic routing

---

## 3.3 PM2
Node process manager.

Used for:
- Process restart
- Monitoring
- Crash recovery

---

## 3.4 GitHub Actions
CI/CD.

Used for:
- Test pipeline
- Build checks
- Linting
- Deployment automation

---

## 3.5 AWS EC2
Backend hosting.

Used for:
- Node deployment
- Queue workers
- Scaling

---

## 3.6 Redis Cloud
Managed Redis.

Used for:
- Production cache
- Sessions
- BullMQ

---

## 3.7 Sentry
Error tracking.

Used for:
- Runtime exceptions
- API failures
- Production debugging

---

## 3.8 Prometheus
Metrics collection.

Tracks:
- Req/sec
- Latency
- Queue lag
- Errors
- CPU
- Memory

---

## 3.9 Grafana
Monitoring dashboards.

Tracks:
- P50/P95/P99
- DB latency
- Queue throughput
- API health
- Socket metrics

---

# 4. Frontend Stack (UI Layer)

The frontend is intentionally lighter because FlowDesk is backend-first.

---

## Core
- React.js
- JavaScript
- Vite

---

## UI
- Tailwind CSS
- Shadcn/ui
- Recharts

---

## State
- Zustand
- TanStack Query

---

## Forms
- React Hook Form
- Zod

---

## Testing
- Jest
- Playwright

---

# 5. Why This Stack

This stack was chosen because it supports:

- Backend-heavy engineering
- Multi-tenant SaaS
- Realtime communication
- Async processing
- Queue systems
- Caching
- Scaling
- Monitoring
- Cloud deployment
- Testing
- Resume-grade architecture

This makes FlowDesk much stronger than a standard MERN project.