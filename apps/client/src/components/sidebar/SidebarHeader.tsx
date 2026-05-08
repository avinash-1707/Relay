"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Avatar from "../shared/Avatar";
import { ThemeToggle } from "../landing/ThemeToggle";
import type { AppState, User } from "../../types";
import { JSX } from "react/jsx-dev-runtime";

interface Props {
  tab: AppState["sidebarTab"];
  onTabChange: (t: AppState["sidebarTab"]) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const TABS: { id: AppState["sidebarTab"]; label: string; icon: JSX.Element }[] = [
  {
    id: "chats",
    label: "COMMS",
    icon: (
      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    id: "calls",
    label: "CALLS",
    icon: (
      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    id: "contacts",
    label: "NODES",
    icon: (
      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
];

export default function SidebarHeader({ tab, onTabChange, currentUser, onLogout }: Props) {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef   = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleOutside(e: MouseEvent) {
      if (
        menuRef.current   && !menuRef.current.contains(e.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(e.target as Node)
      ) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  return (
    <>
      <div style={{ borderBottom: "1px solid rgba(245,166,35,0.07)" }}>
        {/* ── Top bar ────────────────────────────────────────────────── */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "18px 18px 14px",
          }}
        >
          {/* Arcade logo mark */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width:          34,
                height:         34,
                borderRadius:   11,
                background:     "linear-gradient(145deg,#F5A623,#D97706)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                boxShadow:      "0 0 18px rgba(245,166,35,0.38), 0 0 4px rgba(245,166,35,0.7)",
                animation:      "amber-flicker 9s ease-in-out infinite",
                flexShrink:     0,
              }}
            >
              {/* Hexagon icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1L14.5 4.75V11.25L8 15L1.5 11.25V4.75L8 1Z"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="1.2"
                  fill="rgba(255,255,255,0.18)"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 4.5L11.5 6.5V10L8 12L4.5 10V6.5L8 4.5Z"
                  fill="rgba(255,255,255,0.65)"
                />
              </svg>
            </div>

            <div>
              <div
                style={{
                  fontSize:     15,
                  fontWeight:   800,
                  color:        "var(--text)",
                  letterSpacing: "0.12em",
                  lineHeight:   1,
                  textTransform: "uppercase",
                  fontFamily:   "'Geist Mono', monospace",
                }}
              >
                RELAY
              </div>
              <div
                style={{
                  fontSize:     8,
                  color:        "rgba(245,166,35,0.55)",
                  letterSpacing: "0.22em",
                  fontFamily:   "monospace",
                  marginTop:    2,
                  textTransform: "uppercase",
                }}
              >
                SYS:ONLINE
              </div>
            </div>
          </div>

          {/* Action buttons + avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <IconBtn title="Compose">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
            </IconBtn>

            <ThemeToggle />

            {/* Avatar / menu */}
            <div style={{ position: "relative", marginLeft: 2 }}>
              <button
                ref={avatarRef}
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  background:  "transparent",
                  border:      menuOpen ? "1.5px solid rgba(245,166,35,0.45)" : "1.5px solid transparent",
                  padding:     2,
                  cursor:      "pointer",
                  borderRadius: "50%",
                  outline:     "none",
                  transition:  "border-color 0.2s, box-shadow 0.2s",
                  boxShadow:   menuOpen ? "0 0 12px rgba(245,166,35,0.22)" : "none",
                  display:     "flex",
                }}
              >
                <Avatar
                  initials={currentUser?.avatar ?? ""}
                  status={currentUser?.status ?? "offline"}
                  size={28}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, scale: 0.91, y: -6 }}
                    animate={{ opacity: 1, scale: 1,    y: 0  }}
                    exit={{    opacity: 0, scale: 0.91, y: -6 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position:    "absolute",
                      top:         "calc(100% + 10px)",
                      right:       0,
                      width:       210,
                      background:  "var(--panel)",
                      border:      "1px solid rgba(245,166,35,0.14)",
                      borderRadius: 14,
                      boxShadow:   "0 10px 44px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,0,0,0.4), 0 2px 10px rgba(245,166,35,0.07)",
                      overflow:    "hidden",
                      zIndex:      100,
                    }}
                  >
                    {/* Accent strip */}
                    <div
                      style={{
                        height:     2,
                        background: "linear-gradient(90deg,#F5A623,#2B7FFF,#8B5CF6)",
                      }}
                    />

                    {/* User snapshot */}
                    <div
                      style={{
                        padding:      "11px 14px 9px",
                        borderBottom: "1px solid rgba(var(--border-rgb), 0.04)",
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>
                        {currentUser?.name ?? "—"}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(var(--text-rgb), 0.32)", wordBreak: "break-all", fontFamily: "monospace" }}>
                        {currentUser?.email ?? ""}
                      </div>
                    </div>

                    <div style={{ padding: "5px" }}>
                      <MenuRow
                        icon={
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        }
                        label="View profile"
                        onClick={() => { setMenuOpen(false); setProfileOpen(true); }}
                      />
                      <MenuRow
                        icon={
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                          </svg>
                        }
                        label="Disconnect"
                        danger
                        onClick={() => { setMenuOpen(false); onLogout(); }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Tab bar ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", padding: "0 12px", gap: 2 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              style={{
                flex:          1,
                display:       "flex",
                alignItems:    "center",
                justifyContent: "center",
                gap:           5,
                padding:       "9px 4px",
                borderRadius:  "7px 7px 0 0",
                border:        "none",
                background:    tab === t.id ? "rgba(245,166,35,0.07)" : "transparent",
                color:         tab === t.id ? "#F5A623" : "rgba(var(--text-rgb), 0.28)",
                fontSize:      9,
                fontWeight:    700,
                letterSpacing: "0.12em",
                cursor:        "pointer",
                fontFamily:    "'Geist Mono', monospace",
                transition:    "all 0.2s",
                borderBottom:  tab === t.id ? "2px solid #F5A623" : "2px solid transparent",
                boxShadow:     tab === t.id ? "0 2px 10px rgba(245,166,35,0.1)" : "none",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {profileOpen && (
          <ProfileModal user={currentUser} onClose={() => setProfileOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Icon button ─────────────────────────────────────────────────────────── */

function IconBtn({ children, title }: { children: React.ReactNode; title: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:          30,
        height:         30,
        borderRadius:   8,
        border:         hov ? "1px solid rgba(245,166,35,0.28)" : "1px solid transparent",
        background:     hov ? "rgba(245,166,35,0.08)" : "transparent",
        color:          hov ? "#F5A623" : "rgba(var(--text-rgb), 0.32)",
        cursor:         "pointer",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        transition:     "all 0.15s",
        boxShadow:      hov ? "0 0 10px rgba(245,166,35,0.1)" : "none",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Menu row ────────────────────────────────────────────────────────────── */

function MenuRow({
  icon, label, danger = false, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const color = danger
    ? hov ? "#F87171" : "rgba(248,113,113,0.7)"
    : hov ? "#F5A623" : "rgba(var(--text-rgb), 0.6)";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:       "100%",
        display:     "flex",
        alignItems:  "center",
        gap:         9,
        padding:     "8px 10px",
        borderRadius: 8,
        border:      "none",
        background:  hov
          ? danger ? "rgba(248,113,113,0.07)" : "rgba(245,166,35,0.07)"
          : "transparent",
        color,
        fontSize:    12,
        fontWeight:  600,
        cursor:      "pointer",
        fontFamily:  "inherit",
        textAlign:   "left",
        transition:  "all 0.12s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─── Profile modal ───────────────────────────────────────────────────────── */

function ProfileModal({ user, onClose }: { user: User | null; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(var(--void-rgb), 0.78)",
        backdropFilter: "blur(10px)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        zIndex:         200,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 22 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.88, y: 22 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width:        380,
          background:   "var(--space)",
          border:       "1px solid rgba(245,166,35,0.14)",
          borderRadius: 20,
          boxShadow:    "0 28px 90px rgba(0,0,0,0.72), 0 0 0 1px rgba(0,0,0,0.5), 0 0 70px rgba(245,166,35,0.04)",
          overflow:     "hidden",
        }}
      >
        {/* Accent strip */}
        <div style={{ height: 2, background: "linear-gradient(90deg,#F5A623,#2B7FFF,#8B5CF6)" }} />

        {/* Header area with grid texture */}
        <div
          style={{
            height:     84,
            background: "linear-gradient(135deg,rgba(245,166,35,0.07),rgba(43,127,255,0.07))",
            borderBottom: "1px solid rgba(var(--border-rgb), 0.04)",
            position:   "relative",
            overflow:   "hidden",
          }}
        >
          <div className="crt-overlay" />
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }}>
            <defs>
              <pattern id="pg" width="22" height="22" patternUnits="userSpaceOnUse">
                <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#F5A623" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pg)" />
          </svg>
        </div>

        {/* Avatar + close */}
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "flex-start",
            padding:        "0 22px",
            marginTop:      -34,
            marginBottom:   18,
          }}
        >
          <div
            style={{
              width:          66,
              height:         66,
              borderRadius:   "50%",
              background:     "linear-gradient(145deg,#F5A623,#2B7FFF)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       23,
              fontWeight:     700,
              color:          "#fff",
              border:         "3px solid var(--space)",
              boxShadow:      "0 0 22px rgba(245,166,35,0.22)",
              flexShrink:     0,
            }}
          >
            {user?.avatar ?? "?"}
          </div>

          <button
            onClick={onClose}
            style={{
              marginTop:      42,
              width:          28,
              height:         28,
              borderRadius:   8,
              border:         "1px solid rgba(var(--border-rgb), 0.06)",
              background:     "rgba(var(--border-rgb), 0.04)",
              color:          "rgba(var(--text-rgb), 0.38)",
              cursor:         "pointer",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       12,
              transition:     "all 0.15s",
            }}
          >
            ✕
          </button>
        </div>

        {/* Details */}
        <div style={{ padding: "0 22px 26px" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 3 }}>
            {user?.name ?? "—"}
          </div>
          <div style={{ fontSize: 10, color: "rgba(var(--text-rgb), 0.32)", marginBottom: 22, fontFamily: "monospace", letterSpacing: "0.04em" }}>
            {user?.email ?? ""}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ProfileField
              label="STATUS"
              value={
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span
                    style={{
                      width:        7,
                      height:       7,
                      borderRadius: "50%",
                      background:   user?.status === "online" ? "#00E676" : "rgba(var(--text-rgb), 0.18)",
                      display:      "inline-block",
                      boxShadow:    user?.status === "online" ? "0 0 7px rgba(0,230,118,0.65)" : "none",
                    }}
                  />
                  <span style={{ fontFamily: "monospace", letterSpacing: "0.06em", fontSize: 11 }}>
                    {user?.status === "online" ? "ONLINE" : `LAST SEEN ${user?.lastSeen ?? "—"}`}
                  </span>
                </span>
              }
            />
            {user?.about && <ProfileField label="ABOUT" value={user.about} />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProfileField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        gap:           5,
        padding:       "10px 14px",
        background:    "rgba(var(--border-rgb), 0.022)",
        borderRadius:  10,
        border:        "1px solid rgba(245,166,35,0.07)",
      }}
    >
      <span style={{ fontSize: 9, color: "rgba(245,166,35,0.5)", letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "monospace" }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: "rgba(var(--text-rgb), 0.72)" }}>
        {value}
      </span>
    </div>
  );
}
