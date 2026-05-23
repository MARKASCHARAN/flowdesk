# FlowDesk – API Design

---

# 1. Overview

FlowDesk follows a **REST API architecture** using Express.js.

Design goals:

- Predictable routes
- Versioning support
- Tenant-safe access
- Secure auth
- Reusable response format
- Clean module separation
- Scalable API structure

Base path:

```text
/api/v1
```

---

# 2. API Design Principles

- REST-first
- Resource-based routes
- Stateless APIs
- JWT protected endpoints
- Role-based access
- Idempotent updates where needed
- Pagination-first
- Consistent errors
- Versioned APIs

---

# 3. Standard Request Flow

```text
Client Request
    │
    ▼
Route
    │
    ▼
Middleware
(Auth / Rate Limit / Validation)
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Database / Redis / S3
    │
    ▼
Response
```

---

# 4. Response Format

## Success Response

```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {},
  "meta": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": {
    "code": "AUTH_401"
  }
}
```

---

# 5. Auth APIs

Base:

```text
/api/v1/auth
```

| Method | Route | Purpose |
|--------|------|---------|
| POST | /register | Create account |
| POST | /login | Login |
| POST | /logout | Logout |
| POST | /refresh | Refresh token |
| POST | /forgot-password | Reset request |
| POST | /reset-password | Reset password |
| GET | /verify-email | Verify account |
| GET | /google | OAuth |

---

# 6. Tenant APIs

Base:

```text
/api/v1/tenants
```

| Method | Route | Purpose |
|--------|------|---------|
| POST | / | Create tenant |
| GET | /:id | Tenant details |
| PATCH | /:id | Update settings |
| GET | /:id/users | Workspace users |
| POST | /:id/invite | Invite user |

---

# 7. Users APIs

Base:

```text
/api/v1/users
```

| Method | Route | Purpose |
|--------|------|---------|
| GET | /me | Profile |
| PATCH | /me | Update profile |
| GET | / | List users |
| GET | /:id | User details |
| PATCH | /:id/status | Change status |
| DELETE | /:id | Remove user |

---

# 8. RBAC APIs

Base:

```text
/api/v1/rbac
```

| Method | Route | Purpose |
|--------|------|---------|
| GET | /roles | List roles |
| POST | /roles | Create role |
| PATCH | /roles/:id | Update role |
| GET | /permissions | List permissions |
| PATCH | /assign | Assign permission |

---

# 9. CRM APIs

Base:

```text
/api/v1/crm
```

### Customers

| Method | Route |
|--------|------|
| POST | /customers |
| GET | /customers |
| GET | /customers/:id |
| PATCH | /customers/:id |
| DELETE | /customers/:id |

---

### Leads

| Method | Route |
|--------|------|
| POST | /leads |
| GET | /leads |
| PATCH | /leads/:id |
| DELETE | /leads/:id |

---

### Notes

| Method | Route |
|--------|------|
| POST | /notes |
| GET | /notes/:customerId |

---

# 10. Ticket APIs

Base:

```text
/api/v1/tickets
```

| Method | Route | Purpose |
|--------|------|---------|
| POST | / | Create ticket |
| GET | / | List tickets |
| GET | /:id | Single ticket |
| PATCH | /:id | Update ticket |
| DELETE | /:id | Soft delete |
| PATCH | /:id/assign | Assign |
| PATCH | /:id/status | Status |
| PATCH | /:id/close | Close |
| PATCH | /:id/reopen | Reopen |
| PATCH | /:id/merge | Merge |

Query support:
- page
- limit
- search
- priority
- status
- assignee
- created_at

---

# 11. Comments APIs

Base:

```text
/api/v1/comments
```

| Method | Route |
|--------|------|
| POST | / |
| GET | /ticket/:id |
| PATCH | /:id |
| DELETE | /:id |

---

# 12. Notifications APIs

Base:

```text
/api/v1/notifications
```

| Method | Route |
|--------|------|
| GET | / |
| PATCH | /:id/read |
| PATCH | /read-all |
| DELETE | /:id |

---

# 13. Billing APIs

Base:

```text
/api/v1/billing
```

| Method | Route |
|--------|------|
| GET | /plans |
| GET | /subscription |
| PATCH | /upgrade |
| PATCH | /downgrade |
| PATCH | /cancel |
| GET | /usage |
| GET | /invoices |

---

# 14. Payments APIs

Base:

```text
/api/v1/payments
```

| Method | Route |
|--------|------|
| POST | /checkout |
| POST | /webhook |
| GET | /history |
| POST | /retry |

---

# 15. Files APIs

Base:

```text
/api/v1/files
```

| Method | Route |
|--------|------|
| POST | /upload |
| DELETE | /:id |
| GET | /signed-url/:id |

---

# 16. Search APIs

Base:

```text
/api/v1/search
```

| Method | Route |
|--------|------|
| GET | /global |
| GET | /tickets |
| GET | /customers |

Supports:
- q
- page
- limit
- sort

---

# 17. Analytics APIs

Base:

```text
/api/v1/analytics
```

| Method | Route |
|--------|------|
| GET | /dashboard |
| GET | /tickets |
| GET | /sla |
| GET | /revenue |
| GET | /productivity |

---

# 18. Reports APIs

Base:

```text
/api/v1/reports
```

| Method | Route |
|--------|------|
| POST | /export/csv |
| POST | /export/pdf |
| GET | /history |

---

# 19. Admin APIs

Base:

```text
/api/v1/admin
```

| Method | Route |
|--------|------|
| GET | /tenants |
| PATCH | /tenants/:id/block |
| GET | /revenue |
| GET | /health |
| GET | /analytics |

---

# 20. API Security

Applied globally:

- JWT auth
- Refresh token validation
- RBAC middleware
- Tenant isolation
- Joi validation
- Rate limiting
- Helmet
- CORS
- Input sanitization
- Request logging

---

# 21. Pagination Pattern

```text
GET /tickets?page=1&limit=20
```

Response:

```json
{
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 240
  }
}
```

---

# 22. API Versioning

```text
/api/v1/
```

Future:
- /api/v2/

---

# 23. Why This API Design

This structure supports:

- Clean modular routes
- Strong RBAC
- Tenant-safe access
- Scalable APIs
- Easy frontend integration
- Better testing
- Realtime support
- Queue-driven workflows
- Resume-grade backend design