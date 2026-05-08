"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onNewMessage: (email: string) => Promise<void>;
}

/* Starfield positions — deterministic, no Math.random() at render */
const STARS = Array.from({ length: 60 }, (_, i) => ({
  left:     `${((i * 137.508 + 11) % 100).toFixed(2)}%`,
  top:      `${((i * 97.631 + 7) % 100).toFixed(2)}%`,
  size:     1 + (i % 3) * 0.8,
  delay:    `${(i * 0.41) % 5}s`,
  duration: `${2.5 + (i % 4)}s`,
}));

export default function BlankCanvas({ onNewMessage }: Props) {
  const [composing, setComposing] = useState(false);
  const [email,     setEmail]     = useState("");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  async function handleSend() {
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      await onNewMessage(email.trim());
      setComposing(false);
      setEmail("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to start conversation");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter")  handleSend();
    if (e.key === "Escape") { setComposing(false); setEmail(""); setError(""); }
  }

  return (
    <div
      style={{
        flex:           1,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        height:         "100vh",
        position:       "relative",
        overflow:       "hidden",
        background:     "var(--void)",
      }}
    >
      {/* ── Environment ────────────────────────────────────────────── */}

      {/* CRT scanlines */}
      <div className="crt-overlay" />

      {/* Amber-tinted grid */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.025, pointerEvents: "none" }}
      >
        <defs>
          <pattern id="bc-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#F5A623" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bc-grid)" />
      </svg>

      {/* Starfield */}
      {STARS.map((star, i) => (
        <div
          key={i}
          style={{
            position:        "absolute",
            left:            star.left,
            top:             star.top,
            width:           star.size,
            height:          star.size,
            borderRadius:    "50%",
            background:      "var(--text)",
            animation:       `star-twinkle ${star.duration} ease-in-out infinite`,
            animationDelay:  star.delay,
            pointerEvents:   "none",
          }}
        />
      ))}

      {/* Central radial amber glow */}
      <div
        style={{
          position:      "absolute",
          top:           "50%",
          left:          "50%",
          transform:     "translate(-50%,-50%)",
          width:          700,
          height:         500,
          borderRadius:  "50%",
          background:    "radial-gradient(ellipse,rgba(245,166,35,0.04) 0%,rgba(43,127,255,0.015) 50%,transparent 70%)",
          filter:        "blur(30px)",
          pointerEvents: "none",
          animation:     "ambient-drift 16s ease-in-out infinite",
        }}
      />

      {/* Violet ambient bottom */}
      <div
        style={{
          position:      "absolute",
          bottom:        "-10%",
          left:          "20%",
          width:          600,
          height:         350,
          borderRadius:  "50%",
          background:    "rgba(139,92,246,0.025)",
          filter:        "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div style={{ position: "relative", textAlign: "center", maxWidth: 400, padding: "0 24px" }}>

        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1,    opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}
        >
          <div style={{ position: "relative" }}>
            {/* Outer ring */}
            <div
              style={{
                position:      "absolute",
                inset:         -16,
                borderRadius:  "50%",
                border:        "1px solid rgba(245,166,35,0.08)",
                animation:     "neon-pulse 3s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
            {/* Inner ring */}
            <div
              style={{
                position:      "absolute",
                inset:         -8,
                borderRadius:  "50%",
                border:        "1px solid rgba(245,166,35,0.14)",
                pointerEvents: "none",
              }}
            />

            {/* Main hexagon panel */}
            <div
              style={{
                width:          96,
                height:         96,
                borderRadius:   24,
                background:     "linear-gradient(145deg,rgba(245,166,35,0.12),rgba(43,127,255,0.1))",
                border:         "1px solid rgba(245,166,35,0.22)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                boxShadow:      "0 0 60px rgba(245,166,35,0.1), 0 0 20px rgba(245,166,35,0.06), 0 8px 32px rgba(0,0,0,0.5)",
                animation:      "amber-flicker 10s ease-in-out infinite",
              }}
            >
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path
                  d="M22 3L39 12.5V31.5L22 41L5 31.5V12.5L22 3Z"
                  stroke="rgba(245,166,35,0.7)"
                  strokeWidth="1.2"
                  fill="rgba(245,166,35,0.08)"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 11L32 17V29L22 35L12 29V17L22 11Z"
                  fill="rgba(245,166,35,0.45)"
                />
                <path
                  d="M22 18L27 21V27L22 30L17 27V21L22 18Z"
                  fill="rgba(255,255,255,0.65)"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.12, duration: 0.5 }}
        >
          <div
            style={{
              fontSize:     10,
              color:        "rgba(245,166,35,0.5)",
              letterSpacing: "0.22em",
              fontFamily:   "monospace",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            RELAY // COMM CENTER
          </div>
          <h2
            style={{
              fontSize:      26,
              fontWeight:    800,
              color:         "var(--text)",
              letterSpacing: "-0.03em",
              marginBottom:  10,
              lineHeight:    1.2,
            }}
          >
            Select a channel to begin transmission.
          </h2>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.2, duration: 0.45 }}
          style={{
            fontSize:     13,
            color:        "rgba(var(--text-rgb), 0.3)",
            lineHeight:   1.7,
            marginBottom: 36,
          }}
        >
          Choose a conversation from the sidebar, or open a new secure channel.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.28, duration: 0.45 }}
        >
          <AnimatePresence mode="wait">
            {composing ? (
              <motion.div
                key="compose"
                initial={{ opacity: 0, y: 8  }}
                animate={{ opacity: 1, y: 0  }}
                exit={{    opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    autoFocus
                    type="email"
                    placeholder="Enter email address..."
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    style={{
                      flex:         1,
                      padding:      "11px 14px",
                      borderRadius: 10,
                      background:   "rgba(var(--border-rgb), 0.05)",
                      border:       `1px solid ${error ? "rgba(248,113,113,0.45)" : "rgba(245,166,35,0.2)"}`,
                      color:        "var(--text)",
                      fontSize:     13,
                      fontFamily:   "inherit",
                      outline:      "none",
                      transition:   "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,166,35,0.45)")}
                    onBlur={(e)  => (e.target.style.borderColor = error ? "rgba(248,113,113,0.45)" : "rgba(245,166,35,0.2)")}
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !email.trim()}
                    style={{
                      padding:      "11px 20px",
                      borderRadius: 10,
                      background:   loading || !email.trim()
                        ? "rgba(245,166,35,0.22)"
                        : "linear-gradient(145deg,#F5A623,#D97706)",
                      border:       "none",
                      color:        loading || !email.trim() ? "rgba(var(--text-rgb), 0.4)" : "#060912",
                      fontSize:     13,
                      fontWeight:   700,
                      cursor:       loading || !email.trim() ? "not-allowed" : "pointer",
                      fontFamily:   "inherit",
                      whiteSpace:   "nowrap",
                      boxShadow:    loading || !email.trim() ? "none" : "0 4px 16px rgba(245,166,35,0.3)",
                      transition:   "all 0.15s",
                    }}
                  >
                    {loading ? "Opening..." : "Open"}
                  </button>
                  <button
                    onClick={() => { setComposing(false); setEmail(""); setError(""); }}
                    disabled={loading}
                    style={{
                      padding:      "11px 14px",
                      borderRadius: 10,
                      background:   "rgba(var(--border-rgb), 0.04)",
                      border:       "1px solid rgba(var(--border-rgb), 0.06)",
                      color:        "rgba(var(--text-rgb), 0.4)",
                      fontSize:     13,
                      cursor:       "pointer",
                      fontFamily:   "inherit",
                    }}
                  >
                    ✕
                  </button>
                </div>
                {error && (
                  <p style={{ fontSize: 12, color: "rgba(248,113,113,0.85)", margin: 0, textAlign: "left" }}>
                    {error}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="buttons"
                initial={{ opacity: 0, y: 8  }}
                animate={{ opacity: 1, y: 0  }}
                exit={{    opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", justifyContent: "center", gap: 10 }}
              >
                <button
                  onClick={() => setComposing(true)}
                  style={{
                    padding:      "11px 22px",
                    borderRadius: 11,
                    background:   "linear-gradient(145deg,#F5A623,#D97706)",
                    border:       "none",
                    color:        "#060912",
                    fontSize:     13,
                    fontWeight:   700,
                    cursor:       "pointer",
                    display:      "flex",
                    alignItems:   "center",
                    gap:          8,
                    fontFamily:   "inherit",
                    boxShadow:    "0 4px 22px rgba(245,166,35,0.28)",
                    transition:   "all 0.18s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 30px rgba(245,166,35,0.42)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 22px rgba(245,166,35,0.28)"; }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                  New channel
                </button>
                <button
                  style={{
                    padding:      "11px 20px",
                    borderRadius: 11,
                    background:   "rgba(var(--border-rgb), 0.04)",
                    border:       "1px solid rgba(var(--border-rgb), 0.07)",
                    color:        "rgba(var(--text-rgb), 0.5)",
                    fontSize:     13,
                    fontWeight:   500,
                    cursor:       "pointer",
                    fontFamily:   "inherit",
                    transition:   "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = "rgba(245,166,35,0.18)";
                    el.style.color       = "rgba(var(--text-rgb), 0.7)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = "rgba(var(--border-rgb), 0.07)";
                    el.style.color       = "rgba(var(--text-rgb), 0.5)";
                  }}
                >
                  Find contacts
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Status row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.55 }}
          style={{
            display:       "flex",
            justifyContent: "center",
            gap:           36,
            marginTop:     52,
            paddingTop:    32,
            borderTop:     "1px solid rgba(245,166,35,0.06)",
          }}
        >
          {([
            ["E2E Encrypted", "🔒"],
            ["Sub-200ms",     "⚡"],
            ["180+ countries","🌍"],
          ] as [string, string][]).map(([label, icon]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 5 }}>{icon}</div>
              <div
                style={{
                  fontSize:     9,
                  color:        "rgba(var(--text-rgb), 0.22)",
                  letterSpacing: "0.08em",
                  fontFamily:   "monospace",
                  textTransform: "uppercase",
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
