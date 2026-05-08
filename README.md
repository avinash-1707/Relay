# Relay

Real-time messaging for distributed tech teams. Sub-200ms global delivery, end-to-end encrypted, built for engineers who operate across timezones.

![Dark mode only · Retro-futuristic UI · Amber accent](https://img.shields.io/badge/theme-dark%20mode%20only-060912?style=flat&labelColor=0D1221&color=F5A623)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js)
![Socket.io](https://img.shields.io/badge/Socket.io-realtime-010101?style=flat&logo=socket.io)

---

## What It Is

Relay is a 1:1 chat application with real-time WebSocket delivery, full JWT-based auth (email/password + Google OAuth), presence awareness, and typing indicators. The UI is dark-only with a retro-futuristic arcade aesthetic — amber accents, CRT overlays, animated starfields.

## Features

### Auth
- Email + password signup with email verification
- Google OAuth 2.0 (CSRF-protected via state cookie)
- JWT access tokens (15 min) + rotating httpOnly refresh cookies (7 days)
- Token family revocation on replay detection

### Messaging
- Send/receive messages in real time via Socket.io
- Message delivery status: sent → delivered → read (double-tick UI)
- Paginated message history (cursor-based, 30 messages per page)
- Edit and soft-delete messages
- Reply to message (model supported)

### Conversations
- 1:1 direct conversations
- Unread count per participant
- Mute and archive per user
- Last message preview in sidebar

### Presence & Typing
- Online / Away / Offline status driven by socket connect/disconnect
- Typing indicators with 3s debounce

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS 4 + inline styles |
| Animation | `motion/react` |
| Backend | Express 5, Node.js |
| Database | MongoDB Atlas (Mongoose 9) |
| Real-time | Socket.io |
| Auth | Passport.js, jsonwebtoken, bcryptjs |
| Email | Nodemailer |
| Language | TypeScript 5 (strict) |
| Monorepo | Turborepo 2 |
| Package manager | Bun 1.3.5 |

---

## Project Structure

```
relay/                        # Turborepo monorepo root
├── apps/
│   ├── client/               # @relay/client — Next.js frontend (port 3000)
│   └── server/               # @relay/server — Express API (port 5000)
└── packages/
    └── shared/               # @relay/shared — common types + socket event constants
```

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, features, real-time demo mockup |
| `/login` | Sign in / register (email or Google OAuth) |
| `/homepage` | Main chat app — sidebar + conversation window |

### Key API Endpoints

```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
GET    /api/v1/auth/google
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/session

GET    /api/v1/conversations
POST   /api/v1/conversations
GET    /api/v1/conversations/:id
PATCH  /api/v1/conversations/:id/read

GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
PATCH  /api/v1/conversations/:id/messages/:msgId
DELETE /api/v1/conversations/:id/messages/:msgId

GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/search?q=
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.3.5+
- MongoDB Atlas cluster (connection string required)

### Environment Variables

**`apps/server/.env`**
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:3000

# Google OAuth (optional — server crashes on startup if missing)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# SMTP (optional — email verification silently fails if not set)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
```

### Install & Run

```bash
# Install all workspaces
bun install

# Run both client + server in parallel (recommended)
bun dev

# Run individually
bun dev --filter=@relay/server   # Express API on :5000
bun dev --filter=@relay/client   # Next.js on :3000
```

### Notes

- MongoDB Atlas must be reachable — no local MongoDB required, connection string in `.env`
- Email verification will silently fail without SMTP config. For local testing, manually set `isEmailVerified: true` in MongoDB Compass
- Google OAuth uses real dev credentials if configured in `.env`

---

## Auth Flow

1. Register with email → verification email sent → click link → email verified
2. Login → JWT access token (15 min) returned, httpOnly refresh cookie set (7 days)
3. On page load, `AuthProvider` restores token from storage, calls `/session` to validate
4. Access token stored in `localStorage` (rememberMe on) or `sessionStorage`
5. Token rotation: every `/refresh` call issues a new refresh token; replay detection revokes the entire family

**Google OAuth**: redirects to `/homepage#accessToken=...` — `AuthProvider` reads the fragment, stores token, clears hash from URL.

---

## Real-Time Architecture

Socket.io over WebSocket (no polling fallback). All socket auth uses the same JWT as HTTP.

```
client connect   → authenticate JWT → user.isOnline = true, user.socketId saved
message:send     → save to DB → emit message:new to conversation room
typing:start/stop → broadcast to room (not persisted)
disconnect       → user.isOnline = false, user.lastSeen = now, broadcast presence:update
message:read     → update readBy, broadcast message:status to sender
```

---

## Design System

Dark mode only. Background: `#060912`. Primary accent: amber `#F5A623`.

Every major surface uses three ambient layers:
1. Amber SVG grid (`opacity: 0.022–0.04`)
2. CRT scanline overlay
3. Radial glow blobs (amber + violet, animated)

No external UI component library — all components custom-built with inline styles. No shadcn, no Radix, no MUI.

**Bans**: no gradient text, no side-stripe borders, no glassmorphism as decoration, no identical card grids.

---

## Development Status

All 12 phases complete:

| Phase | Description |
|-------|-------------|
| 1 | Auth backend (signup, login, OAuth, token rotation) |
| 2 | Landing page + login UI |
| 3 | Homepage shell (sidebar, chat window, conversation list) |
| 4 | Socket.io setup + JWT auth |
| 5 | Presence system (online/away/offline) |
| 6 | Conversation API (list, create, read, mute, archive) |
| 7 | Message API (paginated fetch, send, edit, soft-delete) |
| 8 | User API (profile, search) |
| 9 | Homepage wired to real API (mock data removed) |
| 10 | Real-time message events (message:new, message:status) |
| 11 | Typing indicators |
| 12 | Error middleware + request validation |

### Known Gaps

- SMTP not configured — email verification requires manual DB workaround in dev
- Password reset: model fields exist, no route or email flow built
- Group chat: data model supports it, UI not started
- Voice/video calling: UI buttons exist as placeholders only

---

## License

MIT
