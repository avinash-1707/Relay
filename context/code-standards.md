# Code Standards — Relay

## General Principles

- TypeScript everywhere — no `any` except at explicit coercion boundaries (e.g., `req.user as any` after Passport populates it)
- Prefer `async/await` over `.then()` chains
- No unused imports, no dead code
- No comments unless the WHY is non-obvious
- Small, single-responsibility files — one component per file, one model per file
- `export default` for components and models; named exports for utilities and services

## TypeScript Rules

- Strict mode enabled on both client and server (`"strict": true`)
- Prefer `interface` over `type` for object shapes; `type` for unions/aliases
- Model interfaces defined at top of model file (`IUser`, `IMessage`, etc.)
- Public profile shapes as separate interfaces (`IUserPublicProfile`)
- API response types defined in `apps/client/src/lib/api.ts` alongside the function that uses them
- Client-side types in `apps/client/src/types/index.ts` — keep them separate from server Mongoose interfaces
- Avoid `!` non-null assertions; use proper narrowing or early returns

## Async Patterns

### Server
- Controllers catch errors with `try/catch` and call `next(err)` — never send error responses directly from controller
- Services throw plain `Error` objects with readable messages — controllers/middleware handle HTTP status codes
- Mongoose operations are all `await`-ed
- No raw `.exec()` on queries unless explicitly building a lazy query chain

### Client
- `useCallback` for event handlers passed as props (prevents unnecessary child re-renders)
- `useState` with functional updater `setState(prev => ...)` when new state depends on previous
- API calls in forms: inside `handleSubmit` handlers, wrapped in `try/catch`, errors set via `onError` prop or local state
- No `useEffect` for data fetching that can be done on user action

## Framework Conventions

### Next.js
- App Router only — no Pages Router
- `"use client"` at top of any component that uses hooks, event handlers, or browser APIs
- `layout.tsx` wraps global providers (`AuthProvider`)
- Route protection: `AuthProvider` handles global redirect; individual pages check session if needed
- `NEXT_PUBLIC_` prefix for any env var used in client code
- `process.env.NEXT_PUBLIC_API_URL` — the single point for the API base URL

### React
- Functional components only
- Props interfaces defined inline above the component in the same file
- Component files named in PascalCase matching the export name
- Conditional rendering with ternary for simple cases; early return for complex guards
- No class components

### Express
- Module structure: `routes → controller → service → model`
- Routes file: only routing logic + rate limiting + middleware chains; no business logic
- Controller: request parsing + response shaping + calls service; wraps in `try/catch → next(err)`
- Service: all business logic; throws `Error` with descriptive messages; no `req`/`res` references except when passing through for cookie operations
- Rate limiting on auth routes: 6 requests per minute per IP

## Styling Rules

- Landing page: Tailwind CSS 4 utility classes
- Chat/app UI: inline styles (`style={{ }}`) — this is the established pattern for all chat components
- No mixing in a single component (pick one approach per component)
- Colors are raw hex/rgba values matching the token table in `ui-context.md` — no Tailwind in chat components
- `motion` components from `motion/react` for new animations — not `framer-motion` directly
- Background blur: `backdropFilter: "blur(12px)"` on sticky headers and input bars
- Transitions: `transition: "all 0.2s"` for micro-interactions on buttons/inputs

## API Design Conventions

### Response Shapes

Success:
```json
{ "accessToken": "..." }        // login, refresh
{ "message": "..." }            // signup, verify-email, logout
{ "active": true, "userId": "...", "expiresAt": "..." } // session
```

Conversation list:
```json
[{ "_id": "...", "participants": [...], "lastMessage": {...}, "lastMessageAt": "...", "participantMeta": [...] }]
```

Message page:
```json
{ "messages": [...], "hasMore": boolean, "nextCursor": "ISO date string | null" }
```

Error:
```json
{ "message": "Human-readable error string" }
```

HTTP status codes: `200` success, `201` created, `204` no content, `400` bad input, `401` unauthorized, `403` forbidden, `404` not found, `409` conflict (email exists), `500` server error.

### Auth Enforcement

Every route that returns user-specific data must use `requireAuth` middleware:
```ts
router.get("/", requireAuth, controller.list);
```

### Validation

Validate request body in service layer (throw `Error` with message if invalid). Once `validate.middleware.ts` is implemented, use it in routes for schema validation before controller.

## Data and Storage Rules

- Never store raw tokens — hash with SHA-256 before persistence
- `user.password` field is `select: false` — must use `.select("+password")` when comparing
- Soft-delete messages by setting `isDeleted: true`, clearing `body` and `attachments` — never hard-delete
- Conversation `participantMeta` is always updated via `incrementUnreadForOthers()` / `markAsRead()` instance methods — never mutate directly in service
- `findOrCreateDirect` always sorts participants by ObjectId string to ensure the compound unique query works correctly

## File Organization Rules

- One model = one file in `apps/server/src/modules/<domain>/`
- One route domain = one router file; mount at `apps/server/src/app.ts`
- Client components: group by domain folder (`chat/`, `sidebar/`, `landing/`, `shared/`)
- Shared utilities go in `apps/server/src/utils/` (pure functions, no Express imports)
- Types shared across apps go in `packages/shared/src/index.ts`; client-only types in `apps/client/src/types/index.ts`
- API functions for a domain go together in `apps/client/src/lib/api.ts` (or split into `apps/client/src/lib/conversations.ts`, `apps/client/src/lib/messages.ts` when the file grows too large)
- Hooks: one hook per file, named with `use` prefix

## Commit Convention

Conventional Commits format. Subject ≤50 chars. Body only when "why" isn't obvious from the diff.
