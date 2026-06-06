# Waitlist API Requirements

## Overview

Simple waitlist signup system that captures emails without full account creation.

## Frontend Implementation ✅

- **Component**: `EarlyAccessView.jsx`
- **Redux Slice**: `referralSlice.js`
- **Action**: `joinWaitlist(email)`

---

## Backend API Specification

### Endpoint

```
POST /api/v1/waitlist/join
```

### Request Body

```json
{
  "email": "user@example.com"
}
```

### Response (Success)

```json
{
  "success": true,
  "message": "Successfully joined the waitlist",
  "data": {
    "email": "user@example.com",
    "joinedAt": "2026-01-07T10:30:00Z"
  }
}
```

### Response (Error - Duplicate Email)

```json
{
  "success": false,
  "message": "Email already on waitlist"
}
```

### Response (Error - Invalid Email)

```json
{
  "success": false,
  "message": "Invalid email format"
}
```

---

## Database Schema

### Table: `waitlist_emails`

| Column         | Type         | Constraints            | Description                               |
| -------------- | ------------ | ---------------------- | ----------------------------------------- |
| `id`           | UUID/INT     | PRIMARY KEY            | Unique identifier                         |
| `email`        | VARCHAR(255) | UNIQUE, NOT NULL       | User email address                        |
| `status`       | ENUM         | DEFAULT 'waitlist'     | Status tag (waitlist, invited, converted) |
| `source`       | VARCHAR(50)  | DEFAULT 'landing_page' | Signup source tracking                    |
| `joined_at`    | TIMESTAMP    | NOT NULL               | When they joined                          |
| `invited_at`   | TIMESTAMP    | NULL                   | When invitation sent                      |
| `converted_at` | TIMESTAMP    | NULL                   | When they created account                 |

### Indexes

- `idx_email` - Unique index on email for fast lookups
- `idx_status` - Index on status for filtering
- `idx_joined_at` - For chronological sorting

---

## Backend Requirements

### 1. Email Validation

- ✅ Validate email format before saving
- ✅ Check for duplicate emails
- ✅ Return appropriate error messages

### 2. Security

- ✅ Store emails securely (encrypted if possible)
- ✅ Rate limiting (prevent spam submissions)
- ✅ CAPTCHA/bot protection (optional but recommended)
- ✅ GDPR compliance (allow data deletion requests)

### 3. Tagging System

All waitlist entries should be tagged with:

- **status**: 'waitlist' (initial state)
- **source**: 'landing_page' or 'referral'

### 4. Email Confirmation

Send automated confirmation email after signup:

```
Subject: You're on the Elyxa Waitlist! 🎉

Hi there,

Thanks for joining the Elyxa early access waitlist!

We'll notify you as soon as spots become available.

Stay tuned!

The Elyxa Team
```

### 5. CSV Export Endpoint

#### Endpoint

```
GET /api/v1/admin/waitlist/export
```

#### Authentication

- **Required**: Admin role only
- **Headers**: `Authorization: Bearer <admin_token>`

#### Response

```csv
email,status,source,joined_at
user1@example.com,waitlist,landing_page,2026-01-07T10:30:00Z
user2@example.com,waitlist,landing_page,2026-01-07T11:45:00Z
```

#### Query Parameters

- `status` - Filter by status (optional)
- `from_date` - Filter by date range (optional)
- `to_date` - Filter by date range (optional)

Example:

```
GET /api/v1/admin/waitlist/export?status=waitlist&from_date=2026-01-01
```

---

## Admin Dashboard Features (Future)

### Metrics to Display

1. Total waitlist count
2. Daily/weekly signup rate
3. Conversion rate (waitlist → active user)
4. Source breakdown

### Actions

- Export to CSV
- Send bulk invitations
- View individual email details
- Delete/block emails
- Update status (waitlist → invited → converted)

---

## Email Marketing Integration (Optional)

Consider integrating with:

- **Mailchimp** - For email campaigns
- **SendGrid** - For transactional emails
- **ConvertKit** - For creator-focused campaigns

### Webhook Setup

When user joins waitlist, trigger:

1. Confirmation email
2. Add to email marketing list
3. Log analytics event

---

## Testing Checklist

- [ ] Valid email submission works
- [ ] Duplicate email returns proper error
- [ ] Invalid email format rejected
- [ ] Rate limiting prevents spam
- [ ] CSV export works with filters
- [ ] Emails are stored encrypted
- [ ] Success message displays on frontend
- [ ] Error messages display correctly
- [ ] Loading states work properly

---

## Frontend-Backend Communication

### Current Flow

1. User enters email on landing page
2. Frontend dispatches `joinWaitlist(email)` Redux action
3. Action calls `POST /api/v1/waitlist/join`
4. Backend validates, stores, and responds
5. Frontend shows success/error message inline

### No Account Creation

- ❌ No password required
- ❌ No verification code/OTP
- ❌ No user profile creation
- ✅ Just email storage with 'waitlist' tag

---

## Migration from Old System

If migrating from referral system:

1. Keep old endpoint `/api/v1/users/referrals/invite` for backward compatibility
2. New simplified endpoint: `/api/v1/waitlist/join`
3. Both can coexist - use new one for landing page

---

## Priority Tasks for Backend Team

1. **HIGH**: Create `/api/v1/waitlist/join` endpoint
2. **HIGH**: Set up database table `waitlist_emails`
3. **HIGH**: Implement email validation and duplicate checking
4. **MEDIUM**: Add rate limiting
5. **MEDIUM**: Create CSV export endpoint
6. **MEDIUM**: Send confirmation email
7. **LOW**: Admin dashboard for viewing waitlist
8. **LOW**: Email marketing integration

---

## Questions for Backend Team

1. Which database are we using? (PostgreSQL, MySQL, MongoDB?)
2. Do we already have email service configured? (SendGrid, AWS SES?)
3. Should we implement CAPTCHA? (reCAPTCHA, hCaptcha?)
4. What rate limiting strategy? (IP-based, email-based?)
5. Do we need double opt-in confirmation?

---

## Contact

For questions or clarifications, contact the frontend team.

**Last Updated**: January 7, 2026
