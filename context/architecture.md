# Architecture — Relay

## Full Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Frontend framework | Next.js 16 (App Router) | Routing, SSR/CSR, React 19 |
| UI library | React 19 | Component model |
| Styling | Tailwind CSS 4 | Utility classes |
| Animation | Motion (motion/react) | Page/component animations (all files now use motion/react) |
| Monorepo | Turborepo 2 | Task orchestration, caching |
| Package manager | Bun 1.3.5 | Workspace management, installs |
| Forms | react-hook-form 7 | Auth form validation |
| HTTP client | Axios | API calls with credentials |
| Backend framework | Express 5 | REST API server |
| Runtime | Node.js (tsx for dev, compiled JS for prod) | Server runtime |
| Database | MongoDB Atlas (Mongoose 9) | Primary data store |
| Auth | Passport.js + passport-google-oauth20 | OAuth strategy |
| Token auth | jsonwebtoken (HS256) | Access token signing |
| Password hashing | bcryptjs (12 rounds) | Local auth |
| Email | Nodemailer | Verification emails |
| Real-time (planned) | Socket.io | WebSocket messaging, presence |
| Language | TypeScript 5 (strict) | Both client and server |

## Folder Structure

```
relay/                                # Turborepo monorepo root
├── CLAUDE.md                         # Context loader
├── context/                          # Six-file context (this folder)
├── package.json                      # Root: bun workspaces, turbo devDep
├── turbo.json                        # Turbo pipeline (build, dev, lint, type-check)
├── bun.lock                          # Single lockfile for all workspaces
├── apps/
│   ├── client/                       # @relay/client — Next.js frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx        # Root layout, wraps AuthProvider
│   │   │   │   ├── page.tsx          # Landing page (/)
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx      # Auth page (/login) — login + register
│   │   │   │   └── homepage/
│   │   │   │       └── page.tsx      # Main chat app (/homepage)
│   │   │   ├── components/
│   │   │   │   ├── chat/
│   │   │   │   │   ├── ChatWindow.tsx     # Container: header + messages + input
│   │   │   │   │   ├── ChatHeader.tsx     # Avatar, status, action buttons
│   │   │   │   │   ├── MessageList.tsx    # Scrollable message history
│   │   │   │   │   ├── MessageBubble.tsx  # Individual message (own/theirs)
│   │   │   │   │   ├── ChatInput.tsx      # Textarea, emoji, attach, send/mic
│   │   │   │   │   └── BlankCanvas.tsx    # Empty state (no conversation selected)
│   │   │   │   ├── sidebar/
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── SidebarHeader.tsx
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   ├── ConversationList.tsx
│   │   │   │   │   └── ConversationItem.tsx
│   │   │   │   ├── landing/
│   │   │   │   │   ├── Navbar.tsx
│   │   │   │   │   ├── Hero.tsx
│   │   │   │   │   ├── Features.tsx
│   │   │   │   │   ├── Realtime.tsx
│   │   │   │   │   ├── ChatMockup.tsx
│   │   │   │   │   ├── HowItWorks.tsx
│   │   │   │   │   ├── CTA.tsx
│   │   │   │   │   └── Footer.tsx
│   │   │   │   └── shared/
│   │   │   │       ├── Avatar.tsx        # Initials avatar with status dot
│   │   │   │       └── StatusIcon.tsx    # Message tick icons (sent/delivered/read)
│   │   │   ├── hooks/
│   │   │   │   ├── useChat.ts           # Conversation state (currently mock data)
│   │   │   │   └── useScrollReveal.ts
│   │   │   ├── lib/
│   │   │   │   └── api.ts               # Axios instance + all auth API functions
│   │   │   ├── mock/
│   │   │   │   └── data.ts              # Mock data (to be deleted in Phase 9)
│   │   │   ├── providers/
│   │   │   │   └── AuthProvider.tsx
│   │   │   └── types/
│   │   │       └── index.ts             # Re-exports MessageStatus/UserStatus from @relay/shared + client-only types
│   │   ├── next.config.ts               # transpilePackages: ["@relay/shared"]
│   │   └── package.json                 # name: @relay/client
│   └── server/                          # @relay/server — Express API
│       ├── src/
│       │   ├── app.ts                   # Express app entry, routes mounted here
│       │   ├── config/
│       │   │   ├── db.ts
│       │   │   ├── env.ts
│       │   │   └── passport.ts
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts   # requireAuth
│       │   │   ├── error.middleware.ts  # Empty placeholder
│       │   │   └── validate.middleware.ts # Empty placeholder
│       │   ├── modules/
│       │   │   ├── auth/               # Fully implemented
│       │   │   ├── user/               # Models defined, routes/service empty
│       │   │   ├── conversation/       # Models defined, routes/service empty
│       │   │   └── message/            # Models defined, routes/service empty
│       │   ├── socket/                 # All files empty — Phase 4
│       │   └── utils/
│       │       ├── jwt.ts
│       │       ├── hashPassword.ts
│       │       ├── generateTokens.ts
│       │       └── sanitize.ts
│       └── package.json                # name: @relay/server
└── packages/
    └── shared/                         # @relay/shared — common types
        ├── src/
        │   └── index.ts                # MessageStatus, UserStatus, MessageType, socket event types + SOCKET_EVENTS const
        ├── package.json                # name: @relay/shared, main: ./src/index.ts
        └── tsconfig.json
```

## System Boundaries

| Folder | Owns |
|--------|------|
| `apps/client/src/app/` | All Next.js pages and routing |
| `apps/client/src/components/` | All React UI components |
| `apps/client/src/hooks/` | Client state and data fetching logic |
| `apps/client/src/lib/api.ts` | All HTTP calls to the server |
| `apps/client/src/providers/` | React context providers (auth, future: socket) |
| `apps/client/src/types/` | Shared TypeScript types for the client |
| `apps/client/src/mock/` | Temporary mock data — must be removed when real API is wired |
| `apps/server/src/config/` | DB connection, env vars, Passport config |
| `apps/server/src/middleware/` | Express middleware (auth, error, validation) |
| `apps/server/src/modules/` | Feature modules (each owns routes + controller + service + model) |
| `apps/server/src/socket/` | Socket.io event handlers and helpers |
| `apps/server/src/utils/` | Shared pure utilities |
| `packages/shared/src/` | Common types and socket event constants shared across apps |

## API Routes

### Auth — `/api/v1/auth` (mounted in app.ts, all implemented)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/signup` | None | Register with email/password, sends verification email |
| POST | `/login` | None | Email/password login, returns access token, sets refresh cookie |
| GET | `/verify-email?token=` | None | Verify email with token from email link |
| POST | `/refresh` | Cookie | Rotate refresh token, return new access token |
| POST | `/logout` | Cookie | Revoke refresh token, clear cookie |
| GET | `/session` | Cookie | Return `{ active, userId, expiresAt }` |
| GET | `/google` | None | Redirect to Google OAuth (sets state cookie) |
| GET | `/google/callback` | None | OAuth callback, creates/updates user, sets refresh cookie, redirects to `/homepage` (no token in URL) |

### Conversations — `/api/v1/conversations` (routes not yet wired in app.ts)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Bearer | List user's conversations sorted by lastMessageAt |
| POST | `/` | Bearer | Find or create a direct conversation with another user |
| GET | `/:id` | Bearer | Get single conversation with participants populated |
| PATCH | `/:id/read` | Bearer | Mark conversation as read (reset unreadCount) |
| PATCH | `/:id/mute` | Bearer | Toggle muted state |
| PATCH | `/:id/archive` | Bearer | Toggle archived state |

### Messages — `/api/v1/conversations/:id/messages` (routes not yet wired)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Bearer | Paginated message history (cursor: before date, limit 30) |
| POST | `/` | Bearer | Send a message, emits socket event to room |
| PATCH | `/:msgId` | Bearer | Edit message body |
| DELETE | `/:msgId` | Bearer | Soft delete message |

### Users — `/api/v1/users` (routes not yet wired)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/me` | Bearer | Get current user's profile |
| PATCH | `/me` | Bearer | Update displayName, about |
| GET | `/search?q=` | Bearer | Search users by name/email (text index) |
| GET | `/:id` | Bearer | Get public profile of another user |

## Storage Model

| Collection | Key Fields | Notes |
|------------|-----------|-------|
| `users` | email, displayName, authProvider, isOnline, lastSeen, socketId | socketId updated on socket connect/disconnect |
| `tokens` | user, type, tokenHash, expiresAt, isRevoked, familyId | SHA-256 hash stored; raw never persisted; TTL index auto-deletes expired |
| `conversations` | participants[], isGroup, lastMessage, lastMessageAt, participantMeta[] | participantMeta tracks unread/muted/archived per user |
| `messages` | conversation, sender, body, messageType, deliveryStatus, readBy[], reactions[] | post-save hook updates conversation.lastMessage and unreadCount |

## Real-Time Architecture

**Planned: Socket.io** (not yet implemented, no `socket.io` dependency in server/package.json yet)

Design intent from model fields and type definitions:
- Server creates HTTP server, attaches Socket.io
- On socket connect: authenticate via JWT (middleware), set `user.isOnline = true`, `user.socketId = socketId`
- Client joins rooms for each of their conversations on connect
- Message send: client emits `message:send` → server saves to DB → emits `message:new` to conversation room
- Typing: client emits `typing:start` / `typing:stop` with conversationId → server broadcasts to room (not persisted)
- Presence: on disconnect, set `user.isOnline = false`, `user.lastSeen = now`, broadcast to relevant conversation rooms
- Read: client emits `message:read` with messageId → server updates `readBy`, broadcasts `message:status` to sender

## Auth and Access Model

- **Access token**: JWT HS256, 15-minute TTL, carries `sub: userId`, sent as `Authorization: Bearer <token>`
- **Refresh token**: 128-byte random hex, SHA-256 hashed before storage, 7-day TTL, sent as httpOnly cookie on path `/api/v1/auth`, token rotation on every refresh
- **Replay detection**: If a revoked refresh token is used, the entire token family is revoked (all sessions for that login chain)
- **Google OAuth**: PKCE-equivalent via state cookie (`google_oauth_state`, httpOnly, 10-min TTL, path-scoped to callback)
- **requireAuth middleware**: Reads `Authorization` header, verifies JWT, attaches `req.userId`
- **Client token storage**: Access token in `localStorage` (if rememberMe) or `sessionStorage`; key: `relay_access_token`
- **AuthProvider**: On app mount, restores token to axios default headers, calls `/session` to check validity

## DB Schema (Key Fields)

### users
```
email: String (unique, indexed, lowercase)
displayName: String (2-50 chars)
password: String (select: false, bcrypt)
authProvider: 'local' | 'google' | 'github'
providerId: String | null
avatar: String | null (URL for Google users)
about: String (max 139)
isOnline: Boolean
lastSeen: Date | null
socketId: String | null (select: false)
isEmailVerified: Boolean
isDeactivated: Boolean
[indexes: email, (authProvider+providerId), text(displayName+email)]
```

### tokens
```
user: ObjectId → users
type: 'EMAIL_VERIFY' | 'REFRESH' | 'RESET_PASSWORD'
tokenHash: String (SHA-256, unique)
deviceInfo: { userAgent, ip, deviceLabel }
expiresAt: Date [TTL index]
isRevoked: Boolean
revokedAt: Date | null
familyId: String | null (REFRESH only)
[indexes: tokenHash, (familyId+isRevoked), expiresAt TTL]
```

### conversations
```
participants: ObjectId[] → users (min 2)
isGroup: Boolean
groupName: String | null
groupAvatar: String | null
groupAdmin: ObjectId | null
lastMessage: ObjectId → messages
lastMessageAt: Date | null [indexed]
participantMeta: [{ user, unreadCount, isArchived, isMuted, deletedAt }]
[indexes: (participants+lastMessageAt), (participants+isGroup)]
```

### messages
```
conversation: ObjectId → conversations [indexed]
sender: ObjectId → users [indexed]
body: String (max 4096)
messageType: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system'
attachments: [{ url, fileType, fileName, fileSize }]
replyTo: ObjectId → messages | null
deliveryStatus: 'sent' | 'delivered' | 'read'
readBy: [{ user, readAt }]
isDeleted: Boolean
isEdited: Boolean
reactions: [{ emoji, users: ObjectId[] }]
[indexes: (conversation+createdAt), (conversation+sender+deliveryStatus)]
[post-save hook: updates conversation.lastMessage, lastMessageAt, incrementUnreadForOthers]
```

## Invariants

1. Every API route that accesses user data must use `requireAuth` middleware
2. Refresh tokens are never stored raw — only SHA-256 hash is persisted
3. `user.password` is `select: false` — must be explicitly selected when comparing
4. Conversation participants array must have at least 2 entries (validated in schema)
5. Message soft-delete clears body and attachments — never hard-delete messages
6. `findOrCreateDirect` sorts participants by ObjectId string before query/create to ensure uniqueness
7. OAuth state cookie is path-scoped to callback URL only — never readable from other paths
8. Access token contains only `sub: userId` — no roles, no scopes baked in
9. Socket auth must use the same JWT verification as HTTP — no separate socket credentials
10. Client mock data in `src/mock/data.ts` must be entirely replaced before any phase is called "shipping"
