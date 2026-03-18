# Software Requirements Specification (SRS)

## HDC CSR Sports Facilities Booking App

| Field          | Value                                      |
| -------------- | ------------------------------------------ |
| Document       | SRS / BRD Hybrid                           |
| Version        | 1.0                                        |
| Date           | 2026-03-18                                 |
| Status         | Draft                                      |
| Owner          | HDC — Corporate Social Responsibility Unit |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Technology Stack](#3-technology-stack)
4. [Facilities Covered](#4-facilities-covered)
5. [Users & Roles](#5-users--roles)
6. [Core Business Rules](#6-core-business-rules)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [System Workflow](#9-system-workflow)
10. [Data Model](#10-data-model)
11. [Integration Points](#11-integration-points)
12. [Build & Deployment](#12-build--deployment)
13. [Acceptance Criteria](#13-acceptance-criteria)

---

## 1. Introduction

### 1.1 Purpose

This document defines the software requirements for the **HDC CSR Sports Facilities Booking App** — a unified digital booking system that enables HDC-registered sports teams to discover, reserve, pay for, and manage bookings at CSR-managed sports facilities and playgrounds across Hulhumalé.

### 1.2 Scope

#### In-Scope

- Team-only authentication and eligibility enforcement
- Facility listing with real-time availability calendar (06:00–23:00)
- Booking request workflow with slot blocking (pending payment)
- Automated email on slot block containing payment link (Stripe), facility usage guidelines, and next steps
- Payment integration with Stripe (Checkout Sessions, Payment Intents, Webhooks)
- Booking confirmation only upon successful Stripe payment
- Automatic SMS on booking confirmation (date, time, facility, reference number)
- Admin portal for the CSR Sports Facilities Unit (approve, configure, report)
- Reporting and export for finance reconciliation

#### Out-of-Scope (unless separately approved)

- Individual (non-team) bookings
- Cash or manual payment confirmation
- Walk-in booking recognition after go-live
- Public user registration without team validation
- Complex league management (fixtures, brackets, standings)

### 1.3 Definitions & Acronyms

| Term                | Definition                                                                 |
| ------------------- | -------------------------------------------------------------------------- |
| HDC                 | Housing Development Corporation                                           |
| CSR                 | Corporate Social Responsibility                                           |
| Team Representative | A verified member of an HDC-registered sports team authorized to book      |
| Slot                | A bookable time window at a specific facility                              |
| Slot Blocking       | Temporarily reserving a slot while payment is pending                      |
| RLS                 | Row Level Security (Supabase/PostgreSQL)                                   |
| Edge Function       | Serverless function running on Supabase (Deno runtime)                     |
| Stripe Webhook      | HTTP callback from Stripe to the backend on payment events                 |
| EAS                 | Expo Application Services (build and submit tooling)                       |

### 1.4 References

- Stripe API Documentation: https://stripe.com/docs/api
- Supabase Documentation: https://supabase.com/docs
- Expo Documentation: https://docs.expo.dev
- Apple Sign-In Guidelines: https://developer.apple.com/sign-in-with-apple
- Google Sign-In for React Native: https://react-native-google-signin.github.io/docs

---

## 2. Overall Description

### 2.1 Product Perspective

The app replaces the current manual/walk-in booking process for HDC CSR-managed sports facilities. It is a standalone mobile application (iOS and Android) backed by Supabase, with Stripe handling all payment processing.

### 2.2 Product Functions (High-Level)

1. Authenticate users via Google or Apple Sign-In
2. Verify team membership and eligibility
3. Display facility catalog with real-time availability
4. Accept booking requests and block slots
5. Process payments through Stripe
6. Record digital acceptance of facility usage guidelines
7. Send automated email and SMS notifications
8. Provide an admin interface for facility and booking management
9. Generate reports for operations and finance

### 2.3 Operating Environment

- **Client**: iOS 15+ and Android 10+ (React Native / Expo)
- **Backend**: Supabase (hosted PostgreSQL, Auth, Edge Functions, Realtime, Storage)
- **Payments**: Stripe (server-side via Edge Functions)
- **Notifications**: Email service (e.g., Resend, SendGrid) + SMS gateway (e.g., Twilio)

### 2.4 Constraints

- Bookings restricted to 06:00–23:00 daily
- Only HDC-registered teams may book
- All bookings must originate from the app (no manual entries post go-live)
- Payment must complete before a booking is confirmed
- Apple Sign-In is mandatory for iOS App Store compliance

---

## 3. Technology Stack

| Layer              | Technology                                              |
| ------------------ | ------------------------------------------------------- |
| Mobile Framework   | React Native with Expo (Managed → Prebuild workflow)    |
| Navigation         | Expo Router or React Navigation                         |
| State Management   | React Context / Zustand (TBD)                           |
| Backend / Database | Supabase (PostgreSQL 15+)                               |
| Authentication     | Supabase Auth (Google OAuth + Apple Sign-In providers)  |
| Authorization      | Supabase Row Level Security (RLS) policies              |
| Serverless Logic   | Supabase Edge Functions (Deno/TypeScript)                |
| Payments           | Stripe (Checkout Sessions, Payment Intents, Webhooks)   |
| Email              | Resend / SendGrid (via Edge Function)                   |
| SMS                | Twilio / equivalent (via Edge Function)                  |
| File Storage       | Supabase Storage (facility images, guideline PDFs)       |
| Build & CI         | Expo CLI (`expo prebuild`), EAS Build, EAS Submit        |
| Testing (Dev)      | Expo Go                                                  |
| Distribution       | TestFlight (iOS), Google Play Console (Android)          |

---

## 4. Facilities Covered

Facilities are **configurable inventory** managed via the admin portal — not hard-coded. The initial seed data includes:

### Neighborhood 1 — HDC Park Area

| # | Facility                      | Type             |
|---|-------------------------------|------------------|
| 1 | My Hulhumalé Basketball Court | Basketball       |
| 2 | HDC Volleyball Court          | Volleyball       |
| 3 | HDC Half Basketball Court     | Basketball (Half)|

### Neighborhood 2 — Container Park & Sunset Park

| # | Facility                             | Type              |
|---|--------------------------------------|-------------------|
| 4 | My Hulhumalé Volleyball Court        | Volleyball        |
| 5 | Fiyavathi Playing Ground             | Mini Football     |
| 6 | Sunset Park Volleyball Court         | Volleyball        |

### Central Park Area

| # | Facility            | Type      |
|---|---------------------|-----------|
| 7 | Netball Court 1     | Netball   |
| 8 | Netball Court 2     | Netball   |
| 9 | Handball Court      | Handball  |

### Neighborhood 3 — Fehires Park

| # | Facility                | Type              |
|---|-------------------------|-------------------|
| 10| Volleyball Court        | Volleyball        |
| 11| Basketball Court (Half) | Basketball (Half) |

### Neighborhood 6 — Hulhumalé Kulhivaru Ekuveni

| # | Facility             | Type              |
|---|----------------------|-------------------|
| 12| Bashi Ball Court 1   | Bashi Ball        |
| 13| Bashi Ball Court 2   | Bashi Ball        |
| 14| Volleyball Court     | Volleyball        |
| 15| Basketball Court     | Basketball        |
| 16| Multi-Purpose Court  | Multi-Purpose     |

---

## 5. Users & Roles

### 5.1 Team Representative (Customer)

- Must belong to an **active** HDC-registered sports team
- Authenticates via Google or Apple Sign-In
- **Capabilities**: view facility availability, submit booking requests, accept usage guidelines, pay via Stripe, view booking history and confirmations

### 5.2 CSR Admin (Sports Facilities Unit)

- Internal HDC staff managing facilities
- **Capabilities**: manage facilities (CRUD), set operating hours, configure pricing rules, manage blockout dates, review/approve bookings (if approval step enabled), monitor payments, view/export reports

### 5.3 Finance (Optional Role)

- Internal HDC finance staff
- **Capabilities**: view payment reconciliation reports, export transactions for accounting

### 5.4 System Admin (IT)

- Internal HDC IT staff
- **Capabilities**: manage system settings, configure notification templates, manage integrations (Stripe, SMS, Email), view audit logs, manage user access and roles

### 5.5 Role Matrix

| Capability                  | Team Rep | CSR Admin | Finance | Sys Admin |
|-----------------------------|----------|-----------|---------|-----------|
| View facilities             | Yes      | Yes       | No      | Yes       |
| Submit booking              | Yes      | No        | No      | No        |
| Manage facilities           | No       | Yes       | No      | No        |
| Approve/reject bookings     | No       | Yes       | No      | No        |
| View payment reports        | No       | Yes       | Yes     | Yes       |
| Export financial data        | No       | No        | Yes     | Yes       |
| Manage system settings      | No       | No        | No      | Yes       |
| Manage notification templates| No      | Yes       | No      | Yes       |
| View audit logs             | No       | No        | No      | Yes       |

---

## 6. Core Business Rules

| ID    | Rule                    | Description                                                                                                         |
|-------|-------------------------|---------------------------------------------------------------------------------------------------------------------|
| BR-01 | Operating Hours          | Bookings allowed only between **06:00** and **23:00** daily.                                                        |
| BR-02 | Portal-Only              | Bookings must originate from the app/portal. Manual bookings are invalid after go-live.                              |
| BR-03 | Team-Only                | Only HDC-registered teams may book. Individuals cannot book.                                                         |
| BR-04 | Eligibility Enforcement  | Every booking must be tied to a **Team ID**. The user must be a verified representative of that team.                |
| BR-05 | Slot Blocking            | When a booking request is provisionally accepted, the slot becomes **Blocked (Pending Payment)**.                    |
| BR-06 | Payment Required         | Booking status becomes **Confirmed** only after successful Stripe payment.                                           |
| BR-07 | Guidelines Acceptance    | Digital acceptance of facility usage guidelines is required. System records timestamp and guideline version.          |
| BR-08 | Automated Email          | On slot block, system sends email with: slot details, Stripe payment link, facility usage guidelines, next steps.    |
| BR-09 | Automated SMS            | On booking confirmation (after payment), system sends SMS with: date, time, facility name, booking reference.        |
| BR-10 | No Double Booking        | System must prevent overlapping bookings for the same facility and time slot.                                         |
| BR-11 | Expiry                   | If payment is not received within the configured deadline (e.g., 30 minutes), booking expires and slot is released.  |

---

## 7. Functional Requirements

### 7.1 Authentication & Authorization

| ID      | Requirement                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| FR-1.1  | System shall support **Google Sign-In** via Supabase Auth (OAuth 2.0).                                   |
| FR-1.2  | System shall support **Apple Sign-In** via Supabase Auth (required for iOS).                             |
| FR-1.3  | On first login, system shall create a user profile linked to the Supabase Auth `user.id`.                |
| FR-1.4  | System shall check if the authenticated user is linked to an **active** HDC-registered team.             |
| FR-1.5  | If the user is not linked to any team, they shall see a restricted view with instructions to register.   |
| FR-1.6  | Session tokens shall be managed by the Supabase client SDK with automatic refresh.                       |
| FR-1.7  | RLS policies shall enforce that users can only access data belonging to their own team.                  |

### 7.2 Team Verification & Eligibility

| ID      | Requirement                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| FR-2.1  | System shall maintain a **teams** table with: team ID, name, sport type, registration status, representatives. |
| FR-2.2  | A team must have status = `active` to be eligible for booking.                                           |
| FR-2.3  | Each team shall have one or more designated **representatives** (linked user accounts).                   |
| FR-2.4  | CSR Admin shall be able to add, edit, deactivate, and reactivate teams.                                  |
| FR-2.5  | CSR Admin shall be able to assign or revoke team representative status for users.                        |

### 7.3 Facility Management

| ID      | Requirement                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| FR-3.1  | System shall maintain a **facilities** table with: ID, name, neighborhood/area, sport type, capacity, description, images, status. |
| FR-3.2  | CSR Admin shall be able to create, edit, activate, and deactivate facilities.                            |
| FR-3.3  | Each facility shall have configurable **operating hours** (default 06:00–23:00).                         |
| FR-3.4  | Each facility shall have configurable **slot duration** (e.g., 60 min, 90 min, 120 min).                |
| FR-3.5  | Each facility shall have a configurable **price per slot** (in MVR).                                     |
| FR-3.6  | CSR Admin shall be able to create **blockout dates/times** (maintenance, events, holidays).              |
| FR-3.7  | Facility images shall be stored in Supabase Storage with public read access.                             |

### 7.4 Availability Calendar & Slot Management

| ID      | Requirement                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| FR-4.1  | System shall display a **calendar view** showing available, blocked, and booked slots per facility.      |
| FR-4.2  | Slots outside operating hours (before 06:00 or after 23:00) shall not be displayed.                     |
| FR-4.3  | Slots with existing confirmed or blocked bookings shall be shown as **unavailable**.                     |
| FR-4.4  | Slots within blockout periods shall be shown as **unavailable**.                                          |
| FR-4.5  | Calendar shall support navigation by day and week.                                                        |
| FR-4.6  | Slot availability shall update in **near real-time** (Supabase Realtime subscriptions or polling).       |

### 7.5 Booking Request Workflow

| ID      | Requirement                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| FR-5.1  | Team representative selects a facility, date, and available time slot.                                   |
| FR-5.2  | System verifies team eligibility (active status + representative role) before allowing submission.        |
| FR-5.3  | System checks for conflicts (BR-10: no double booking) using a database-level constraint or transaction. |
| FR-5.4  | On successful submission, booking status is set to **`blocked`** (Pending Payment).                      |
| FR-5.5  | System records the booking with: booking ID, team ID, facility ID, date, start time, end time, status, created timestamp, payment deadline. |
| FR-5.6  | System immediately sends the **slot-blocked email** (BR-08) containing Stripe payment link, guidelines, and deadline. |
| FR-5.7  | If CSR Admin approval is enabled, booking goes to **`pending_approval`** before `blocked`. Admin approves → `blocked` → email sent. |
| FR-5.8  | A background job or database trigger shall monitor payment deadlines and expire unpaid bookings (BR-11). |

### 7.6 Stripe Payment Integration

| ID      | Requirement                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| FR-6.1  | System shall create a **Stripe Checkout Session** for each blocked booking via a Supabase Edge Function. |
| FR-6.2  | The Checkout Session shall include: booking reference, facility name, slot details, amount (MVR), team name. |
| FR-6.3  | The payment link shall be included in the slot-blocked email and available in-app.                       |
| FR-6.4  | System shall expose a **Stripe Webhook endpoint** (Edge Function) to receive payment events.             |
| FR-6.5  | On `checkout.session.completed` event, system shall update booking status to **`confirmed`**.            |
| FR-6.6  | On `checkout.session.expired` event, system shall update booking status to **`expired`** and release the slot. |
| FR-6.7  | Webhook handler shall **verify the Stripe signature** to prevent spoofed events.                         |
| FR-6.8  | System shall store a **payments** record: payment ID, Stripe session ID, Stripe payment intent ID, amount, currency, status, booking ID, timestamps. |
| FR-6.9  | System shall support **refund initiation** by CSR Admin (via Stripe API, recorded in payments table).    |
| FR-6.10 | All Stripe API calls shall use the **secret key server-side only** (Edge Functions). The publishable key is used client-side only for Stripe SDK initialization. |

### 7.7 Guidelines Acceptance

| ID      | Requirement                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| FR-7.1  | Before completing a booking, the team representative must digitally accept the facility usage guidelines. |
| FR-7.2  | Guidelines shall be versioned. The current version is displayed during the acceptance step.               |
| FR-7.3  | System shall record: user ID, guideline version, acceptance timestamp, booking ID.                       |
| FR-7.4  | CSR Admin shall be able to update guideline content and version through the admin portal.                |
| FR-7.5  | Guidelines text/PDF shall be stored in Supabase Storage.                                                 |

### 7.8 Notifications

| ID      | Requirement                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| FR-8.1  | **Email — Slot Blocked**: Triggered when booking status → `blocked`. Contains: facility name, date/time, Stripe payment link, guidelines summary, payment deadline, next steps. |
| FR-8.2  | **SMS — Booking Confirmed**: Triggered when booking status → `confirmed`. Contains: facility name, date, time, booking reference number. |
| FR-8.3  | **Email — Booking Confirmed** (optional): Triggered alongside SMS as a confirmation receipt.             |
| FR-8.4  | **Email — Booking Expired**: Triggered when booking status → `expired` (payment deadline passed).        |
| FR-8.5  | Notification templates shall be configurable by System Admin.                                             |
| FR-8.6  | All notifications shall be logged with: type, recipient, status (sent/failed), timestamp.                |
| FR-8.7  | Email delivery shall use an Edge Function calling the email provider API (Resend/SendGrid).              |
| FR-8.8  | SMS delivery shall use an Edge Function calling the SMS provider API (Twilio or equivalent).             |

### 7.9 Admin Portal

| ID      | Requirement                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| FR-9.1  | Admin portal shall be accessible within the app (role-gated screens) or as a separate web dashboard.     |
| FR-9.2  | **Dashboard**: Overview of today's bookings, pending approvals, revenue summary, facility utilization.   |
| FR-9.3  | **Facility Management**: CRUD operations on facilities, operating hours, pricing, blockouts.              |
| FR-9.4  | **Booking Management**: List, filter, search bookings by status, facility, team, date range. Approve/reject if approval workflow enabled. |
| FR-9.5  | **Team Management**: List, filter, search teams. Activate/deactivate teams. Assign representatives.      |
| FR-9.6  | **Payment Management**: View payment status per booking. Initiate refunds. Export payment data.           |
| FR-9.7  | **Guidelines Management**: Upload/edit guideline content. Manage versions.                                |
| FR-9.8  | **Settings**: Configure payment deadline duration, operating hours defaults, notification templates.      |

### 7.10 Reporting & Export

| ID       | Requirement                                                                                             |
|----------|---------------------------------------------------------------------------------------------------------|
| FR-10.1  | **Booking Report**: Bookings by facility, team, date range, status. Filterable and exportable (CSV).    |
| FR-10.2  | **Revenue Report**: Revenue by facility, by period. Reconciliation with Stripe transactions.             |
| FR-10.3  | **Utilization Report**: Facility usage percentage by time slot, day of week, facility.                   |
| FR-10.4  | **Team Activity Report**: Bookings per team, payment history, guideline acceptance records.              |
| FR-10.5  | Finance role shall be able to export reports in CSV format for accounting systems.                       |

---

## 8. Non-Functional Requirements

### 8.1 Performance

| ID      | Requirement                                                                  |
|---------|------------------------------------------------------------------------------|
| NFR-1.1 | Availability calendar shall load within **2 seconds** on a 4G connection.    |
| NFR-1.2 | Booking submission (slot block) shall complete within **3 seconds**.          |
| NFR-1.3 | Stripe Checkout Session creation shall complete within **5 seconds**.         |
| NFR-1.4 | Webhook processing shall complete within **10 seconds** of receipt.           |

### 8.2 Security

| ID      | Requirement                                                                  |
|---------|------------------------------------------------------------------------------|
| NFR-2.1 | All API communication shall use **HTTPS/TLS**.                               |
| NFR-2.2 | Supabase **RLS policies** shall enforce data isolation between teams.        |
| NFR-2.3 | Stripe secret keys shall be stored as **environment variables** in Edge Functions, never in client code. |
| NFR-2.4 | Stripe webhooks shall be verified using **signature validation**.            |
| NFR-2.5 | Authentication tokens shall expire and auto-refresh per Supabase Auth defaults. |
| NFR-2.6 | Admin roles shall be enforced both client-side (UI gating) and server-side (RLS + Edge Function checks). |
| NFR-2.7 | System shall log all admin actions for audit trail.                          |

### 8.3 Availability & Reliability

| ID      | Requirement                                                                  |
|---------|------------------------------------------------------------------------------|
| NFR-3.1 | System shall target **99.5% uptime** (aligned with Supabase SLA).           |
| NFR-3.2 | Failed webhook deliveries shall be retried by Stripe (automatic).            |
| NFR-3.3 | Booking expiry jobs shall run reliably even under partial system failure.     |

### 8.4 Scalability

| ID      | Requirement                                                                  |
|---------|------------------------------------------------------------------------------|
| NFR-4.1 | System shall support up to **500 concurrent users** without degradation.     |
| NFR-4.2 | Database schema shall support adding new facilities without code changes.    |

### 8.5 Usability

| ID      | Requirement                                                                  |
|---------|------------------------------------------------------------------------------|
| NFR-5.1 | App shall support **Dhivehi (Thaana)** and **English** (bilingual UI).       |
| NFR-5.2 | Calendar and booking flow shall be completable in **under 5 taps** from home screen. |

---

## 9. System Workflow

### 9.1 End-to-End Booking Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BOOKING WORKFLOW                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. AUTHENTICATE                                                    │
│     User opens app → Signs in via Google / Apple                    │
│     ↓                                                               │
│  2. VERIFY ELIGIBILITY                                              │
│     System checks: user linked to active team?                      │
│     ├── No  → Show "Register your team" message                    │
│     └── Yes → Proceed                                               │
│     ↓                                                               │
│  3. BROWSE FACILITIES                                               │
│     User views facility list → Selects facility                     │
│     → Views availability calendar (06:00–23:00)                     │
│     ↓                                                               │
│  4. SELECT SLOT                                                     │
│     User picks available date + time slot                           │
│     ↓                                                               │
│  5. ACCEPT GUIDELINES                                               │
│     User reads and digitally accepts facility usage guidelines      │
│     (version + timestamp recorded)                                  │
│     ↓                                                               │
│  6. SUBMIT BOOKING                                                  │
│     System checks for conflicts (no double booking)                 │
│     ├── Conflict → Show error, return to calendar                  │
│     └── OK → Create booking with status = BLOCKED                  │
│     ↓                                                               │
│  7. SLOT BLOCKED — EMAIL SENT                                       │
│     System sends email with:                                        │
│     • Booking details (facility, date, time)                        │
│     • Stripe payment link                                           │
│     • Facility usage guidelines                                     │
│     • Payment deadline (e.g., 30 min)                               │
│     ↓                                                               │
│  8. PAYMENT                                                         │
│     User clicks Stripe link (in-app or email)                       │
│     → Completes payment on Stripe Checkout                          │
│     ↓                                                               │
│  9. STRIPE WEBHOOK                                                  │
│     Stripe sends checkout.session.completed                         │
│     → Edge Function verifies signature                              │
│     → Updates booking status = CONFIRMED                            │
│     ↓                                                               │
│  10. CONFIRMATION — SMS SENT                                        │
│      System sends SMS: "Booking confirmed —                         │
│      [Facility] on [Date] at [Time]. Ref: [ID]"                    │
│      (Optional: confirmation email also sent)                       │
│                                                                     │
│  ── EXPIRY PATH ──                                                  │
│  If payment not received within deadline:                           │
│     → Booking status = EXPIRED                                      │
│     → Slot released for others                                      │
│     → Expiry email sent to user                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 Admin Approval Variant (Optional)

If the approval workflow is enabled for a facility:

```
  Submit Booking → status = PENDING_APPROVAL
       ↓
  CSR Admin reviews → Approve or Reject
       ├── Reject → status = REJECTED, notify user
       └── Approve → status = BLOCKED → email sent → payment flow continues
```

---

## 10. Data Model

### 10.1 Entity Relationship Overview

```
users ──┐
        ├──< team_members >──┤
teams ──┘                    │
  │                          │
  └──< bookings >────────── facilities
         │       │
         │       └──< guideline_acceptances
         │
         └──< payments
```

### 10.2 Core Tables

#### `profiles`
| Column           | Type        | Notes                                |
|------------------|-------------|--------------------------------------|
| id               | uuid (PK)   | References `auth.users.id`           |
| full_name        | text        |                                      |
| email            | text        |                                      |
| phone            | text        | For SMS notifications                |
| role             | enum        | `team_rep`, `csr_admin`, `finance`, `sys_admin` |
| created_at       | timestamptz |                                      |
| updated_at       | timestamptz |                                      |

#### `teams`
| Column           | Type        | Notes                                |
|------------------|-------------|--------------------------------------|
| id               | uuid (PK)   |                                      |
| name             | text        |                                      |
| sport_type       | text        |                                      |
| registration_no  | text        | HDC registration reference           |
| status           | enum        | `active`, `inactive`, `suspended`    |
| created_at       | timestamptz |                                      |
| updated_at       | timestamptz |                                      |

#### `team_members`
| Column           | Type        | Notes                                |
|------------------|-------------|--------------------------------------|
| id               | uuid (PK)   |                                      |
| team_id          | uuid (FK)   | → teams.id                           |
| user_id          | uuid (FK)   | → profiles.id                        |
| is_representative| boolean     | Can book on behalf of team           |
| status           | enum        | `active`, `inactive`                 |
| created_at       | timestamptz |                                      |

#### `facilities`
| Column           | Type        | Notes                                |
|------------------|-------------|--------------------------------------|
| id               | uuid (PK)   |                                      |
| name             | text        |                                      |
| neighborhood     | text        | Area/zone grouping                   |
| sport_type       | text        |                                      |
| description      | text        |                                      |
| capacity         | integer     |                                      |
| image_urls       | text[]      | Supabase Storage paths               |
| slot_duration_min| integer     | e.g., 60, 90, 120                    |
| price_per_slot   | decimal     | In MVR                               |
| operating_start  | time        | Default 06:00                        |
| operating_end    | time        | Default 23:00                        |
| status           | enum        | `active`, `inactive`                 |
| created_at       | timestamptz |                                      |
| updated_at       | timestamptz |                                      |

#### `blockouts`
| Column           | Type        | Notes                                |
|------------------|-------------|--------------------------------------|
| id               | uuid (PK)   |                                      |
| facility_id      | uuid (FK)   | → facilities.id                      |
| start_datetime   | timestamptz |                                      |
| end_datetime     | timestamptz |                                      |
| reason           | text        |                                      |
| created_by       | uuid (FK)   | → profiles.id                        |
| created_at       | timestamptz |                                      |

#### `bookings`
| Column           | Type        | Notes                                |
|------------------|-------------|--------------------------------------|
| id               | uuid (PK)   |                                      |
| reference_no     | text        | Human-readable reference (e.g., HDC-20260318-001) |
| team_id          | uuid (FK)   | → teams.id                           |
| facility_id      | uuid (FK)   | → facilities.id                      |
| booked_by        | uuid (FK)   | → profiles.id (the representative)   |
| booking_date     | date        |                                      |
| start_time       | time        |                                      |
| end_time         | time        |                                      |
| status           | enum        | `pending_approval`, `blocked`, `confirmed`, `expired`, `cancelled`, `rejected` |
| payment_deadline | timestamptz | When the blocked slot expires         |
| created_at       | timestamptz |                                      |
| updated_at       | timestamptz |                                      |

**Unique constraint**: `(facility_id, booking_date, start_time)` WHERE status IN (`blocked`, `confirmed`) — prevents double booking (BR-10).

#### `payments`
| Column             | Type        | Notes                              |
|--------------------|-------------|-------------------------------------|
| id                 | uuid (PK)   |                                     |
| booking_id         | uuid (FK)   | → bookings.id                       |
| stripe_session_id  | text        | Stripe Checkout Session ID           |
| stripe_payment_intent_id | text  | Stripe Payment Intent ID             |
| amount             | decimal     |                                     |
| currency           | text        | e.g., `MVR`                         |
| status             | enum        | `pending`, `completed`, `refunded`, `failed` |
| refund_reason      | text        | Nullable                            |
| created_at         | timestamptz |                                     |
| updated_at         | timestamptz |                                     |

#### `guideline_acceptances`
| Column           | Type        | Notes                                |
|------------------|-------------|--------------------------------------|
| id               | uuid (PK)   |                                      |
| booking_id       | uuid (FK)   | → bookings.id                        |
| user_id          | uuid (FK)   | → profiles.id                        |
| guideline_version| text        | e.g., "v2.1"                         |
| accepted_at      | timestamptz |                                      |

#### `guidelines`
| Column           | Type        | Notes                                |
|------------------|-------------|--------------------------------------|
| id               | uuid (PK)   |                                      |
| version          | text        |                                      |
| content          | text        | Markdown or plain text               |
| file_url         | text        | PDF in Supabase Storage (optional)   |
| is_current       | boolean     |                                      |
| created_by       | uuid (FK)   | → profiles.id                        |
| created_at       | timestamptz |                                      |

#### `notification_logs`
| Column           | Type        | Notes                                |
|------------------|-------------|--------------------------------------|
| id               | uuid (PK)   |                                      |
| booking_id       | uuid (FK)   | → bookings.id                        |
| type             | enum        | `email_blocked`, `sms_confirmed`, `email_confirmed`, `email_expired` |
| recipient        | text        | Email or phone number                |
| status           | enum        | `sent`, `failed`                     |
| provider_response| jsonb       | Raw response from email/SMS provider |
| created_at       | timestamptz |                                      |

#### `audit_logs`
| Column           | Type        | Notes                                |
|------------------|-------------|--------------------------------------|
| id               | uuid (PK)   |                                      |
| user_id          | uuid (FK)   | → profiles.id                        |
| action           | text        | e.g., `facility.create`, `booking.approve` |
| entity_type      | text        | e.g., `facility`, `booking`, `team`  |
| entity_id        | uuid        |                                      |
| metadata         | jsonb       | Additional context                   |
| created_at       | timestamptz |                                      |

### 10.3 Row Level Security (RLS) Policy Summary

| Table          | Policy                                                                      |
|----------------|-----------------------------------------------------------------------------|
| profiles       | Users can read/update their own profile. Admins can read all.               |
| teams          | Team members can read their own team. Admins can CRUD all.                  |
| team_members   | Members can read their own team's members. Admins can CRUD all.             |
| facilities     | All authenticated users can read active facilities. Admins can CRUD.        |
| bookings       | Team reps can read/create bookings for their team. Admins can read/update all. |
| payments       | Team reps can read payments for their bookings. Admins and finance can read all. |
| blockouts      | All authenticated users can read. Admins can CRUD.                          |
| guidelines     | All authenticated users can read current version. Admins can CRUD.          |
| audit_logs     | Sys admin only.                                                              |

---

## 11. Integration Points

### 11.1 Supabase Auth (Google + Apple Sign-In)

| Aspect          | Details                                                          |
|-----------------|------------------------------------------------------------------|
| Providers       | Google OAuth 2.0, Apple Sign-In                                  |
| Configuration   | Set up in Supabase Dashboard → Auth → Providers                  |
| Client SDK      | `@supabase/supabase-js` + `expo-auth-session` or `expo-apple-authentication` |
| Token handling  | Managed by Supabase client SDK (auto-refresh)                    |
| Post-login hook | Edge Function or database trigger to create `profiles` row       |

### 11.2 Stripe

| Aspect              | Details                                                      |
|---------------------|--------------------------------------------------------------|
| Checkout Sessions   | Created server-side via Edge Function using Stripe Node SDK  |
| Webhooks            | Edge Function endpoint; events: `checkout.session.completed`, `checkout.session.expired`, `charge.refunded` |
| Signature Verify    | Using `stripe.webhooks.constructEvent()` with webhook secret |
| Client-side         | Stripe publishable key only; redirect to Stripe Checkout URL |
| Currency            | MVR (Maldivian Rufiyaa)                                      |
| Refunds             | Initiated by admin via Edge Function → `stripe.refunds.create()` |

### 11.3 Email Service

| Aspect          | Details                                                          |
|-----------------|------------------------------------------------------------------|
| Provider        | Resend or SendGrid (TBD)                                         |
| Trigger         | Edge Function called on booking status changes                   |
| Templates       | Stored in database (`notification_templates` or similar)         |
| Events          | Slot blocked, booking confirmed, booking expired                 |

### 11.4 SMS Service

| Aspect          | Details                                                          |
|-----------------|------------------------------------------------------------------|
| Provider        | Twilio or equivalent (TBD)                                       |
| Trigger         | Edge Function called on booking confirmation                     |
| Content         | "Booking confirmed — [Facility] on [Date] at [Time]. Ref: [ID]" |
| Phone source    | `profiles.phone` field                                           |

---

## 12. Build & Deployment

### 12.1 Development Workflow

| Step | Action                                                              |
|------|---------------------------------------------------------------------|
| 1    | Develop using Expo CLI (`npx expo start`)                           |
| 2    | Test iteratively using **Expo Go** on physical devices              |
| 3    | Run `expo prebuild` to generate native projects when native modules are needed |
| 4    | Use **EAS Build** (`eas build`) for production-ready binaries       |
| 5    | Submit iOS build to **TestFlight** via `eas submit -p ios`          |
| 6    | Submit Android build to **Google Play Console** via `eas submit -p android` |

### 12.2 Environment Configuration

| Environment | Supabase Project | Stripe Mode | Notes                     |
|-------------|------------------|-------------|---------------------------|
| Development | Dev project      | Test mode   | Expo Go, local testing    |
| Staging     | Staging project  | Test mode   | TestFlight / Internal track |
| Production  | Production project | Live mode | App Store / Play Store     |

### 12.3 Key Config Files

| File               | Purpose                                               |
|--------------------|-------------------------------------------------------|
| `app.json`         | Expo app configuration (name, slug, version, scheme)  |
| `eas.json`         | EAS Build profiles (development, preview, production) |
| `.env`             | Environment variables (Supabase URL, Stripe key, etc.) |
| `app.config.js`    | Dynamic Expo config (reads from env vars)             |

---

## 13. Acceptance Criteria

### 13.1 Authentication

| # | Scenario                                                              | Expected Result                        |
|---|-----------------------------------------------------------------------|----------------------------------------|
| 1 | User signs in with Google                                             | Profile created, home screen shown     |
| 2 | User signs in with Apple                                              | Profile created, home screen shown     |
| 3 | User not linked to any team                                           | Restricted view with registration info |

### 13.2 Booking Flow

| # | Scenario                                                              | Expected Result                        |
|---|-----------------------------------------------------------------------|----------------------------------------|
| 4 | Team rep selects available slot and submits booking                    | Status = `blocked`, email sent         |
| 5 | Team rep tries to book an already-blocked slot                        | Error: slot unavailable                |
| 6 | Team rep completes Stripe payment                                     | Status = `confirmed`, SMS sent         |
| 7 | Payment deadline expires without payment                              | Status = `expired`, slot released      |
| 8 | Two teams attempt to book same slot simultaneously                    | Only one succeeds (DB constraint)      |

### 13.3 Admin

| # | Scenario                                                              | Expected Result                        |
|---|-----------------------------------------------------------------------|----------------------------------------|
| 9 | CSR Admin creates a new facility                                      | Facility appears in app catalog        |
| 10| CSR Admin creates a blockout for a facility                           | Affected slots show as unavailable     |
| 11| CSR Admin initiates a refund                                          | Stripe refund processed, status updated|

### 13.4 Notifications

| # | Scenario                                                              | Expected Result                        |
|---|-----------------------------------------------------------------------|----------------------------------------|
| 12| Booking blocked                                                       | Email received with payment link       |
| 13| Booking confirmed                                                     | SMS received with booking details      |
| 14| Booking expired                                                       | Email received with expiry notice      |

### 13.5 Security

| # | Scenario                                                              | Expected Result                        |
|---|-----------------------------------------------------------------------|----------------------------------------|
| 15| Team rep tries to access another team's bookings                      | Access denied (RLS)                    |
| 16| Spoofed Stripe webhook (invalid signature)                            | Rejected, no status change             |
| 17| Unauthenticated user calls Edge Function                              | 401 Unauthorized                       |

---

*End of Document*
