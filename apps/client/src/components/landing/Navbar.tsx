"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

/* Links scroll to real sections on the landing page via anchor IDs */
const NAV_LINKS = [
  { label: "Features",     href: "#features"    },
  { label: "How it works", href: "#how-it-works" },
] as const;

function NavPill({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding:        "6px 14px",
        borderRadius:   100,
        fontSize:       13,
        fontWeight:     500,
        color:          hov ? "rgba(var(--text-rgb), 0.9)" : "rgba(var(--text-rgb), 0.45)",
        textDecoration: "none",
        background:     hov ? "rgba(245,166,35,0.08)" : "transparent",
        transition:     "all 0.18s",
        letterSpacing:  "0.01em",
        whiteSpace:     "nowrap",
      }}
    >
      {label}
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    /* Ghost full-width wrapper — clicks fall through to page */
    <div
      style={{
        position:       "fixed",
        top:            0,
        left:           0,
        right:          0,
        zIndex:         100,
        display:        "flex",
        justifyContent: "center",
        padding:        "18px 24px",
        pointerEvents:  "none",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.94 }}
        animate={{ opacity: 1, y: 0,   scale: 1    }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          pointerEvents:        "all",
          display:              "flex",
          alignItems:           "center",
          padding:              "7px 7px 7px 18px",
          borderRadius:         100,
          background:           scrolled ? "rgba(var(--void-rgb), 0.92)"  : "rgba(var(--void-rgb), 0.68)",
          backdropFilter:       "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border:               scrolled
            ? "1px solid rgba(245,166,35,0.18)"
            : "1px solid rgba(var(--border-rgb), 0.08)",
          boxShadow:            scrolled
            ? "0 8px 40px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(245,166,35,0.04)"
            : "0 4px 24px rgba(0,0,0,0.4)",
          gap:                  4,
          maxWidth:             "calc(100vw - 48px)",
          transition:           "all 0.3s ease",
        }}
      >
        {/* Logo + wordmark */}
        <Link
          href="/"
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            8,
            paddingRight:   14,
            marginRight:    4,
            borderRight:    "1px solid rgba(var(--border-rgb), 0.07)",
            flexShrink:     0,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width:          28,
              height:         28,
              borderRadius:   8,
              background:     "linear-gradient(145deg,#F5A623,#D97706)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              boxShadow:      "0 0 14px rgba(245,166,35,0.35)",
              flexShrink:     0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L14.5 4.75V11.25L8 15L1.5 11.25V4.75L8 1Z"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1.3"
                fill="rgba(255,255,255,0.2)"
                strokeLinejoin="round"
              />
              <path d="M8 4.5L11.5 6.5V10L8 12L4.5 10V6.5L8 4.5Z" fill="rgba(255,255,255,0.7)" />
            </svg>
          </div>
          <span
            style={{
              fontSize:      13,
              fontWeight:    800,
              color:         "var(--text)",
              letterSpacing: "0.1em",
              fontFamily:    "'Geist Mono', monospace",
              textTransform: "uppercase",
            }}
          >
            RELAY
          </span>
        </Link>

        {/* Anchor nav pills */}
        <nav style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {NAV_LINKS.map((item) => (
            <NavPill key={item.label} label={item.label} href={item.href} />
          ))}
        </nav>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: "rgba(var(--border-rgb), 0.07)", margin: "0 6px", flexShrink: 0 }} />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: "rgba(var(--border-rgb), 0.07)", margin: "0 6px", flexShrink: 0 }} />

        {/* Sign in */}
        <Link
          href="/login"
          style={{
            padding:        "6px 14px",
            borderRadius:   100,
            fontSize:       13,
            color:          "rgba(var(--text-rgb), 0.45)",
            textDecoration: "none",
            transition:     "color 0.18s",
            letterSpacing:  "0.01em",
            whiteSpace:     "nowrap",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(var(--text-rgb), 0.82)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(var(--text-rgb), 0.45)")}
        >
          Sign in
        </Link>

        {/* Get started */}
        <Link
          href="/login"
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            6,
            padding:        "8px 18px",
            borderRadius:   100,
            background:     "linear-gradient(145deg,#F5A623,#D97706)",
            color:          "#060912",
            fontSize:       13,
            fontWeight:     700,
            textDecoration: "none",
            boxShadow:      "0 2px 14px rgba(245,166,35,0.3)",
            letterSpacing:  "0.01em",
            transition:     "box-shadow 0.2s, transform 0.15s",
            whiteSpace:     "nowrap",
            flexShrink:     0,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.boxShadow = "0 4px 22px rgba(245,166,35,0.52)";
            el.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.boxShadow = "0 2px 14px rgba(245,166,35,0.3)";
            el.style.transform = "translateY(0)";
          }}
        >
          Get started
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}
