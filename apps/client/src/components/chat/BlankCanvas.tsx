"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onNewMessage: (email: string) => Promise<void>;
}

export default function BlankCanvas({ onNewMessage }: Props) {
  const [composing, setComposing] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      await onNewMessage(email.trim());
      setComposing(false);
      setEmail("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to start conversation";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
    if (e.key === "Escape") {
      setComposing(false);
      setEmail("");
      setError("");
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.02,
          }}
        >
          <defs>
            <pattern
              id="blankgrid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blankgrid)" />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 500,
            height: 400,
            borderRadius: "50%",
            background: "rgba(34,211,238,0.03)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div style={{ position: "relative", textAlign: "center", maxWidth: 380 }}>
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 28, display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background:
                "linear-gradient(135deg,rgba(34,211,238,0.12),rgba(37,99,235,0.12))",
              border: "1px solid rgba(34,211,238,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 60px rgba(34,211,238,0.08)",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 14 14" fill="none">
              <path d="M2 7 L6 3 L12 7 L6 11 Z" fill="url(#lg)" />
              <defs>
                <linearGradient
                  id="lg"
                  x1="2"
                  y1="3"
                  x2="12"
                  y2="11"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#22d3ee" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.03em",
            marginBottom: 10,
          }}
        >
          Your messages, delivered instantly.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.45 }}
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          Select a conversation from the left to get started, or start a new
          message.
        </motion.p>

        {/* Compose area */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.45 }}
        >
          <AnimatePresence mode="wait">
            {composing ? (
              <motion.div
                key="compose"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    autoFocus
                    type="email"
                    placeholder="Enter email address…"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)"}`,
                      color: "#fff",
                      fontSize: 13,
                      fontFamily: "inherit",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !email.trim()}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 10,
                      background: loading || !email.trim()
                        ? "rgba(6,182,212,0.3)"
                        : "linear-gradient(135deg,#06b6d4,#2563eb)",
                      border: "none",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: loading || !email.trim() ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {loading ? "Opening…" : "Open chat"}
                  </button>
                  <button
                    onClick={() => { setComposing(false); setEmail(""); setError(""); }}
                    disabled={loading}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    ✕
                  </button>
                </div>
                {error && (
                  <p style={{ fontSize: 12, color: "rgba(239,68,68,0.85)", margin: 0, textAlign: "left" }}>
                    {error}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="buttons"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", justifyContent: "center", gap: 10 }}
              >
                <button
                  onClick={() => setComposing(true)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#06b6d4,#2563eb)",
                    border: "none",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "inherit",
                    boxShadow: "0 4px 20px rgba(6,182,212,0.2)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                  New message
                </button>
                <button
                  style={{
                    padding: "10px 20px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Find contacts
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {[
            ["E2E Encrypted", "🔒"],
            ["Sub-200ms", "⚡"],
            ["180+ countries", "🌍"],
          ].map(([label, icon]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.03em",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
