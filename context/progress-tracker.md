# Progress Tracker — Relay

## Current Phase

**All Phases Complete**

## Phase Status

| Phase | Status | Summary |
|-------|--------|---------|
| 1 — Auth Backend | ✅ Complete | All auth routes implemented, email verify, Google OAuth, token rotation, replay detection |
| 2 — Landing Page & Login UI | ✅ Complete | Landing with all sections, login/register forms, Google OAuth button, AuthProvider |
| 3 — Homepage UI Shell (Mock Data) | ✅ Complete | Sidebar + ChatWindow + BlankCanvas fully built, useChat hook with mock data |
| 4 — Socket.io Setup + Auth | ✅ Complete | Socket.io server with JWT auth, presence on connect/disconnect, SocketProvider on client |
| 5 — Presence System | ✅ Complete | usePresence hook subscribes to presence:update, socket typing events wired |
| 6 — Conversation API | ✅ Complete | list, findOrCreate, getOne, markRead, mute, archive — all routes live |
| 7 — Message API | ✅ Complete | paginated fetch, send (HTTP+socket emit), edit, soft-delete — all routes live |
| 8 — User API | ✅ Complete | getMe, updateMe, searchUsers, getById — all routes live |
| 9 — Wire Homepage to Real API | ✅ Complete | useChat rewritten with real API; getConversations, getMessages, sendMessageHttp wired; mock data removed from homepage |
| 10 — Real-Time Messaging Events | ✅ Complete | message:new socket listener deduplicates and appends; message:status updates delivery status |
| 11 — Typing Indicators | ✅ Complete | useTyping hook emits/listens typing:start/stop with 3s debounce; ChatWindow shows typing indicator |
| 12 — Error Middleware + Validation | ✅ Complete | errorMiddleware mounted in app.ts; validate middleware implemented |

## Completed Phases

### Phase 1 — Auth Backend ✅
- `POST /api/v1/auth/signup` — email/password signup, sends verification email via nodemailer
- `POST /api/v1/auth/login` — bcrypt compare, issues JWT access token (15m) + refresh cookie (7 days)
- `GET /api/v1/auth/verify-email?token=` — verifies email, marks user verified
- `POST /api/v1/auth/refresh` — rotates refresh token, returns new access token
- `POST /api/v1/auth/logout` — revokes refresh token, clears cookie
- `GET /api/v1/auth/session` — returns `{ active, userId, expiresAt }` from refresh cookie
- `GET /api/v1/auth/google` — initiates Google OAuth with state CSRF cookie
- `GET /api/v1/auth/google/callback` — completes OAuth, creates/updates user, redirects to `/homepage#accessToken=...`
- Token model fully implemented (SHA-256 hashing, TTL index, family revocation, device info)
- `requireAuth` middleware: verifies Bearer JWT, attaches `req.userId`
- Rate limit: 6 req/min on signup and login

### Phase 2 — Landing Page & Login UI ✅
- Landing page (`/`) with Navbar, Hero, Features, Realtime, CTA, Footer components
- Login page (`/login`) with sign in + register toggle, react-hook-form validation, Google OAuth button
- Access token stored in localStorage (rememberMe) or sessionStorage (session only)
- `AuthProvider` restores token to axios headers on mount, redirects to `/login` if session invalid
- OAuth callback: reads `accessToken` from URL fragment hash, stores it, redirects to `/homepage`
- Full error handling: `AuthApiError` class, network/validation/server error codes

### Phase 3 — Homepage UI Shell (Mock Data) ✅
- `Sidebar`: SidebarHeader (logo, tabs: chats/calls/contacts, user avatar) + SearchBar + ConversationList
- `ConversationList`: pinned section + all messages section, staggered entry animation
- `ConversationItem`: avatar, name, last message preview, unread badge, muted/pinned icons, active state
- `ChatWindow`: ChatHeader + MessageList + ChatInput
- `ChatHeader`: participant avatar + status + region, voice/video/search/more action buttons (UI only)
- `MessageList`: E2E encrypted banner, date divider, auto-scroll to bottom on new message
- `MessageBubble`: own (cyan gradient) vs theirs (white/6%), tail on consecutive, timestamp + status icon
- `ChatInput`: textarea (Enter to send, Shift+Enter newline), emoji picker (8 emojis), attach file/image buttons (UI only), send/mic toggle
- `BlankCanvas`: empty state with logo mark, "New message" + "Find contacts" buttons (UI only), stats row
- `useChat` hook: conversation selection, message send (local state), search filter, sidebar tab state
- Mock data: 6 conversations with realistic content across global tech team users
- `StatusIcon`: sent (single grey tick), delivered (double grey), read (double cyan)
- `Avatar`: initials with per-user gradient, status dot (green/amber/grey)

## In Progress

None. All phases 1–12 complete.

## What's Done vs What's Missing in Completed Phases

### Auth Backend — Gaps
- `apps/server/src/middleware/error.middleware.ts` is **empty** — no global error handler mounted. Errors propagate but Express default handler leaks stack traces
- `apps/server/src/middleware/validate.middleware.ts` is **empty** — no request validation middleware
- `apps/server/src/modules/auth/auth.types.ts` is **empty** — types are inline in service/controller instead
- `apps/server/src/utils/sanitize.ts` is **empty**
- Password reset flow: model fields (`passwordResetToken`, `passwordResetExpiresAt`) exist but no route/service/email flow

### Homepage UI — Gaps
- `relay-scroll` CSS class referenced in `ConversationList` and `MessageList` but not defined in `globals.css`
- All `framer-motion` imports fixed to `motion/react` across all files ✅
- All chat features are wired to `apps/client/src/mock/data.ts` — will be replaced in Phase 9

## Next Up

1. **Phase 4 — Socket.io Setup + Auth** (current)
   - Add `socket.io` to `apps/server/package.json`
   - Add `socket.io-client` to `apps/client/package.json`
   - `apps/server/src/socket/index.ts`: init Socket.io with JWT auth middleware
   - `apps/server/src/app.ts`: switch from `app.listen()` to `http.createServer` + `io.attach`
   - `apps/client/src/lib/socket.ts`: socket singleton
   - `apps/client/src/providers/SocketProvider.tsx`: context provider
   - Mount `SocketProvider` in `apps/client/src/app/layout.tsx`

2. **Phase 5 — Presence System**
   - `apps/server/src/socket/presence.ts`
   - `apps/client/src/hooks/usePresence.ts`

3. **Phase 6 — Conversation API**
   - Full CRUD for conversations
   - Mount routes in `apps/server/src/app.ts`

## Open Questions

1. **SMTP for email verification**: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` are empty in `.env`. Email sending will silently fail (errors caught, not thrown). Decide: use a transactional email service (Resend, SendGrid) or configure SMTP before shipping.
2. **Socket.io transport**: Should the client use websocket only or allow polling fallback? (Polling adds complexity to auth; websocket-only is simpler and fine for the target users.)
3. **Message pagination strategy**: The model supports cursor-based (before-date). Confirm: no offset pagination. Initial load = last 30 messages. Scroll-up loads more.
4. **Conversation pinning**: The `Conversation` model has no `isPinned` field per-user. The current frontend mock shows `pinned: boolean` on conversations. Decision needed: add to `participantMeta` on the conversation model, or track in a separate user preferences document.
5. **`relay-scroll` class**: needs to be defined in `globals.css` with custom scrollbar styling. Currently referenced but not defined — causes silent no-op in browsers.
6. **`framer-motion` vs `motion/react`**: All files now use `motion/react` — fixed during Turborepo migration. ✅
7. **Google OAuth in production**: `passport.ts` throws if `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` are missing. This is fine for dev but will crash the server in environments without Google creds. Decide: make Google OAuth optional or always require credentials.

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| JWT access tokens (15m) + rotating refresh cookies (7d) | Standard secure dual-token pattern. Access token short-lived reduces window of misuse. Refresh in httpOnly cookie prevents XSS theft. |
| SHA-256 hash of refresh tokens stored (raw never persisted) | If DB is compromised, raw tokens cannot be used |
| Token family revocation on replay | Defense against refresh token theft — entire login chain is invalidated if a revoked token is reused |
| MongoDB Atlas for primary storage | Already provisioned and connected. Connection string in `.env` |
| Inline styles for chat UI, Tailwind for landing | Chat components were built first with inline styles; landing was built later with Tailwind. Mixing is intentional per file, not per component |
| Mock data in `apps/client/src/mock/` folder (not in component files) | Keeps components clean; easy to find and delete in Phase 9 |
| `useChat` hook as the single source of truth for conversation state | All conversation state (selected, messages, search) flows through one hook — easy to swap mock data source for real API |
| Google OAuth redirects to `/homepage#accessToken=...` | SPAs cannot read server-set cookies cross-origin; fragment approach avoids CORS issues with token delivery |
| `requireAuth` reads `Authorization: Bearer` header only | Stateless, no server-side session. Socket auth will use same JWT via handshake query param |

## Session Notes

To pick up development immediately:

1. Both apps: `bun dev` from repo root (Turborepo runs client + server in parallel)
2. Server only: `bun dev --filter=@relay/server` (tsx watch, port 5000)
3. Client only: `bun dev --filter=@relay/client` (Next.js, port 3000)
4. MongoDB Atlas is connected (URI in `apps/server/.env`) — no local MongoDB needed
5. Google OAuth credentials are in `apps/server/.env` and are real values (dev credentials)
6. SMTP is not configured — email verification silently fails; manually mark `isEmailVerified: true` in MongoDB Compass if testing login
7. The homepage shows mock data — no real conversations exist in the DB yet
8. All socket files (`apps/server/src/socket/*.ts`) are empty 1-line files — Phase 4 fills these in
9. All conversation/message/user routes/controllers/services are empty — Phases 6–8 fill these in
10. Repo is now a Turborepo monorepo: `apps/client` (@relay/client), `apps/server` (@relay/server), `packages/shared` (@relay/shared)
