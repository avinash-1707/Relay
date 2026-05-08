"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Avatars ── */
function AvatarDot({ initial, color, online }: { initial: string; color: string; online: boolean }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width:          28,
          height:         28,
          borderRadius:   "50%",
          background:     color,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       11,
          fontWeight:     700,
          color:          "#fff",
        }}
      >
        {initial}
      </div>
      <div
        style={{
          position:     "absolute",
          bottom:       1,
          right:        1,
          width:        7,
          height:       7,
          borderRadius: "50%",
          background:   online ? "#22C55E" : "rgba(var(--border-rgb), 0.2)",
          border:       "2px solid var(--void)",
          boxShadow:    online ? "0 0 5px rgba(34,197,94,0.7)" : "none",
        }}
      />
    </div>
  );
}

/* ── Mini chat window ── */
function MiniWindow({
  title,
  isMe,
  messages,
  typing,
  inputPlaceholder,
}: {
  title: string;
  isMe: boolean;
  messages: { text: string; visible: boolean; own: boolean }[];
  typing: boolean;
  inputPlaceholder: string;
}) {
  return (
    <div
      style={{
        flex:         1,
        minWidth:     0,
        borderRadius: 18,
        background:   "var(--void)",
        border:       `1px solid ${isMe ? "rgba(245,166,35,0.15)" : "rgba(139,92,246,0.15)"}`,
        overflow:     "hidden",
        boxShadow:    isMe
          ? "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.04) inset"
          : "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.04) inset",
      }}
    >
      {/* Window header */}
      <div
        style={{
          display:      "flex",
          alignItems:   "center",
          gap:          8,
          padding:      "10px 12px",
          borderBottom: `1px solid ${isMe ? "rgba(245,166,35,0.07)" : "rgba(139,92,246,0.07)"}`,
          background:   isMe ? "rgba(245,166,35,0.02)" : "rgba(139,92,246,0.02)",
        }}
      >
        <AvatarDot
          initial={isMe ? "Y" : "A"}
          color={isMe ? "linear-gradient(135deg,#F5A623,#D97706)" : "linear-gradient(135deg,#8B5CF6,#5B21B6)"}
          online
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{title}</div>
          <div
            style={{
              fontSize:      9,
              color:         "rgba(34,197,94,0.7)",
              fontFamily:    "monospace",
              letterSpacing: "0.08em",
            }}
          >
            ONLINE
          </div>
        </div>
        <div
          style={{
            fontSize:      8,
            fontFamily:    "monospace",
            letterSpacing: "0.08em",
            color:         isMe ? "rgba(245,166,35,0.4)" : "rgba(139,92,246,0.4)",
            textTransform: "uppercase",
            padding:       "2px 7px",
            borderRadius:  100,
            border:        `1px solid ${isMe ? "rgba(245,166,35,0.14)" : "rgba(139,92,246,0.14)"}`,
          }}
        >
          E2E
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          padding:       "12px 10px",
          display:       "flex",
          flexDirection: "column",
          gap:           8,
          minHeight:     180,
        }}
      >
        {messages.map((msg, i) => (
          <AnimatePresence key={i}>
            {msg.visible && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, ease }}
                style={{ display: "flex", justifyContent: msg.own ? "flex-end" : "flex-start" }}
              >
                <div
                  style={{
                    maxWidth:   "85%",
                    padding:    "7px 10px",
                    borderRadius: msg.own ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                    background: msg.own
                      ? "linear-gradient(145deg,rgba(245,166,35,0.2),rgba(43,127,255,0.15))"
                      : "rgba(var(--panel-rgb), 0.95)",
                    border: msg.own
                      ? "1px solid rgba(245,166,35,0.25)"
                      : "1px solid rgba(139,92,246,0.15)",
                    fontSize:   11,
                    lineHeight: 1.45,
                    color:      "var(--text)",
                    display:    "flex",
                    alignItems: "flex-end",
                    gap:        4,
                  }}
                >
                  <span>{msg.text}</span>
                  {msg.own && (
                    <span style={{ fontSize: 8, color: "rgba(245,166,35,0.7)", flexShrink: 0 }}>✓✓</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        {/* Typing */}
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          3,
                  padding:      "7px 10px",
                  borderRadius: "12px 12px 12px 3px",
                  background:   "rgba(var(--panel-rgb), 0.95)",
                  border:       "1px solid rgba(139,92,246,0.15)",
                  height:       30,
                }}
              >
                {(["waveform-a", "waveform-b", "waveform-c"] as const).map((a, j) => (
                  <div
                    key={j}
                    style={{
                      width:          2.5,
                      borderRadius:   2,
                      background:     isMe ? "rgba(245,166,35,0.55)" : "rgba(139,92,246,0.6)",
                      animation:      `${a} 0.9s ease-in-out infinite`,
                      animationDelay: `${j * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div style={{ padding: "0 10px 10px" }}>
        <div
          style={{
            display:     "flex",
            alignItems:  "center",
            gap:         7,
            padding:     "7px 10px",
            borderRadius: 10,
            background:  "rgba(var(--border-rgb), 0.03)",
            border:      `1px solid ${isMe ? "rgba(245,166,35,0.1)" : "rgba(139,92,246,0.1)"}`,
          }}
        >
          <span
            style={{
              flex:       1,
              fontSize:   9,
              color:      "rgba(var(--text-rgb), 0.15)",
              fontFamily: "monospace",
            }}
          >
            {inputPlaceholder}
          </span>
          <div
            style={{
              width:          20,
              height:         20,
              borderRadius:   "50%",
              background:     isMe
                ? "linear-gradient(145deg,#F5A623,#D97706)"
                : "linear-gradient(135deg,#8B5CF6,#5B21B6)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              flexShrink:     0,
            }}
          >
            <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24" style={{ color: "#fff" }}>
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dual window with synced animation ── */
function DualChatDemo() {
  const { ref, isInView } = useScrollReveal();

  const CONVO = [
    { text: "Hey! Are you free tonight?",          sender: "them" },
    { text: "Yeah! What's the plan?",              sender: "me"   },
    { text: "Let's hop on a quick call 📞",        sender: "them" },
    { text: "Give me 5 mins, then I'm good to go.", sender: "me"  },
  ];

  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    let cancelled = false;
    let timers: ReturnType<typeof setTimeout>[] = [];

    function run() {
      setStep(0);
      setTyping(false);
      timers.forEach(clearTimeout);
      const delays = [600, 1600, 2700, 3800];
      timers = [
        ...delays.map((d, i) =>
          setTimeout(() => { if (!cancelled) setStep(i + 1); }, d)
        ),
        setTimeout(() => { if (!cancelled) setTyping(true); }, 4600),
        setTimeout(() => { if (!cancelled) run(); }, 7000),
      ];
    }

    run();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [isInView]);

  const youMsgs = CONVO.map((m, i) => ({
    text:    m.text,
    visible: i < step,
    own:     m.sender === "me",
  }));
  const themMsgs = CONVO.map((m, i) => ({
    text:    m.text,
    visible: i < step,
    own:     m.sender === "them",
  }));

  return (
    <div ref={ref} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <MiniWindow
        title="You"
        isMe
        messages={youMsgs}
        typing={false}
        inputPlaceholder="MESSAGE ALEX..."
      />

      {/* Signal pulse between windows */}
      <div
        style={{
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          gap:            8,
          paddingTop:     56,
          flexShrink:     0,
          width:          48,
        }}
      >
        <div
          style={{
            width:        8,
            height:       8,
            borderRadius: "50%",
            background:   "#F5A623",
            boxShadow:    "0 0 10px rgba(245,166,35,0.7)",
            animation:    "neon-pulse 1.6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width:      1,
            height:     40,
            background: "linear-gradient(180deg,rgba(245,166,35,0.3),rgba(139,92,246,0.3))",
          }}
        />
        <div
          style={{
            fontSize:      8,
            fontFamily:    "monospace",
            color:         "rgba(var(--text-rgb), 0.2)",
            letterSpacing: "0.08em",
            textAlign:     "center",
            textTransform: "uppercase",
            lineHeight:    1.5,
          }}
        >
          RELAY
        </div>
        <div
          style={{
            width:      1,
            height:     40,
            background: "linear-gradient(180deg,rgba(139,92,246,0.3),rgba(245,166,35,0.3))",
          }}
        />
        <div
          style={{
            width:        8,
            height:       8,
            borderRadius: "50%",
            background:   "#8B5CF6",
            boxShadow:    "0 0 10px rgba(139,92,246,0.7)",
            animation:    "neon-pulse 1.6s ease-in-out infinite 0.4s",
          }}
        />
      </div>

      <MiniWindow
        title="Alex"
        isMe={false}
        messages={themMsgs}
        typing={typing}
        inputPlaceholder="REPLY..."
      />
    </div>
  );
}

export default function RealTime() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section id="how-it-works" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "1fr 1fr",
            gap:                 "clamp(40px, 6vw, 80px)",
            alignItems:          "center",
          }}
        >
          {/* Left: text */}
          <div ref={ref}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              style={{
                fontSize:      10,
                fontFamily:    "monospace",
                letterSpacing: "0.22em",
                color:         "rgba(245,166,35,0.6)",
                textTransform: "uppercase",
                marginBottom:  14,
              }}
            >
              // TWO_SIDES_ONE_RELAY
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.06, ease }}
              style={{
                fontSize:      "clamp(26px, 3.5vw, 40px)",
                fontWeight:    800,
                letterSpacing: "-0.03em",
                lineHeight:    1.1,
                color:         "var(--text)",
                marginBottom:  18,
              }}
            >
              What you send,
              <br />
              they see.{" "}
              <span style={{ color: "#F5A623" }}>Instantly.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12, ease }}
              style={{
                fontSize:     14,
                color:        "rgba(var(--text-rgb), 0.4)",
                lineHeight:   1.8,
                marginBottom: 36,
              }}
            >
              Socket.io keeps a persistent connection open between both participants.
              When you hit send, the message travels in real time — no page refresh, no delay.
            </motion.p>

            {/* Detail points */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Persistent WebSocket",  desc: "Connection stays open — no polling, no latency spikes." },
                { label: "Typing awareness",       desc: "The other person sees when you start and stop typing." },
                { label: "Message status",         desc: "Sent → Delivered → Read, updated automatically." },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -14 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.08, ease }}
                  style={{ display: "flex", gap: 12 }}
                >
                  <div
                    style={{
                      width:          18,
                      height:         18,
                      borderRadius:   "50%",
                      background:     "rgba(245,166,35,0.1)",
                      border:         "1px solid rgba(245,166,35,0.2)",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      flexShrink:     0,
                      marginTop:      3,
                    }}
                  >
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(245,166,35,0.75)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 12.5, color: "rgba(var(--text-rgb), 0.35)", lineHeight: 1.6 }}>
                      {item.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: dual demo */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease }}
          >
            <DualChatDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
