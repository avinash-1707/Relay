"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { searchUsersApi, type ServerUser } from "@/lib/api";
import Avatar from "../shared/Avatar";

interface Props {
  onStart: (email: string) => void | Promise<void>;
  onClose: () => void;
  currentUserEmail?: string;
}

export default function NewConversationModal({ onStart, onClose, currentUserEmail }: Props) {
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState<ServerUser[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [starting, setStarting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const search = useCallback((q: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!q.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await searchUsersApi(q);
        setResults(res.filter((u) => u.email !== currentUserEmail));
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  }, [currentUserEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    search(e.target.value);
  };

  const handleStart = async (user: ServerUser) => {
    if (starting) return;
    setStarting(user.email);
    try {
      await onStart(user.email);
      onClose();
    } finally {
      setStarting(null);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        zIndex:         1000,
        display:        "flex",
        alignItems:     "flex-start",
        justifyContent: "center",
        paddingTop:     80,
        paddingLeft:    16,
        paddingRight:   16,
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width:        "100%",
          maxWidth:     400,
          background:   "#0D1221",
          border:       "1px solid rgba(245,166,35,0.15)",
          borderRadius: 16,
          overflow:     "hidden",
          boxShadow:    "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.06)",
        }}
      >
        {/* Accent strip */}
        <div style={{ height: 2, background: "linear-gradient(90deg,#F5A623,#2B7FFF,#8B5CF6)" }} />

        {/* Header */}
        <div style={{
          padding:        "14px 18px 12px",
          borderBottom:   "1px solid rgba(245,166,35,0.07)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#F0F0F8", letterSpacing: "0.01em" }}>
            New Message
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "rgba(240,240,248,0.35)", cursor: "pointer", padding: 4, lineHeight: 0, borderRadius: 6 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,240,248,0.7)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,240,248,0.35)"; }}
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "10px 18px", borderBottom: "1px solid rgba(245,166,35,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="13" height="13" fill="none" stroke="rgba(245,166,35,0.45)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder="Search by name or email..."
            style={{
              flex:       1,
              background: "none",
              border:     "none",
              outline:    "none",
              color:      "#F0F0F8",
              fontSize:   13,
              fontFamily: "inherit",
            }}
          />
          {loading && (
            <div style={{ width: 13, height: 13, border: "2px solid rgba(245,166,35,0.15)", borderTopColor: "#F5A623", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
          )}
        </div>

        {/* Results */}
        <div className="relay-scroll" style={{ maxHeight: 300, overflowY: "auto" }}>
          {!query.trim() ? (
            <div style={{ padding: "28px 18px", textAlign: "center", color: "rgba(240,240,248,0.2)", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Type to find a teammate
            </div>
          ) : results.length === 0 && !loading ? (
            <div style={{ padding: "28px 18px", textAlign: "center", color: "rgba(240,240,248,0.3)", fontSize: 13 }}>
              No users found
            </div>
          ) : (
            results.map((user) => (
              <button
                key={user._id}
                onClick={() => handleStart(user)}
                disabled={!!starting}
                style={{
                  width:      "100%",
                  padding:    "10px 18px",
                  display:    "flex",
                  alignItems: "center",
                  gap:        12,
                  background: "none",
                  border:     "none",
                  cursor:     starting ? "wait" : "pointer",
                  textAlign:  "left",
                  transition: "background 0.12s",
                  opacity:    starting && starting !== user.email ? 0.45 : 1,
                }}
                onMouseEnter={(e) => { if (!starting) (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,166,35,0.05)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
              >
                <Avatar
                  initials={user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  status={user.isOnline ? "online" : "offline"}
                  size={34}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#F0F0F8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.displayName}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(240,240,248,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 1 }}>
                    {user.email}
                  </div>
                </div>
                {starting === user.email && (
                  <div style={{ width: 13, height: 13, border: "2px solid rgba(245,166,35,0.15)", borderTopColor: "#F5A623", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
                )}
              </button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
