# UI Context — Relay

## Theme

**Dark mode only.** No light mode. Background is near-black (`#080B11` for pages, `#0D1117` for sidebar). All components assume dark backgrounds.

## Color Tokens

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| Page background | `#080B11` | Main pages (landing, login, homepage chat area) |
| Sidebar background | `#0D1117` | Left sidebar panel |
| Chat header / input bg | `rgba(13,17,23,0.95)` | Sticky header and input bar with blur |
| Foreground (text) | `#ffffff` | Primary text |
| Text muted | `rgba(255,255,255,0.38)` | Secondary/label text |
| Text very muted | `rgba(255,255,255,0.25)` | Timestamps, meta text |
| Text dim | `rgba(255,255,255,0.2)` | Placeholders, icons |
| Primary accent | `#22d3ee` (cyan-400) | Active state, focus rings, tabs, read ticks |
| Primary accent alt | `#06b6d4` (cyan-500) | Gradient start on buttons |
| Blue accent | `#2563eb` (blue-600) | Gradient end on buttons |
| Button gradient | `linear-gradient(135deg, #06b6d4, #2563eb)` | Primary action buttons, send button, unread badges |
| Own bubble bg | `linear-gradient(135deg, rgba(6,182,212,0.22), rgba(37,99,235,0.22))` | Sent message bubble |
| Own bubble border | `rgba(34,211,238,0.15)` | Sent message bubble border |
| Their bubble bg | `rgba(255,255,255,0.06)` | Received message bubble |
| Their bubble border | `rgba(255,255,255,0.07)` | Received message bubble border |
| Active conversation | `rgba(34,211,238,0.07)` + left border `#22d3ee` | Selected sidebar row |
| Online status | `#4ade80` (green-400) | Online presence dot |
| Away status | `#fbbf24` (amber-400) | Away presence dot |
| Offline status | `#6b7280` (gray-500) | Offline presence dot |
| Typing status | `#22d3ee` (cyan) | Typing indicator dot |
| Error text | `#f87171` (red-400) | Validation errors |
| Error border | `rgba(248,113,113,0.5)` | Error state input borders |
| Error banner bg | `rgba(248,113,113,0.08)` | Error banner background |
| Divider | `rgba(255,255,255,0.05)` | Section separators, borders |
| Surface (cards) | `rgba(255,255,255,0.025)` | Auth card, modal backgrounds |
| Surface hover | `rgba(255,255,255,0.04)` | Button hover, item hover |
| Focus ring | `0 0 0 3px rgba(34,211,238,0.08)` | Focus shadow on inputs |
| Input border (default) | `rgba(255,255,255,0.08)` | Default input border |
| Input border (focused) | `rgba(34,211,238,0.4)` or `rgba(34,211,238,0.25)` | Focused input border |
| Emoji picker bg | `#161B22` | Emoji picker panel |
| Backdrop | `backdropFilter: blur(12px)` or `blur(20px)` | Chat header, auth card |

## Typography

| Font | Variable | Usage |
|------|---------|-------|
| Geist Sans | `--font-geist-sans` | Default body font (loaded via next/font/google) |
| Geist Mono | `--font-geist-mono` | Code/mono contexts |
| DM Sans | Loaded inline via Google Fonts URL in login page and homepage | Auth page and homepage (`'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif`) |

Font weights used: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extra bold).

Letter spacing: headings use `letterSpacing: "-0.03em"` to `-0.04em` for tight display feel.

## Border Radius Scale

| Value | Usage |
|-------|-------|
| `4px` | Message bubble tail variant (sharper corner on consecutive messages) |
| `8px` | Small buttons, icon buttons |
| `9px` | Tab buttons, action icon buttons |
| `10px` | Inputs, search bar, tags, checkbox |
| `12px` | Emoji picker, textarea, send button |
| `16px` | Message bubbles (default corners) |
| `20px` | Auth card |
| `24px` | BlankCanvas logo mark |
| `50%` | Avatar circles, status dots, unread badges |

## Component Library

**No external component library.** All components are custom-built using inline styles (preferred for chat UI) with Tailwind utility classes used in the landing page components. No shadcn/ui, no Radix, no MUI.

## Animation Library

- **Motion (motion/react)**: Used in most components — `motion.div`, `AnimatePresence`, `cubicBezier`
- **Framer Motion (framer-motion)**: Used in some older components (`MessageBubble`, `ConversationList`, `Features`) — imported from `framer-motion` directly
- **Note**: Both `motion/react` and `framer-motion` are present (motion is the new package name). Standardize on `motion/react` for new code.

Standard easing: `cubicBezier(0.22, 1, 0.36, 1)` — fast deceleration (iOS-like feel).

Standard durations: `0.15s` (micro-interactions), `0.25–0.3s` (transitions), `0.45–0.55s` (reveals).

## Layout Patterns

### Landing Page (`/`)
- Full-width sections, dark background `#080B11`
- `max-w-7xl mx-auto px-6` content container
- Sections: `min-h-screen` hero, features grid, realtime demo, CTA, footer
- Background: radial glow blobs (`bg-cyan-500/5 blur-[120px]`) + subtle grid pattern (SVG, opacity 0.04)

### Login Page (`/login`)
- Full viewport `min-h-screen`, centered with flexbox
- Max width `440px` card
- Background: `#080B11` + two blur glow blobs + subtle grid SVG
- Auth card: `border-radius: 20px`, `border: 1px solid rgba(255,255,255,0.07)`, `backdrop-filter: blur(20px)`
- Mode toggle (Sign in / Register) above card
- Trust badges (SOC 2, E2E, Uptime) below card

### Homepage (`/homepage`)
- `display: flex; height: 100vh; overflow: hidden` — no scroll on outer container
- **Sidebar** (left, `320px` fixed, min `280px`, max `340px`):
  - Header: logo + tabs + user avatar
  - Search bar
  - Pinned section + All Messages section
- **Main area** (flex: 1, `overflow: hidden`):
  - `ChatWindow` or `BlankCanvas` fills remaining space
  - ChatWindow: `flex-column; height: 100vh` — header (fixed), message list (scrollable), input (fixed)

### Chat Window
- `ChatHeader`: `padding: 14px 20px`, `borderBottom`, `backdrop-filter: blur(12px)`
- `MessageList`: `flex: 1; overflow-y: auto; padding: 20px 24px; gap: 3px`
- `ChatInput`: `padding: 12px 20px 16px`, `borderTop`, fixed height

## Icon Library

**No icon library.** All icons are inline SVG. Pattern: `<svg width="N" height="N" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">` for outline icons. Heroicons Outline style (24px grid, 1.8 stroke weight).

## CSS Custom Scroll

Conversation list and message list use `className="relay-scroll"` — this class should be defined in `globals.css` to apply custom scrollbar styling. (Currently referenced in components but not yet defined in globals.css — this is a gap.)
