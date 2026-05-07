"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Avatar from "../shared/Avatar";
import type { AppState, User } from "../../types";
import { JSX } from "react/jsx-dev-runtime";

interface Props {
  tab: AppState["sidebarTab"];
  onTabChange: (t: AppState["sidebarTab"]) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const TABS: { id: AppState["sidebarTab"]; label: string; icon: JSX.Element }[] =
  [
    {
      id: "chats",
      label: "Chats",
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
    },
    {
      id: "calls",
      label: "Calls",
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
  ];

export default function SidebarHeader({ tab, onTabChange, currentUser, onLogout }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <div style={{ padding: "0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px 16px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg,#22d3ee,#2563eb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7 L6 3 L12 7 L6 11 Z" fill="white" />
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>
              Relay
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[
              <svg key="edit" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>,
              <svg key="more" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>,
            ].map((icon, i) => (
              <button
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.38)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.38)";
                }}
              >
                {icon}
              </button>
            ))}

            {/* Avatar — menu trigger */}
            <div style={{ position: "relative" }}>
              <button
                ref={avatarRef}
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  borderRadius: "50%",
                  outline: menuOpen ? "2px solid rgba(34,211,238,0.5)" : "none",
                  outlineOffset: 2,
                }}
              >
                <Avatar
                  initials={currentUser?.avatar ?? ""}
                  status={currentUser?.status ?? "offline"}
                  size={30}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, scale: 0.92, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -6 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: 200,
                      background: "#161B25",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                      overflow: "hidden",
                      zIndex: 100,
                    }}
                  >
                    {/* User snapshot */}
                    <div
                      style={{
                        padding: "12px 14px 10px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>
                        {currentUser?.name ?? "—"}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", wordBreak: "break-all" }}>
                        {currentUser?.email ?? ""}
                      </div>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: "6px" }}>
                      <MenuButton
                        icon={
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        }
                        label="View profile"
                        onClick={() => { setMenuOpen(false); setProfileOpen(true); }}
                      />
                      <MenuButton
                        icon={
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                          </svg>
                        }
                        label="Log out"
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

        {/* Tabs */}
        <div style={{ display: "flex", padding: "0 16px 0", gap: 2 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "9px 8px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                background: tab === t.id ? "rgba(34,211,238,0.06)" : "transparent",
                color: tab === t.id ? "#22d3ee" : "rgba(255,255,255,0.3)",
                fontSize: 13,
                fontWeight: tab === t.id ? 600 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                borderBottom: tab === t.id ? "2px solid #22d3ee" : "2px solid transparent",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile modal */}
      <AnimatePresence>
        {profileOpen && (
          <ProfileModal user={currentUser} onClose={() => setProfileOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Menu button ──────────────────────────────────────────────────────────────

function MenuButton({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const color = danger
    ? hovered ? "rgba(239,68,68,1)" : "rgba(239,68,68,0.75)"
    : hovered ? "#fff" : "rgba(255,255,255,0.65)";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "8px 10px",
        borderRadius: 8,
        border: "none",
        background: hovered
          ? danger ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)"
          : "transparent",
        color,
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        transition: "all 0.12s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Profile modal ────────────────────────────────────────────────────────────

function ProfileModal({ user, onClose }: { user: User | null; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 360,
          background: "#161B25",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        {/* Header band */}
        <div
          style={{
            height: 72,
            background: "linear-gradient(135deg,rgba(34,211,238,0.12),rgba(37,99,235,0.12))",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            position: "relative",
          }}
        />

        {/* Avatar + close */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "0 20px",
            marginTop: -28,
            marginBottom: 16,
          }}
        >
          {/* Big avatar */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#06b6d4,#2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              border: "3px solid #161B25",
              flexShrink: 0,
            }}
          >
            {user?.avatar ?? "?"}
          </div>

          <button
            onClick={onClose}
            style={{
              marginTop: 36,
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "none",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.45)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>

        {/* Details */}
        <div style={{ padding: "0 20px 24px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 2 }}>
            {user?.name ?? "—"}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
            {user?.email ?? ""}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <ProfileRow
              label="Status"
              value={
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: user?.status === "online" ? "#22c55e" : "rgba(255,255,255,0.25)",
                      display: "inline-block",
                    }}
                  />
                  {user?.status === "online" ? "Online" : `Last seen ${user?.lastSeen ?? "—"}`}
                </span>
              }
            />
            {user?.about && (
              <ProfileRow label="About" value={user.about} />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProfileRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        padding: "10px 12px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
        {value}
      </span>
    </div>
  );
}
