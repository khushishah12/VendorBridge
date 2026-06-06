# VendorBridge ERP - Backend Implementation Guide

## 🎯 Overview

This document provides a complete guide to the VendorBridge backend implementation, including database setup, API endpoints, authentication, and deployment instructions.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Environment Configuration](#environment-configuration)
4. [Installation](#installation)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Authentication](#authentication)
8. [Role-Based Access Control](#role-based-access-control)
9. [Deployment](#deployment)
10. [Testing](#testing)

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or Neon)
- npm or yarn package manager

## Database Setup

### Option 1: Neon PostgreSQL (Recommended for Production)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to `.env` file

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb vendorbridge`
3. Use connection string: `postgresql://username:password@localhost:5432/vendorbridge`

## Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your values:
```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/vendorbridge?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"

# JWT
JWT_SECRET="generate-another-random-secret-key-here"

# App
NODE_ENV="development"
```

3. Generate secure secrets:
```bash
# For NEXTAUTH_SECRET and JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Installation

1. Install dependencies:
```bash
cd vendor-bridge-app
npm install
```

2. Generate Prisma Client:
```bash
npx prisma generate
```

3. Push database schema:
```bash
npx prisma db push
```

Or create a migration:
```bash
npx prisma migrate dev --name init
```

4. (Optional) Seed the database:
```bash
npx prisma db seed
```

5. Start development server:
```bash
npm run dev
```

## Database Schema

### Core Models

#### User
- Authentication and user management
- Roles: ADMIN, MANAGER, PROCUREMENT_OFFICER, VENDOR
- Status: ACTIVE, INACTIVE, SUSPENDED

#### Vendor
- Vendor profile and compliance data
- Ratings and performance metrics
- Bank details and certifications

#### RFQ (Request for Quotation)
- Procurement requests
- Status: DRAFT, PUBLISHED, OPEN, CLOSED, CANCELLED
- Items, deadlines, and vendor invitations

#### Quotation
- Vendor responses to RFQs
- Pricing, delivery time, terms
- Status: SUBMITTED, UNDER_REVIEW, SHORTLISTED, ACCEPTED, REJECTED

#### Approval
- Workflow approval management
- Multi-level approval support
- Risk flags and compliance checks

#### PurchaseOrder
- Generated from approved quotations
- Status tracking and delivery management
- Payment terms and conditions

#### Invoice
- Billing and payment tracking
- Status: DRAFT, SENT, PAID, UNPAID, OVERDUE, CANCELLED

#### ActivityLog
- Complete audit trail
- User actions and system events

#### Notification
- Real-time alerts and updates
- Priority-based notifications

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "confirmPassword": "SecurePass@123",
  "name": "John Doe",
  "phone": "+91 98765 43210",
  "role": "PROCUREMENT_OFFICER",
  "department": "IT",
  "companyName": "Acme Corp",
  "gstNumber": "27AAAAA1111A1Z1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "clx...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "PROCUREMENT_OFFICER",
      "status": "ACTIVE"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /api/auth/login
Authenticate and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "PROCUREMENT_OFFICER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET /api/auth/me
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PROCUREMENT_OFFICER",
    "department": "IT",
    "vendor": null
  }
}
```

### Vendor Management

#### GET /api/vendors
List all vendors with pagination and filters.

**Query Parameters:**
- `status`: Filter by status (ACTIVE, PENDING, INACTIVE, BLACKLISTED)
- `category`: Filter by category
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vendors": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

#### POST /api/vendors
Create a new vendor.

**Roles:** ADMIN, PROCUREMENT_OFFICER

**Request Body:**
```json
{
  "companyName": "TechSolutions Inc.",
  "contactPerson": "Jane Smith",
  "email": "jane@techsolutions.com",
  "phone": "+91 98765 43210",
  "gstNumber": "27AAAAA1111A1Z1",
  "category": "IT Hardware",
  "address": "123 Tech Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```

#### GET /api/vendors/[id]
Get vendor details by ID.

#### PATCH /api/vendors/[id]
Update vendor information.

**Roles:** ADMIN, PROCUREMENT_OFFICER

#### DELETE /api/vendors/[id]
Delete a vendor.

**Roles:** ADMIN

### RFQ Management

#### GET /api/rfqs
List all RFQs with filters.

#### POST /api/rfqs
Create a new RFQ.

**Roles:** PROCUREMENT_OFFICER

#### GET /api/rfqs/[id]
Get RFQ details.

#### PATCH /api/rfqs/[id]
Update RFQ.

#### POST /api/rfqs/[id]/publish
Publish RFQ to vendors.

### Quotation Management

#### GET /api/quotations
List quotations.

#### POST /api/quotations
Submit a quotation (Vendor role).

#### GET /api/quotations/[id]
Get quotation details.

#### PATCH /api/quotations/[id]/review
Review and update quotation status.

**Roles:** PROCUREMENT_OFFICER, MANAGER

### Approval Workflow

#### GET /api/approvals
List approval requests.

#### POST /api/approvals
Create approval request.

#### PATCH /api/approvals/[id]/review
Approve or reject.

**Roles:** MANAGER, ADMIN

#### POST /api/approvals/bulk-review
Bulk approve/reject multiple requests.

### Purchase Orders

#### GET /api/purchase-orders
List purchase orders.

#### POST /api/purchase-orders
Generate PO from approved quotation.

#### GET /api/purchase-orders/[id]
Get PO details.

#### PATCH /api/purchase-orders/[id]/status
Update PO status.

### Invoices

#### GET /api/invoices
List invoices.

#### POST /api/invoices
Create invoice.

#### GET /api/invoices/[id]
Get invoice details.

#### PATCH /api/invoices/[id]/status
Update invoice status (mark as paid, etc.).

### Notifications

#### GET /api/notifications
Get user notifications.

#### PATCH /api/notifications/[id]/read
Mark notification as read.

#### POST /api/notifications/mark-all-read
Mark all notifications as read.

### Activity Logs

#### GET /api/activity-logs
Get activity logs with filters.

**Query Parameters:**
- `entityType`: Filter by entity type
- `userId`: Filter by user
- `startDate`: Filter by date range
- `endDate`: Filter by date range

## Authentication

### JWT Token Structure

```json
{
  "userId": "clx...",
  "email": "user@example.com",
  "role": "PROCUREMENT_OFFICER",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Using Authentication

Include the JWT token in the Authorization header:

```javascript
fetch('/api/vendors', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## Role-Based Access Control

### Role Hierarchy

1. **ADMIN** - Full system access
2. **MANAGER** - Approval workflows, reporting
3. **PROCUREMENT_OFFICER** - RFQ, quotation, PO management
4. **VENDOR** - Submit quotations, view RFQs

### Permission Matrix

| Resource | ADMIN | MANAGER | PROCUREMENT_OFFICER | VENDOR |
|----------|-------|---------|---------------------|--------|
| Users | CRUD | R | R | - |
| Vendors | CRUD | R | CRU | R (self) |
| RFQs | CRUD | R | CRUD | R (invited) |
| Quotations | CRUD | RU | RU | CRU (own) |
| Approvals | CRUD | CRU | CR | - |
| POs | CRUD | R | CRUD | R (own) |
| Invoices | CRUD | R | CRUD | CR (own) |

## Deployment

### Vercel Deployment

1. Push code to GitHub

2. Import project in Vercel

3. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `JWT_SECRET`
   - `NODE_ENV=production`

4. Deploy:
```bash
vercel --prod
```

### Database Migration

For production database:
```bash
npx prisma migrate deploy
```

### Post-Deployment

1. Verify database connection
2. Test authentication endpoints
3. Create admin user
4. Configure CORS if needed

## Testing

### Manual Testing

Use tools like:
- Postman
- Thunder Client (VS Code extension)
- curl

### Example curl Request

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "confirmPassword": "Test@123456",
    "name": "Test User",
    "role": "PROCUREMENT_OFFICER"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456"
  }'

# Get vendors (with token)
curl -X GET http://localhost:3000/api/vendors \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Common Issues

1. **Prisma Client not generated**
   ```bash
   npx prisma generate
   ```

2. **Database connection failed**
   - Check DATABASE_URL in .env
   - Verify database is running
   - Check firewall/network settings

3. **JWT token invalid**
   - Verify JWT_SECRET matches
   - Check token expiration
   - Ensure proper Authorization header format

4. **CORS errors**
   - Configure CORS in next.config.ts if needed
   - Check NEXTAUTH_URL matches your domain

## Next Steps

1. ✅ Complete remaining API routes (RFQ, Quotations, Approvals, POs, Invoices)
2. ✅ Connect frontend to backend APIs
3. ✅ Implement real-time notifications
4. ✅ Add file upload functionality
5. ✅ Create admin dashboard
6. ✅ Add comprehensive error handling
7. ✅ Write unit and integration tests
8. ✅ Set up CI/CD pipeline
9. ✅ Add API rate limiting
10. ✅ Implement caching strategy

## Support

For issues or questions:
- Check the documentation
- Review error logs
- Inspect network requests
- Verify environment variables

## License

Proprietary - VendorBridge ERP System