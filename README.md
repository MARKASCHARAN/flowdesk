# 🚀 FlowDesk

<p align="center">
  <b>Multi-Tenant CRM, Ticketing & Billing SaaS Platform</b><br/>
  Backend-first full-stack SaaS platform focused on scalability, performance, reliability, and real-world system design.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-green" />
  <img src="https://img.shields.io/badge/Express.js-API-black" />
  <img src="https://img.shields.io/badge/Prisma-ORM-blue" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-316192" />
  <img src="https://img.shields.io/badge/Redis-Cache-red" />
  <img src="https://img.shields.io/badge/BullMQ-Queues-orange" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB" />
  <img src="https://img.shields.io/badge/Docker-DevOps-2496ED" />
  <img src="https://img.shields.io/badge/License-MIT-brightgreen" />
</p>

---

# 📌 Overview

FlowDesk is a **production-style multi-tenant SaaS platform** built to simulate how modern CRM, support ticketing, billing, and collaboration systems are designed in real-world engineering teams.

This project is intentionally **backend-heavy**, focusing on scalable API design, modular system architecture, authentication, caching, queues, observability, billing workflows, and cloud-ready deployment.

It is built as a **flagship engineering portfolio project** to demonstrate strong backend and full-stack development skills.

---

# ✨ Goals

FlowDesk is designed to showcase:

- Backend-first engineering
- Scalable SaaS architecture
- Modular monolith design
- Authentication & authorization
- Multi-tenant access isolation
- Queue processing
- Billing workflows
- Real-time communication
- Observability & monitoring
- Cloud deployment patterns

---

# 🏗️ System Architecture

FlowDesk follows a **Backend-First Modular Monolith Architecture**.

```text
┌────────────────────────────────────────────────────┐
│                 Frontend (React)                   │
│ UI / Forms / State / Query / Charts               │
└───────────────────────┬────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────┐
│               API Layer (Express)                  │
│ Routes / Middleware / Validation / Security       │
└───────────────────────┬────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────┐
│                Modules Layer                       │
│ Auth / Users / Tickets / Billing / Notifications  │
│ Search / Files / CRM / Subscription               │
└───────────────────────┬────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────┐
│                 Shared Layer                       │
│ Config / Logger / Errors / Guards / Utils         │
└───────────────────────┬────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────┐
│              Infrastructure Layer                  │
│ PostgreSQL / Redis / BullMQ / S3 / WebSockets     │
└────────────────────────────────────────────────────┘
```

---

# ⚙️ Core Features

## 🔐 Authentication & Security
- JWT Authentication
- Refresh Tokens
- Password Hashing (bcrypt)
- OAuth (Google Login)
- Email Verification
- Forgot Password
- Session Security
- Role-Based Access Control (RBAC)
- Rate Limiting
- Input Validation
- Audit Logs

---

## 🎫 CRM / Ticketing
- Create Tickets
- Assign Tickets
- Priority Management
- Ticket Workflow
- Status Updates
- Comments
- Attachments
- Activity Tracking
- Search
- Filters
- Pagination
- Soft Delete

---

## 🏢 Multi-Tenant SaaS
- Tenant Isolation
- Company-level access
- Role hierarchy
- Scoped permissions
- Usage restrictions
- Subscription tiers
- Access boundaries

---

## ⚡ Real-Time Features
- WebSockets
- Live ticket updates
- Notifications
- Presence tracking
- Typing indicators
- Event-based communication

---

## 💳 Billing & Payments
- Stripe Integration
- Free / Pro / Enterprise plans
- Subscription lifecycle
- Webhook processing
- Invoice tracking
- Payment event handling

---

## 🚀 Performance & Scaling
- Redis Caching
- Background Jobs
- Retry Queues
- Queue Workers
- DB optimization
- Structured Logging
- Error Handling
- Horizontal scalability
- Monitoring
- Observability

---

# 🛠️ Tech Stack

## Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Redis
- BullMQ
- Socket.io
- JWT
- Passport
- Joi
- Multer
- Pino

---

## Frontend
- React.js
- JavaScript
- Tailwind CSS
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Playwright
- Jest

---

## DevOps / Infra
- Docker
- Nginx
- GitHub Actions
- AWS EC2
- Redis Cloud
- Sentry
- Prometheus
- Grafana

---

# 📂 Project Structure

```bash
flowdesk/
├── .github/
│   └── workflows/
│
├── .husky/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   └── package.json
│
├── frontend/
│
├── docs/
│   ├── product.md
│   ├── architecture.md
│   ├── modules.md
│   ├── database.md
│   ├── api-design.md
│   ├── roadmap.md
│   ├── tech-stack.md
│   └── testing-scaling.md
│
├── infra/
├── scripts/
├── docker-compose.yml
├── package.json
└── README.md
```

---

# 📚 Documentation

Detailed technical documentation lives inside `/docs`.

Includes:

- Product Design
- System Architecture
- Modules Design
- Database Design
- API Standards
- Testing & Scaling
- Roadmap
- Tech Stack

---

# 🧠 Engineering Concepts Covered

This project demonstrates:

- Clean Architecture
- Modular Monolith Design
- Multi-Tenant SaaS Design
- Secure API Design
- RBAC
- Queue Systems
- Background Processing
- Caching Strategies
- Event-driven communication
- Logging & Observability
- Horizontal Scaling
- Cloud Infrastructure patterns

---

# 👨‍💻 Author

**Marka Sai Charan**  
Backend / Full Stack Developer  
Focused on scalable backend systems, system design, and real-world engineering.

---
```