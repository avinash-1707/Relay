# Project Overview — Relay

## What It Is

Relay is a real-time messaging web application for distributed tech teams. It provides instant one-on-one chat with end-to-end encryption, global low-latency delivery (sub-200ms), and presence awareness. The product is positioned as a security-first communication tool — SOC 2 Type II compliant, E2E encrypted, with 99.99% uptime — targeting engineering teams that operate across timezones and regions.

## Goals

1. Deliver messages globally in under 200ms via real-time WebSocket infrastructure
2. Provide a complete, production-grade auth system (email/password + Google OAuth, email verification, token rotation)
3. Support conversation features: send/receive messages, read receipts, typing indicators, presence status
4. Render a polished dark-mode UI that communicates trust and speed to technical users
5. Ship the core 1:1 messaging loop fully connected to the real backend (replace all mock data)

## Core User Flow (End to End)

1. User visits `/` (landing page) — sees marketing copy, features, CTA
2. User clicks "Get started" → `/login`
3. User registers (email + password) or signs in with Google OAuth
4. Email registration → server sends verification email → user clicks link → email verified
5. After successful login → redirected to `/homepage`
6. Homepage loads: sidebar shows conversation list; user selects a conversation
7. Chat window opens: user reads messages, types, sends
8. Messages delivered in real time to recipient via Socket.io
9. Presence updates (online/away/offline) and typing indicators shown live
10. User can search conversations, view pinned conversations, check unread counts

## Features by Category

### Auth
- Email + password signup with email verification (nodemailer/SMTP)
- Email + password login
- Google OAuth 2.0 (full flow with state CSRF protection)
- JWT access tokens (15 min) + rotating httpOnly refresh cookies (7 days)
- Token family revocation on replay detection
- Session status check endpoint
- Logout (revokes refresh token, clears cookie)

### Messaging
- Send and receive text messages in real time (Socket.io)
- Message delivery status: sent → delivered → read (double-tick UI)
- Message history loaded from DB on conversation open
- Paginated message loading (cursor-based, before-date)
- Reply to message (replyTo field in model)
- Soft delete messages (body cleared, isDeleted flag)
- Edit messages (isEdited flag, editedAt timestamp)

### Conversations
- 1:1 direct conversations (findOrCreateDirect)
- Pinned conversations (UI exists, needs API)
- Muted conversations (UI exists, needs API)
- Unread count per participant (tracked in participantMeta)
- Search conversations by participant name (client-side, upgrade to API)
- Last message preview in sidebar

### Presence
- Online / Away / Offline status per user (stored on User model: isOnline, lastSeen)
- Status dot in Avatar component (green/yellow/grey)
- Socket-driven presence updates on connect/disconnect

### Typing Indicators
- Show "typing..." when other user is typing
- Debounced emit from client, cleared on send or timeout

### User / Profile
- Display name, avatar (URL or initials), about status (139 char max)
- User search (text index on displayName + email, searchUsers static)

### Landing & Marketing
- Hero section with animated headline
- Features grid (sub-200ms, E2E encryption, 99.99% uptime, global reach)
- Real-time demo mockup
- CTA section
- Footer

## Scope

### In Scope
- 1:1 messaging with real-time Socket.io delivery
- Full auth (email/password + Google OAuth + email verification)
- Conversation list with unread counts, pinned, muted states
- Message history with pagination
- Presence (online/away/offline) via socket
- Typing indicators via socket
- Read receipts (readBy array, deliveryStatus field)
- User search (find someone to start a conversation)
- Profile: displayName, avatar, about
- Message reactions (model supports it; UI is next after core messaging)
- Message reply (replyTo field in model; UI is next after core)
- Group chats (model supports it; UI not started — post-MVP)

### Out of Scope
- Voice calling (ChatHeader has buttons but these are aspirational UI; not planned for MVP)
- Video calling (same — UI buttons are decorative)
- File/image upload (ChatInput has attach buttons but no backend; deferred)
- Push notifications (mobile/desktop OS-level)
- Mobile native app
- Password reset flow (model fields exist but no route/email flow built)
- Admin dashboard
- Billing / subscription tiers

## Success Criteria

- User can register, verify email, and log in without error
- Google OAuth flow completes and redirects to homepage
- Logged-in user sees their real conversations from DB (no mock data on homepage)
- Sending a message in the UI delivers it to the recipient's client in real time via Socket.io
- Online/offline status reflects actual socket connection state
- Typing indicator appears within 500ms of the other user typing
- Conversation unread count decrements when user opens conversation
- All routes behind `requireAuth` reject unauthenticated requests with 401
