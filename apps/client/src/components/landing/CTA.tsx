"use client";

import { motion } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const ease = [0.22, 1, 0.36, 1] as const;

export default function FinalCTA() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section style={{ padding: "80px 24px 120px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }} ref={ref}>
        <div
          style={{
            position:     "relative",
            borderRadius: 28,
            border:       "1px solid rgba(245,166,35,0.16)",
            background:   "rgba(245,166,35,0.028)",
            overflow:     "hidden",
            padding:      "clamp(56px, 8vw, 96px) 32px",
            textAlign:    "center",
          }}
        >
          {/* Top iridescent accent line */}
          <div
            style={{
              position:   "absolute",
              top:        0,
              left:       0,
              right:      0,
              height:     1,
              background: "linear-gradient(90deg,transparent,rgba(245,166,35,0.55),rgba(43,127,255,0.3),transparent)",
            }}
          />

          {/* Central amber glow */}
          <div
            style={{
              position:      "absolute",
              top:           -100,
              left:          "50%",
              transform:     "translateX(-50%)",
              width:          700,
              height:         500,
              borderRadius:  "50%",
              background:    "radial-gradient(ellipse,rgba(245,166,35,0.07) 0%,rgba(43,127,255,0.03) 55%,transparent 70%)",
              filter:        "blur(50px)",
              pointerEvents: "none",
              animation:     "ambient-drift 14s ease-in-out infinite",
            }}
          />

          {/* Violet bottom left blob */}
          <div
            style={{
              position:      "absolute",
              bottom:        -80,
              left:          -80,
              width:          300,
              height:         300,
              borderRadius:  "50%",
              background:    "rgba(139,92,246,0.045)",
              filter:        "blur(70px)",
              pointerEvents: "none",
            }}
          />

          {/* CRT overlay */}
          <div className="crt-overlay" style={{ borderRadius: 28 }} />

          {/* Content */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            style={{
              fontSize:      10,
              fontFamily:    "monospace",
              letterSpacing: "0.22em",
              color:         "rgba(245,166,35,0.55)",
              textTransform: "uppercase",
              marginBottom:  22,
            }}
          >
            // START_TRANSMISSION
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.07, ease }}
            style={{
              fontSize:      "clamp(34px, 5.5vw, 62px)",
              fontWeight:    800,
              letterSpacing: "-0.038em",
              lineHeight:    1.06,
              color:         "var(--text)",
              maxWidth:      640,
              margin:        "0 auto 22px",
            }}
          >
            Start the
            <br />
            conversation.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.14, ease }}
            style={{
              fontSize:     15,
              color:        "rgba(var(--text-rgb), 0.36)",
              maxWidth:     400,
              margin:       "0 auto 44px",
              lineHeight:   1.8,
            }}
          >
            Sign up in seconds with your email or Google account. No credit card. No setup fee.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}
          >
            {/* Amber pill CTA */}
            <a
              href="/login"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            8,
                padding:        "14px 32px",
                borderRadius:   100,
                background:     "linear-gradient(145deg,#F5A623,#D97706)",
                color:          "#060912",
                fontSize:       14,
                fontWeight:     700,
                textDecoration: "none",
                boxShadow:      "0 4px 28px rgba(245,166,35,0.36)",
                letterSpacing:  "0.01em",
                transition:     "box-shadow 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow = "0 8px 44px rgba(245,166,35,0.55)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow = "0 4px 28px rgba(245,166,35,0.36)";
                el.style.transform = "translateY(0)";
              }}
            >
              Create your account
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </a>

            {/* Ghost pill */}
            <a
              href="/login"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            7,
                padding:        "14px 24px",
                borderRadius:   100,
                background:     "rgba(var(--border-rgb), 0.04)",
                border:         "1px solid rgba(var(--border-rgb), 0.09)",
                color:          "rgba(var(--text-rgb), 0.45)",
                fontSize:       14,
                textDecoration: "none",
                transition:     "all 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(245,166,35,0.2)";
                el.style.color = "rgba(var(--text-rgb), 0.75)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(var(--border-rgb), 0.09)";
                el.style.color = "rgba(var(--text-rgb), 0.45)";
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/>
              </svg>
              Continue with Google
            </a>
          </motion.div>

          {/* Bottom trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.32, ease }}
            style={{
              display:        "flex",
              justifyContent: "center",
              alignItems:     "center",
              gap:            28,
              marginTop:      48,
              paddingTop:     28,
              borderTop:      "1px solid rgba(245,166,35,0.06)",
              flexWrap:       "wrap",
            }}
          >
            {[
              "No credit card",
              "Free forever on the base plan",
              "Email verified accounts",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display:     "flex",
                  alignItems:  "center",
                  gap:         7,
                  fontSize:    11,
                  color:       "rgba(var(--text-rgb), 0.24)",
                  fontFamily:  "monospace",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "rgba(245,166,35,0.45)", fontSize: 9 }}>◈</span>
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
