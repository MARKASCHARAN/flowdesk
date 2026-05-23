# FlowDesk – Database Design

---

# 1. Overview

FlowDesk uses **PostgreSQL** as the primary relational database.

The schema is designed for:

- Multi-tenant SaaS
- Strong relational integrity
- RBAC
- CRM workflows
- Ticket lifecycle
- Billing
- Notifications
- Analytics
- Auditability
- Scalability

Design goals:

- Normalized structure
- Strong foreign key constraints
- Fast joins
- Tenant isolation
- Easy indexing
- Query optimization

---

# 2. Database Architecture

```text
Application Layer
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL
      │
      ├── Auth Data
      ├── Tenant Data
      ├── CRM Data
      ├── Ticketing Data
      ├── Billing Data
      ├── Audit Data
      └── Analytics Data
```

---

# 3. Core Design Principles

## Multi-Tenant Isolation
Every major business table includes:

- tenant_id

Ensures:
- workspace isolation
- permission safety
- scalable SaaS model

---

## Soft Deletes
Important tables include:

- deleted_at

Avoids hard delete risk.

---

## Auditable Changes
Critical actions tracked.

Used for:
- role changes
- ticket updates
- billing changes
- security events

---

## Timestamp Standard
All major tables use:

- created_at
- updated_at

---

# 4. Entity Relationship Flow

```text
TENANT
 ├── USERS
 │    ├── SESSIONS
 │    ├── MEMBERSHIPS
 │    └── ROLES
 │
 ├── CUSTOMERS
 │    ├── LEADS
 │    └── NOTES
 │
 ├── TICKETS
 │    ├── COMMENTS
 │    ├── ATTACHMENTS
 │    └── AUDIT LOGS
 │
 ├── SUBSCRIPTIONS
 │    ├── PAYMENTS
 │    └── INVOICES
 │
 └── NOTIFICATIONS
```

---

# 5. Core Tables

---

## 5.1 tenants

Stores organizations.

### Fields
- id
- name
- slug
- domain
- plan
- status
- created_at
- updated_at

### Relations
- users
- memberships
- customers
- tickets
- subscriptions

---

## 5.2 users

Stores all platform users.

### Fields
- id
- tenant_id
- name
- email
- password_hash
- avatar_url
- phone
- status
- last_login_at
- created_at
- updated_at
- deleted_at

### Relations
- memberships
- sessions
- tickets
- comments
- notifications

---

## 5.3 sessions

Authentication sessions.

### Fields
- id
- user_id
- refresh_token
- ip_address
- user_agent
- expires_at
- created_at

---

## 5.4 roles

RBAC roles.

### Fields
- id
- tenant_id
- name
- description

Examples:
- Super Admin
- Admin
- Manager
- Agent
- Customer

---

## 5.5 permissions

Permission matrix.

### Fields
- id
- key
- description

Examples:
- ticket.create
- ticket.assign
- billing.update

---

## 5.6 memberships

User ↔ Role mapping.

### Fields
- id
- tenant_id
- user_id
- role_id
- created_at

---

# 6. CRM Tables

---

## 6.1 customers

Stores customer accounts.

### Fields
- id
- tenant_id
- owner_id
- name
- email
- phone
- company
- tags
- status
- created_at
- updated_at

---

## 6.2 leads

Lead tracking.

### Fields
- id
- tenant_id
- customer_id
- source
- stage
- assigned_to
- priority
- created_at

---

## 6.3 notes

CRM notes.

### Fields
- id
- tenant_id
- customer_id
- created_by
- body
- created_at

---

# 7. Ticketing Tables

---

## 7.1 tickets

Main ticket system.

### Fields
- id
- tenant_id
- customer_id
- assignee_id
- created_by
- title
- description
- priority
- status
- category
- sla_due_at
- resolved_at
- closed_at
- created_at
- updated_at
- deleted_at

---

## 7.2 comments

Ticket collaboration.

### Fields
- id
- tenant_id
- ticket_id
- user_id
- parent_comment_id
- body
- is_internal
- created_at
- updated_at

---

## 7.3 attachments

Files linked to tickets.

### Fields
- id
- tenant_id
- ticket_id
- uploaded_by
- file_name
- file_url
- file_size
- mime_type
- created_at

---

# 8. Notification Tables

---

## 8.1 notifications

Stores user notifications.

### Fields
- id
- tenant_id
- user_id
- type
- title
- body
- is_read
- sent_at
- created_at

---

# 9. Billing Tables

---

## 9.1 subscriptions

Tenant plans.

### Fields
- id
- tenant_id
- plan
- seats
- usage
- starts_at
- ends_at
- status
- created_at

---

## 9.2 payments

Payment history.

### Fields
- id
- tenant_id
- subscription_id
- provider
- provider_ref
- amount
- currency
- status
- paid_at
- created_at

---

## 9.3 invoices

Invoice records.

### Fields
- id
- tenant_id
- subscription_id
- invoice_number
- amount
- due_date
- status
- pdf_url
- created_at

---

# 10. Audit & Reporting Tables

---

## 10.1 audit_logs

Tracks critical actions.

### Fields
- id
- tenant_id
- user_id
- action
- resource_type
- resource_id
- metadata
- ip_address
- created_at

---

## 10.2 reports

Generated exports.

### Fields
- id
- tenant_id
- generated_by
- type
- file_url
- created_at

---

# 11. Indexing Strategy

Important indexes.

---

## Auth
- users(email)
- sessions(refresh_token)

---

## Tenant
- tenant_id

Used on:
- users
- customers
- tickets
- comments
- notifications

---

## Search
- tickets(title)
- tickets(status)
- tickets(priority)
- customers(name)

---

## Performance
- payments(subscription_id)
- comments(ticket_id)
- attachments(ticket_id)

---

# 12. Relationships

```text
TENANTS (1) ──── (*) USERS
TENANTS (1) ──── (*) CUSTOMERS
TENANTS (1) ──── (*) TICKETS
TENANTS (1) ──── (*) SUBSCRIPTIONS

USERS (1) ──── (*) SESSIONS
USERS (1) ──── (*) COMMENTS
USERS (1) ──── (*) NOTIFICATIONS

CUSTOMERS (1) ──── (*) LEADS
CUSTOMERS (1) ──── (*) NOTES
CUSTOMERS (1) ──── (*) TICKETS

TICKETS (1) ──── (*) COMMENTS
TICKETS (1) ──── (*) ATTACHMENTS

SUBSCRIPTIONS (1) ──── (*) PAYMENTS
SUBSCRIPTIONS (1) ──── (*) INVOICES
```

---

# 13. Data Types

Recommended:

- UUID → IDs
- VARCHAR → names/emails
- TEXT → descriptions
- BOOLEAN → flags
- TIMESTAMP → audit times
- JSONB → metadata
- INTEGER → counts
- DECIMAL → billing

---

# 14. Scalability Strategy

Supports:

- DB indexing
- Pagination
- Connection pooling
- Read-heavy caching
- Partitioning later
- Read replicas later
- Query optimization

---

# 15. Why This DB Design

This schema supports:

- Multi-tenant SaaS
- CRM
- Ticketing
- Billing
- Notifications
- RBAC
- Auditability
- Search
- Analytics
- Strong resume-grade backend depth