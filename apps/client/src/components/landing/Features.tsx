"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Feature data ── */
const FEATURES = [
  {
    num:   "01",
    title: "End-to-end encrypted",
    desc:  "Every message locked before it leaves your screen. AES-256 encryption means only you and your contact can read it — nobody else, ever.",
    color: "#F5A623",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    num:   "02",
    title: "Live presence & typing",
    desc:  "See who's online, who's away, who just went offline. Know the moment they start composing — typing indicators update in real time.",
    color: "#22C55E",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    num:   "03",
    title: "Read receipts",
    desc:  "Sent. Delivered. Read. The double-tick system tells you exactly where your message stands, without you having to wonder.",
    color: "#2B7FFF",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
  },
  {
    num:   "04",
    title: "Files & media sharing",
    desc:  "Drop images, voice notes, and files right into the conversation. Everything uploaded securely via Cloudinary — no size anxiety.",
    color: "#8B5CF6",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
      </svg>
    ),
  },
] as const;

function FeatureStrip({
  feature,
  index,
  isInView,
}: {
  feature: typeof FEATURES[number];
  index: number;
  isInView: boolean;
}) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:         "grid",
        gridTemplateColumns: "72px 1fr 72px",
        alignItems:      "center",
        gap:             32,
        padding:         "28px 0",
        borderTop:       "1px solid rgba(245,166,35,0.07)",
        background:      hov ? `rgba(${feature.color === "#F5A623" ? "245,166,35" : feature.color === "#22C55E" ? "34,197,94" : feature.color === "#2B7FFF" ? "43,127,255" : "139,92,246"},0.025)` : "transparent",
        borderRadius:    8,
        transition:      "background 0.2s",
        cursor:          "default",
        paddingLeft:     12,
        paddingRight:    12,
        marginLeft:      -12,
        marginRight:     -12,
      }}
    >
      {/* Number */}
      <div
        style={{
          fontSize:      "clamp(40px, 5vw, 60px)",
          fontFamily:    "monospace",
          fontWeight:    800,
          lineHeight:    1,
          color:         hov ? feature.color : "rgba(var(--text-rgb), 0.07)",
          transition:    "color 0.25s",
          userSelect:    "none",
        }}
      >
        {feature.num}
      </div>

      {/* Text */}
      <div>
        <h3
          style={{
            fontSize:      "clamp(18px, 2.5vw, 26px)",
            fontWeight:    700,
            letterSpacing: "-0.02em",
            color:         "var(--text)",
            marginBottom:  8,
            lineHeight:    1.2,
          }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            fontSize:   14,
            color:      "rgba(var(--text-rgb), 0.38)",
            lineHeight: 1.75,
            maxWidth:   560,
          }}
        >
          {feature.desc}
        </p>
      </div>

      {/* Icon */}
      <div
        style={{
          width:          52,
          height:         52,
          borderRadius:   14,
          background:     hov
            ? `rgba(${feature.color === "#F5A623" ? "245,166,35" : feature.color === "#22C55E" ? "34,197,94" : feature.color === "#2B7FFF" ? "43,127,255" : "139,92,246"},0.12)`
            : "rgba(var(--border-rgb), 0.04)",
          border:         `1px solid ${hov ? `${feature.color}28` : "rgba(var(--border-rgb), 0.07)"}`,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          color:          hov ? feature.color : "rgba(var(--text-rgb), 0.3)",
          transition:     "all 0.22s",
          justifySelf:    "end",
        }}
      >
        {feature.icon}
      </div>
    </motion.div>
  );
}

export default function Features() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section id="features" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ marginBottom: 16 }} ref={ref}>
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
            // WHAT_YOU_GET
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.06, ease }}
            style={{
              fontSize:      "clamp(28px, 4vw, 44px)",
              fontWeight:    800,
              letterSpacing: "-0.03em",
              lineHeight:    1.1,
              color:         "var(--text)",
              maxWidth:      480,
            }}
          >
            Everything that makes a conversation feel real.
          </motion.h2>
        </div>

        {/* Feature strips */}
        <div style={{ marginTop: 32 }}>
          {FEATURES.map((f, i) => (
            <FeatureStrip key={f.num} feature={f} index={i} isInView={isInView} />
          ))}
          {/* Closing border */}
          <div style={{ borderTop: "1px solid rgba(245,166,35,0.07)" }} />
        </div>

      </div>
    </section>
  );
}
