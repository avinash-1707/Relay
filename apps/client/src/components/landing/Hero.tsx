"use client";

import { useEffect, useState } from "react";
import { motion, cubicBezier } from "motion/react";

const ease = cubicBezier(0.22, 1, 0.36, 1);

const STARS = Array.from({ length: 80 }, (_, i) => ({
  left:     `${((i * 137.508 + 11) % 100).toFixed(2)}%`,
  top:      `${((i * 97.631  + 7) % 100).toFixed(2)}%`,
  size:     0.6 + (i % 4) * 0.55,
  delay:    `${(i * 0.37) % 6}s`,
  duration: `${2.8 + (i % 5)}s`,
}));

const DEMO = [
  { from: "them", text: "Hey! Are you free tonight?" },
  { from: "me",   text: "Yeah! What's up?" },
  { from: "them", text: "Want to catch up on the project? 🚀" },
  { from: "me",   text: "Sounds good — send me the details." },
] as const;

function useDemoChat() {
  const [count,  setCount]  = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timers: ReturnType<typeof setTimeout>[] = [];

    function run() {
      setCount(0);
      setTyping(false);
      timers.forEach(clearTimeout);
      timers = [
        setTimeout(() => { if (!cancelled) setCount(1);              }, 600),
        setTimeout(() => { if (!cancelled) setCount(2);              }, 1500),
        setTimeout(() => { if (!cancelled) setTyping(true);          }, 2200),
        setTimeout(() => { if (!cancelled) setCount(3); setTyping(false); }, 3100),
        setTimeout(() => { if (!cancelled) setTyping(true);          }, 3900),
        setTimeout(() => { if (!cancelled) setCount(4); setTyping(false); }, 4800),
        setTimeout(() => { if (!cancelled) run();                    }, 8000),
      ];
    }

    run();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, []);

  return { count, typing };
}

function WaveformBars() {
  const anims = ["waveform-a", "waveform-b", "waveform-c", "waveform-d"] as const;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {anims.map((a, i) => (
        <div
          key={i}
          style={{
            width:          2.5,
            borderRadius:   2,
            background:     "rgba(245,166,35,0.6)",
            animation:      `${a} 0.9s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

function ChatMockup() {
  const { count, typing } = useDemoChat();

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{
        transform:       "perspective(1100px) rotateY(-7deg) rotateX(3deg)",
        transformOrigin: "center center",
        willChange:      "transform",
      }}
    >
      {/* Outer glow halo */}
      <div
        style={{
          position:      "absolute",
          inset:         -24,
          borderRadius:  36,
          background:    "radial-gradient(ellipse,rgba(245,166,35,0.07) 0%,transparent 72%)",
          filter:        "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position:     "relative",
          width:        300,
          borderRadius: 22,
          background:   "var(--void)",
          border:       "1px solid rgba(245,166,35,0.18)",
          overflow:     "hidden",
          boxShadow:    "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,166,35,0.05) inset",
        }}
      >
        {/* Chat header */}
        <div
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          10,
            padding:      "13px 14px",
            borderBottom: "1px solid rgba(245,166,35,0.07)",
            background:   "rgba(245,166,35,0.025)",
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width:          32,
                height:         32,
                borderRadius:   "50%",
                background:     "linear-gradient(135deg,#8B5CF6,#5B21B6)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                fontSize:       12,
                fontWeight:     700,
                color:          "#fff",
              }}
            >
              A
            </div>
            <div
              style={{
                position:     "absolute",
                bottom:       1,
                right:        1,
                width:        8,
                height:       8,
                borderRadius: "50%",
                background:   "#22C55E",
                border:       "2px solid var(--void)",
                boxShadow:    "0 0 6px rgba(34,197,94,0.7)",
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Alex</div>
            <div
              style={{
                fontSize:      9,
                color:         "rgba(34,197,94,0.75)",
                fontFamily:    "monospace",
                letterSpacing: "0.08em",
              }}
            >
              ONLINE
            </div>
          </div>

          <div
            style={{
              padding:       "3px 8px",
              borderRadius:  100,
              background:    "rgba(245,166,35,0.07)",
              border:        "1px solid rgba(245,166,35,0.14)",
              fontSize:      8,
              fontFamily:    "monospace",
              letterSpacing: "0.1em",
              color:         "rgba(245,166,35,0.55)",
              textTransform: "uppercase",
            }}
          >
            E2E
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            padding:       "14px 12px",
            display:       "flex",
            flexDirection: "column",
            gap:           9,
            minHeight:     240,
          }}
        >
          {DEMO.map((msg, i) => {
            if (i >= count) return null;
            const isMe = msg.from === "me";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}
              >
                <div
                  style={{
                    maxWidth:   "82%",
                    padding:    "8px 11px",
                    borderRadius: isMe
                      ? "13px 13px 3px 13px"
                      : "13px 13px 13px 3px",
                    background: isMe
                      ? "linear-gradient(145deg,rgba(245,166,35,0.2),rgba(43,127,255,0.16))"
                      : "rgba(var(--panel-rgb), 0.95)",
                    border: isMe
                      ? "1px solid rgba(245,166,35,0.28)"
                      : "1px solid rgba(139,92,246,0.14)",
                    fontSize:   12,
                    lineHeight: 1.5,
                    color:      "var(--text)",
                    display:    "flex",
                    alignItems: "flex-end",
                    gap:        5,
                  }}
                >
                  <span>{msg.text}</span>
                  {isMe && (
                    <span style={{ fontSize: 9, color: "rgba(245,166,35,0.7)", flexShrink: 0 }}>✓✓</span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ display: "flex", alignItems: "center", gap: 7 }}
            >
              <div
                style={{
                  width:          22,
                  height:         22,
                  borderRadius:   "50%",
                  background:     "linear-gradient(135deg,#8B5CF6,#5B21B6)",
                  flexShrink:     0,
                }}
              />
              <div
                style={{
                  padding:      "8px 12px",
                  borderRadius: "13px 13px 13px 3px",
                  background:   "rgba(var(--panel-rgb), 0.95)",
                  border:       "1px solid rgba(139,92,246,0.14)",
                  height:       34,
                  display:      "flex",
                  alignItems:   "center",
                }}
              >
                <WaveformBars />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input bar */}
        <div style={{ padding: "0 12px 12px" }}>
          <div
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          8,
              padding:      "9px 11px",
              borderRadius: 11,
              background:   "rgba(var(--border-rgb), 0.03)",
              border:       "1px solid rgba(245,166,35,0.1)",
            }}
          >
            <span
              style={{
                flex:          1,
                fontSize:      10,
                color:         "rgba(var(--text-rgb), 0.18)",
                fontFamily:    "monospace",
                letterSpacing: "0.06em",
              }}
            >
              MESSAGE...
            </span>
            <div
              style={{
                width:          24,
                height:         24,
                borderRadius:   "50%",
                background:     "linear-gradient(145deg,#F5A623,#D97706)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                flexShrink:     0,
              }}
            >
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24" style={{ color: "#060912" }}>
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section
      style={{
        position:      "relative",
        minHeight:     "100vh",
        display:       "flex",
        alignItems:    "center",
        overflow:      "hidden",
        paddingTop:    96,
        paddingBottom: 80,
      }}
    >
      {/* ── Atmosphere ───────────────────────────────────────────────── */}
      <div className="crt-overlay" />

      {STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position:       "absolute",
            left:           s.left,
            top:            s.top,
            width:          s.size,
            height:         s.size,
            borderRadius:   "50%",
            background:     "var(--text)",
            animation:      `star-twinkle ${s.duration} ease-in-out infinite`,
            animationDelay: s.delay,
            pointerEvents:  "none",
          }}
        />
      ))}

      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.022, pointerEvents: "none" }}
      >
        <defs>
          <pattern id="h-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#F5A623" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#h-grid)" />
      </svg>

      {/* Left amber radial glow */}
      <div
        style={{
          position:      "absolute",
          top:           "42%",
          left:          "28%",
          transform:     "translate(-50%,-50%)",
          width:          820,
          height:         600,
          borderRadius:  "50%",
          background:    "radial-gradient(ellipse,rgba(245,166,35,0.06) 0%,rgba(43,127,255,0.02) 50%,transparent 70%)",
          filter:        "blur(50px)",
          pointerEvents: "none",
          animation:     "ambient-drift 18s ease-in-out infinite",
        }}
      />

      {/* Right violet glow (behind mockup) */}
      <div
        style={{
          position:      "absolute",
          top:           "50%",
          right:         "8%",
          transform:     "translateY(-50%)",
          width:          380,
          height:         480,
          borderRadius:  "50%",
          background:    "rgba(139,92,246,0.04)",
          filter:        "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="hero-grid">
        {/* Left: text */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            style={{ marginBottom: 30 }}
          >
            <div
              style={{
                display:     "inline-flex",
                alignItems:  "center",
                gap:         8,
                padding:     "6px 14px",
                borderRadius: 100,
                border:      "1px solid rgba(245,166,35,0.18)",
                background:  "rgba(245,166,35,0.05)",
              }}
            >
              <span
                style={{
                  width:        5,
                  height:       5,
                  borderRadius: "50%",
                  background:   "#F5A623",
                  boxShadow:    "0 0 8px rgba(245,166,35,0.8)",
                  animation:    "neon-pulse 2s ease-in-out infinite",
                  flexShrink:   0,
                }}
              />
              <span
                style={{
                  fontSize:      10,
                  fontFamily:    "monospace",
                  letterSpacing: "0.16em",
                  color:         "rgba(245,166,35,0.75)",
                  textTransform: "uppercase",
                }}
              >
                SECURE · REAL-TIME MESSAGING
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            style={{
              fontSize:      "clamp(40px, 5.5vw, 68px)",
              fontWeight:    800,
              letterSpacing: "-0.04em",
              lineHeight:    1.06,
              color:         "var(--text)",
              marginBottom:  20,
            }}
          >
            Chat that
            <br />
            feels{" "}
            <span style={{ color: "#F5A623" }}>real.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease }}
            style={{
              fontSize:     16,
              color:        "rgba(var(--text-rgb), 0.4)",
              lineHeight:   1.8,
              maxWidth:     420,
              marginBottom: 40,
            }}
          >
            End-to-end encrypted 1:1 messaging with live presence,
            typing indicators, read receipts, and file sharing — right in your browser.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease }}
            style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
          >
            <a
              href="/login"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            7,
                padding:        "13px 26px",
                borderRadius:   100,
                background:     "linear-gradient(145deg,#F5A623,#D97706)",
                color:          "#060912",
                fontSize:       14,
                fontWeight:     700,
                textDecoration: "none",
                boxShadow:      "0 4px 20px rgba(245,166,35,0.32)",
                letterSpacing:  "0.01em",
                transition:     "box-shadow 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow = "0 6px 32px rgba(245,166,35,0.52)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow = "0 4px 20px rgba(245,166,35,0.32)";
                el.style.transform = "translateY(0)";
              }}
            >
              Start messaging free
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </a>

            <a
              href="/login"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            6,
                padding:        "13px 22px",
                borderRadius:   100,
                background:     "rgba(var(--border-rgb), 0.04)",
                border:         "1px solid rgba(var(--border-rgb), 0.09)",
                color:          "rgba(var(--text-rgb), 0.5)",
                fontSize:       14,
                textDecoration: "none",
                transition:     "all 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(245,166,35,0.2)";
                el.style.color = "rgba(var(--text-rgb), 0.8)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(var(--border-rgb), 0.09)";
                el.style.color = "rgba(var(--text-rgb), 0.5)";
              }}
            >
              Sign in
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            style={{
              display:     "flex",
              alignItems:  "center",
              gap:         24,
              marginTop:   36,
              paddingTop:  28,
              borderTop:   "1px solid rgba(245,166,35,0.07)",
              flexWrap:    "wrap",
            }}
          >
            {[
              { label: "E2E ENCRYPTED",   icon: "🔒" },
              { label: "REAL-TIME",        icon: "⚡" },
              { label: "GOOGLE OAUTH",     icon: "🔑" },
            ].map(({ label, icon }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 13 }}>{icon}</span>
                <span
                  style={{
                    fontSize:      10,
                    color:         "rgba(var(--text-rgb), 0.28)",
                    fontFamily:    "monospace",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: animated chat mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
          className="hero-mockup"
          style={{
            display:        "flex",
            justifyContent: "center",
            alignItems:     "center",
            position:       "relative",
          }}
        >
          <ChatMockup />
        </motion.div>
      </div>
    </section>
  );
}
