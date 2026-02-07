# Eventia

Eventia is a **campus participation intelligence platform** built for AlphaByte Hackathon (PS-4: The Unified Campus Events Fabric).

It treats campus events as **long-term participation records**, not one-time activities.

---

## 🚨 Problem

In most colleges today:

- Attendance is taken using forms or static QR codes (easy to fake)
- Participation data disappears after the event
- Certificates are PDFs that cannot be verified
- Colleges have no trusted record of student involvement over time

As a result, **participation lacks trust, traceability, and visibility**.

---

## 💡 Solution

Eventia introduces a **secure, end-to-end participation pipeline**:

- Role-based event management
- Time-bound attendance verification
- Permanent participation records
- Verifiable certificates

This is **not** just an event listing app.  
It is a **trust-based participation and credential system**.

---

## 🧩 Core Idea

> **Participation = Identity + Presence + Time**

- **Identity** → User is authenticated (JWT)
- **Presence** → User sees a live, rolling attendance code at the venue
- **Time** → Code expires every 30 seconds (TOTP)

Only when all three match, attendance is recorded.

---

## 🔐 How Attendance Works (High Level)

1. Admin creates an event  
2. Each event has a backend-only secret  
3. Admin or Volunteer starts attendance  
4. Backend generates a 6-digit TOTP code (valid for 30 seconds)  
5. Code is shown as a QR at the venue  
6. Student scans QR while logged in  
7. Backend validates:
   - user identity
   - event
   - time-bound code
8. Attendance is permanently stored  

No static QR codes. No manual sign-ins.

---

## 👥 User Roles

### Admin
- Create events
- Assign volunteers
- Start attendance
- Generate certificates

### Volunteer
- Start or monitor attendance
- Display live QR codes

### Student
- View events
- Mark attendance
- Receive certificates

---

## 🏗️ Codebase Overview

### Frontend
- React (Vite)
- Tailwind CSS
- shadcn/ui
- Role-based dashboards
- QR scanning for attendance

### Backend
- Node.js + Express
- JWT authentication
- MongoDB
- Modular architecture:
  - routes
  - controllers
  - models
  - middleware

Backend is the **single source of truth**.  
Frontend contains no security logic.

---

## 🎯 Hackathon Scope (Round 1)

This repository demonstrates **Phase 1**:

- Authentication + roles
- Event creation
- Secure attendance via TOTP
- Attendance storage
- Certificate generation
- Certificate verification

Advanced features (NFC, analytics, scaling) are **future scope**.

---

## 🛠️ Setup & Running Locally

Setup instructions are documented separately.

👉 **[Read SETUP.md](./SETUP.md)**

---

## 📌 One-Line Summary

> “Eventia creates a secure participation-to-verification pipeline that turns campus events into trusted, long-term participation records.”
