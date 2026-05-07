# AI Workflow Rules — Relay

## Development Approach

Build one coherent feature unit at a time. Each phase must be fully functional and testable before starting the next. Never leave a phase half-done. Never skip phases unless explicitly asked.

## Phase-by-Phase Build Plan

### Phase 1 — Auth Backend ✅
**Files:** `apps/server/src/modules/auth/`, `apps/server/src/config/passport.ts`, `apps/server/src/utils/jwt.ts`, `apps/server/src/middleware/auth.middleware.ts`
**Routes:** `POST /signup`, `POST /login`, `GET /verify-email`, `POST /refresh`, `POST /logout`, `GET /session`, `GET /google`, `GET /google/callback`
**Definition of done:** All auth routes respond correctly. Google OAuth redirects with access token. Refresh token rotation works. Email verification sends mail.

### Phase 2 — Landing Page & Login UI ✅
**Files:** `apps/client/src/app/page.tsx`, `apps/client/src/app/login/page.tsx`, `apps/client/src/components/landing/`, `apps/client/src/lib/api.ts`, `apps/client/src/providers/AuthProvider.tsx`
**Definition of done:** Landing page renders all sections. Login/register forms submit to real API. Google OAuth button redirects. Auth guard redirects unauthenticated users.

### Phase 3 — Homepage UI Shell (Mock Data) ✅
**Files:** `apps/client/src/app/homepage/page.tsx`, `apps/client/src/components/chat/`, `apps/client/src/components/sidebar/`, `apps/client/src/components/shared/`, `apps/client/src/hooks/useChat.ts`, `apps/client/src/mock/data.ts`, `apps/client/src/types/index.ts`
**Definition of done:** Homepage renders sidebar + chat window with mock data. Conversation selection works. Message send works locally. Status icons render. Search filters work.

### Phase 4 — Socket.io Setup + Auth
**Files:** `apps/server/package.json` (add `socket.io`), `apps/server/src/socket/index.ts`, `apps/client/package.json` (add `socket.io-client`), `apps/client/src/providers/SocketProvider.tsx` (new file), `apps/client/src/lib/socket.ts` (new file)
**What to build:**
- Install `socket.io` on server, `socket.io-client` on client
- `apps/server/src/socket/index.ts`: initialize Socket.io on the HTTP server, authenticate connections using JWT from `auth` handshake query or `Authorization` header, attach `userId` to socket
- Create HTTP server in `apps/server/src/app.ts` (currently using `app.listen` — change to `http.createServer(app)` then `io.attach(server)`)
- `apps/client/src/lib/socket.ts`: create `io()` instance with auth token
- `apps/client/src/providers/SocketProvider.tsx`: context provider that connects socket on mount (when access token present), exposes socket instance via context
- Wire `SocketProvider` into `apps/client/src/app/layout.tsx` (wraps inside `AuthProvider`)
**Definition of done:** Authenticated client connects to socket. Server logs connection with userId. Unauthenticated connections are rejected.

### Phase 5 — Presence System
**Files:** `apps/server/src/socket/presence.ts`, `apps/server/src/modules/user/user.service.ts`, `apps/client/src/hooks/usePresence.ts` (new)
**What to build:**
- `apps/server/src/socket/presence.ts`: on socket connect, set `user.isOnline = true`, `user.socketId = socket.id`; on disconnect, set `isOnline = false`, `lastSeen = now`, clear `socketId`; broadcast `presence:update` to all conversations the user is in
- `apps/client/src/hooks/usePresence.ts`: listen for `presence:update` events, update local user status state
- Update `apps/client/src/components/shared/Avatar.tsx` to accept live status from socket (may need to lift state or use context)
**Definition of done:** When a user connects, their status shows green to contacts. When they disconnect, it turns grey within 2 seconds.

### Phase 6 — Conversation API
**Files:** `apps/server/src/modules/conversation/conversation.service.ts`, `apps/server/src/modules/conversation/conversation.controller.ts`, `apps/server/src/modules/conversation/conversation.routes.ts`, `apps/server/src/app.ts` (mount conversation routes)
**Routes:** `GET /api/v1/conversations`, `POST /api/v1/conversations`, `GET /api/v1/conversations/:id`, `PATCH /api/v1/conversations/:id/read`, `PATCH /api/v1/conversations/:id/mute`
**What to build:**
- `conversation.service.ts`: `listConversations(userId)`, `findOrCreateDirect(userId, targetId)`, `getConversation(id, userId)`, `markRead(id, userId)`, `toggleMute(id, userId)`
- `conversation.controller.ts`: HTTP handlers, all behind `requireAuth`
- `conversation.routes.ts`: routes with `requireAuth` on all
- Mount at `app.use("/api/v1/conversations", requireAuth, conversationRoutes)` in `apps/server/src/app.ts`
**Definition of done:** GET /conversations returns user's conversations sorted by lastMessageAt. POST creates/finds a direct conversation. Mark-read resets unreadCount.

### Phase 7 — Message API
**Files:** `apps/server/src/modules/message/message.service.ts`, `apps/server/src/modules/message/message.controller.ts`, `apps/server/src/modules/message/message.routes.ts`, `apps/server/src/app.ts` (mount)
**Routes:** `GET /api/v1/conversations/:id/messages`, `POST /api/v1/conversations/:id/messages`, `PATCH /api/v1/conversations/:id/messages/:msgId`, `DELETE /api/v1/conversations/:id/messages/:msgId`
**What to build:**
- `message.service.ts`: `getMessages(conversationId, userId, cursor)`, `sendMessage(conversationId, senderId, body, replyTo?)`, `editMessage(msgId, userId, body)`, `deleteMessage(msgId, userId)`
- Message send emits `message:new` socket event to the conversation room
- Pagination: cursor-based using `createdAt < before`, limit 30, returns `{ messages, hasMore, nextCursor }`
- Guard: user must be a participant in the conversation (check `conversation.participants.includes(userId)`)
**Definition of done:** GET returns paginated history. POST saves and emits socket event. Soft delete clears body. Edit updates body with isEdited flag.

### Phase 8 — User API
**Files:** `apps/server/src/modules/user/user.service.ts`, `apps/server/src/modules/user/user.controller.ts`, `apps/server/src/modules/user/user.routes.ts`, `apps/server/src/app.ts` (mount)
**Routes:** `GET /api/v1/users/me`, `PATCH /api/v1/users/me`, `GET /api/v1/users/search?q=`, `GET /api/v1/users/:id`
**What to build:**
- `user.service.ts`: `getMe(userId)`, `updateMe(userId, { displayName, about })`, `searchUsers(query, excludeUserId)`, `getUserById(id)`
- All routes behind `requireAuth`
- Search uses `User.searchUsers()` static (text index on displayName + email)
**Definition of done:** GET /me returns current user. PATCH updates profile. Search returns up to 20 users matching query.

### Phase 9 — Wire Homepage to Real API (Replace Mock Data)
**Files:** `apps/client/src/hooks/useChat.ts`, `apps/client/src/hooks/useMessages.ts` (new), `apps/client/src/lib/conversations.ts` (new), `apps/client/src/lib/messages.ts` (new), `apps/client/src/mock/data.ts` (delete), `apps/client/src/app/homepage/page.tsx`
**What to build:**
- `apps/client/src/lib/conversations.ts`: `getConversations()`, `createDirectConversation(userId)`, `markRead(id)` API functions
- `apps/client/src/lib/messages.ts`: `getMessages(convId, cursor?)`, `sendMessage(convId, body, replyTo?)`, `editMessage(convId, msgId, body)`, `deleteMessage(convId, msgId)` API functions
- `apps/client/src/hooks/useMessages.ts`: manages message list for active conversation, initial load, optimistic send, socket event handlers
- Rewrite `useChat.ts` to call real APIs: fetch conversations on mount, select conversation loads messages
- Remove all imports of `CONVERSATIONS` from `apps/client/src/mock/data.ts`
- Delete `apps/client/src/mock/data.ts` when it has no remaining imports
**Definition of done:** Homepage shows real conversations from DB. Sending a message persists to DB. Recipient receives message in real time via socket. Mock data file is gone.

### Phase 10 — Real-Time Messaging Events
**Files:** `apps/server/src/socket/events.ts`, `apps/client/src/hooks/useMessages.ts`
**What to build:**
- `apps/server/src/socket/events.ts`: handle `message:send` event (alternative to REST for optimistic UI), `message:read` (mark messages read, broadcast `message:status` to sender), conversation room join (`conversation:join`)
- `apps/client/src/hooks/useMessages.ts`: listen for `message:new` events on active conversation, append to list; listen for `message:status` events, update delivery status
**Definition of done:** Messages appear on recipient's screen without page refresh. Read receipts update sender's ticks in real time.

### Phase 11 — Typing Indicators
**Files:** `apps/server/src/socket/typing.ts`, `apps/client/src/hooks/useTyping.ts` (new), `apps/client/src/components/chat/TypingIndicator.tsx` (new)
**What to build:**
- `apps/server/src/socket/typing.ts`: handle `typing:start` / `typing:stop` — broadcast to conversation room except sender
- `apps/client/src/hooks/useTyping.ts`: emit `typing:start` on keypress (debounced 2s), `typing:stop` on send or blur; listen for `typing:start` / `typing:stop` from others, maintain `typingUsers` state
- `apps/client/src/components/chat/TypingIndicator.tsx`: animated "..." indicator shown below last message when `typingUsers` is non-empty
- Wire into `apps/client/src/components/chat/MessageList.tsx` and `apps/client/src/components/chat/ChatInput.tsx`
**Definition of done:** When user A types, user B sees "Alex is typing..." within 500ms. Indicator disappears within 2s of stopping.

### Phase 12 — Error Middleware + Validation
**Files:** `apps/server/src/middleware/error.middleware.ts`, `apps/server/src/middleware/validate.middleware.ts`, `apps/server/src/app.ts`
**What to build:**
- `error.middleware.ts`: global Express error handler — convert `Error` to `{ message }` JSON with appropriate status code; handle mongoose `ValidationError`, duplicate key `11000`
- `validate.middleware.ts`: generic schema validator (can use zod or manual) for request bodies
- Mount error handler at the end of `apps/server/src/app.ts` (`app.use(errorHandler)`)
**Definition of done:** All error responses return `{ message: string }` with correct HTTP status. Validation errors return 400. Uncaught errors return 500 without stack trace leaking to client.

## Scoping Rules

- Implement exactly what the current phase requires — no more, no less
- If a phase requires a new file, create only that file (do not proactively create Phase 5 files while doing Phase 4)
- Test each phase before marking complete: manually verify the happy path and at least one error case
- Do not implement UI features that don't have backend support yet (exception: mock data phases)

## When to Split Work

Split into a separate message if:
- A single phase touches more than 4 files
- The work requires schema migration (model change) before code change
- Backend and frontend halves of a phase can be verified independently

## Handling Missing Requirements

If a requirement is ambiguous:
1. Choose the simpler interpretation
2. Note the decision in `context/progress-tracker.md` under "Architecture Decisions"
3. Continue — do not stop to ask unless the ambiguity would cause wasted work

## Protected Files

Do not modify these without explicit instruction:
- `apps/server/src/modules/auth/token.model.ts` — security-critical, fully implemented
- `apps/server/src/modules/auth/auth.service.ts` — fully implemented
- `apps/server/src/config/passport.ts` — fully implemented
- `apps/client/src/lib/api.ts` — auth API layer, fully implemented

## Keeping Docs in Sync

After completing any phase:
1. Update `context/progress-tracker.md` — mark phase complete, update "Current Phase"
2. If new routes were added, add them to the routes table in `context/architecture.md`
3. If new UI patterns were introduced, add them to `context/ui-context.md`

## Definition of Done (Per Phase)

A phase is complete when:
- All files listed in the phase exist and have real implementation (not placeholders)
- The feature works end-to-end (server + client if applicable)
- No TypeScript errors in affected files
- The happy path is verified manually
- `context/progress-tracker.md` is updated
