"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, cubicBezier } from "motion/react";
import { api, AuthApiError, verifyOtp } from "@/lib/api";

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCESS_TOKEN_KEY = "relay_access_token";

const STARS = Array.from({ length: 50 }, (_, i) => ({
  left:     `${((i * 137.508 + 11) % 100).toFixed(2)}%`,
  top:      `${((i * 97.631 + 7) % 100).toFixed(2)}%`,
  size:     1 + (i % 3) * 0.7,
  delay:    `${(i * 0.41) % 5}s`,
  duration: `${2.5 + (i % 4)}s`,
}));

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: cubicBezier(0.22, 1, 0.36, 1), delay },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AuthApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Verification failed. Please try again.";
};

// ── Sub-components ────────────────────────────────────────────────────────────

function FormErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      style={{
        marginBottom: 20,
        borderRadius: 10,
        border:       "1px solid rgba(248,113,113,0.35)",
        background:   "rgba(248,113,113,0.08)",
        color:        "#fda4af",
        fontSize:     13,
        padding:      "10px 12px",
        lineHeight:   1.4,
      }}
    >
      {message}
    </motion.div>
  );
}

// ── OTP Input ─────────────────────────────────────────────────────────────────

function OtpInput({
  digits,
  onChange,
  disabled,
}: {
  digits: string[];
  onChange: (digits: string[]) => void;
  disabled: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [focused, setFocused] = useState<number | null>(null);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const v = value.slice(-1);
    const next = [...digits];
    next[index] = v;
    onChange(next);
    if (v && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) refs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;
    const next = [...digits];
    for (let i = 0; i < paste.length; i++) next[i] = paste[i];
    onChange(next);
    const focusIdx = Math.min(paste.length, 5);
    refs.current[focusIdx]?.focus();
  };

  return (
    <div
      style={{
        display:        "flex",
        gap:            10,
        justifyContent: "center",
      }}
      onPaste={handlePaste}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={() => setFocused(i)}
          onBlur={() => setFocused(null)}
          style={{
            width:        52,
            height:       64,
            borderRadius: 10,
            border:       `1px solid ${focused === i ? "rgba(245,166,35,0.5)" : digit ? "rgba(245,166,35,0.3)" : "rgba(245,166,35,0.15)"}`,
            background:   focused === i ? "rgba(245,166,35,0.06)" : digit ? "rgba(245,166,35,0.04)" : "rgba(255,255,255,0.02)",
            color:        "#F5A623",
            fontSize:     28,
            fontWeight:   700,
            textAlign:    "center",
            fontFamily:   "monospace",
            outline:      "none",
            cursor:       disabled ? "not-allowed" : "text",
            opacity:      disabled ? 0.5 : 1,
            transition:   "all 0.15s",
            boxShadow:    focused === i ? "0 0 0 3px rgba(245,166,35,0.1)" : digit ? "0 0 12px rgba(245,166,35,0.08)" : "none",
          }}
        />
      ))}
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────────────────────

function SuccessScreen() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: "center", padding: "64px 40px" }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        style={{
          width:          72,
          height:         72,
          borderRadius:   "50%",
          background:     "linear-gradient(135deg,rgba(245,166,35,0.15),rgba(217,119,6,0.15))",
          border:         "1px solid rgba(245,166,35,0.35)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          margin:         "0 auto 24px",
          boxShadow:      "0 0 30px rgba(245,166,35,0.12)",
        }}
      >
        <svg width="32" height="32" fill="none" stroke="#F5A623" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </motion.div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#F0F0F8", marginBottom: 10, letterSpacing: "-0.03em" }}>
        Verified!
      </h2>
      <p style={{ fontSize: 14, color: "rgba(240,240,248,0.4)" }}>
        Signing you in to your workspace...
      </p>
      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F5A623", boxShadow: "0 0 8px rgba(245,166,35,0.6)", animation: "pulse 1.2s infinite" }} />
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) router.replace("/login");
  }, [email, router]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const code = digits.join("");
      if (code.length < 6) {
        setError("Enter all 6 digits of your verification code.");
        return;
      }
      setError("");
      setLoading(true);
      try {
        const { accessToken } = await verifyOtp({ email, code });
        sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        setSuccess(true);
        setTimeout(() => router.push("/homepage"), 900);
      } catch (err) {
        setError(getErrorMessage(err));
        setLoading(false);
      }
    },
    [digits, email, router],
  );

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : "";

  return (
    <div
      style={{
        minHeight:      "100vh",
        background:     "var(--void)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontFamily:     "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        padding:        "24px",
        position:       "relative",
        overflow:       "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* CRT scanlines */}
      <div className="crt-overlay" />

      {/* Amber grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.022, pointerEvents: "none" }}>
        <defs>
          <pattern id="verify-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#F5A623" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#verify-grid)" />
      </svg>

      {/* Starfield */}
      {STARS.map((star, i) => (
        <div
          key={i}
          style={{
            position:       "absolute",
            left:           star.left,
            top:            star.top,
            width:          star.size,
            height:         star.size,
            borderRadius:   "50%",
            background:     "var(--text)",
            opacity:        0.35,
            animation:      `star-twinkle ${star.duration} ease-in-out infinite`,
            animationDelay: star.delay,
            pointerEvents:  "none",
          }}
        />
      ))}

      {/* Ambient glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "15%", left: "25%", width: 600, height: 450, borderRadius: "50%", background: "rgba(245,166,35,0.04)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "20%", width: 450, height: 380, borderRadius: "50%", background: "rgba(139,92,246,0.03)", filter: "blur(90px)" }} />
      </div>

      <div style={{ position: "relative", width: "100%", maxWidth: 440 }}>
        <AnimatePresence mode="wait">
          {success ? (
            <SuccessScreen key="success" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: cubicBezier(0.22, 1, 0.36, 1) }}
            >
              {/* Logo */}
              <motion.div
                {...fadeUp(0)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
                  <div
                    style={{
                      width:          38,
                      height:         38,
                      borderRadius:   12,
                      background:     "linear-gradient(145deg,#F5A623,#D97706)",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      boxShadow:      "0 0 22px rgba(245,166,35,0.4), 0 0 5px rgba(245,166,35,0.7)",
                      animation:      "amber-flicker 9s ease-in-out infinite",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L14.5 4.75V11.25L8 15L1.5 11.25V4.75L8 1Z" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" fill="rgba(255,255,255,0.18)" strokeLinejoin="round" />
                      <path d="M8 4.5L11.5 6.5V10L8 12L4.5 10V6.5L8 4.5Z" fill="rgba(255,255,255,0.65)" />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize:      18,
                      fontWeight:    800,
                      letterSpacing: "0.12em",
                      color:         "var(--text)",
                      fontFamily:    "'Geist Mono', monospace",
                      textTransform: "uppercase",
                    }}
                  >
                    RELAY
                  </span>
                </div>

                <div style={{ fontSize: 9, color: "rgba(245,166,35,0.5)", letterSpacing: "0.22em", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 12 }}>
                  RELAY // VERIFY IDENTITY
                </div>

                <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 8, textAlign: "center" }}>
                  Enter verification code
                </h1>
                <p style={{ fontSize: 14, color: "rgba(var(--text-rgb), 0.38)", textAlign: "center" }}>
                  A 6-digit code was sent to{" "}
                  <span style={{ color: "#F5A623", fontWeight: 500 }}>{maskedEmail}</span>
                </p>
              </motion.div>

              {/* Card */}
              <motion.div
                {...fadeUp(0.08)}
                style={{
                  borderRadius:   20,
                  border:         "1px solid rgba(245,166,35,0.1)",
                  background:     "rgba(var(--border-rgb), 0.025)",
                  backdropFilter: "blur(20px)",
                  padding:        "32px 32px",
                  position:       "relative",
                  overflow:       "hidden",
                }}
              >
                {/* Accent top strip */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#F5A623,#2B7FFF,#8B5CF6)" }} />

                <form onSubmit={handleSubmit} noValidate>
                  <AnimatePresence>
                    {error && <FormErrorBanner message={error} />}
                  </AnimatePresence>

                  <motion.div {...fadeUp(0.12)} style={{ marginBottom: 32 }}>
                    <OtpInput
                      digits={digits}
                      onChange={setDigits}
                      disabled={loading}
                    />
                  </motion.div>

                  <motion.button
                    {...fadeUp(0.18)}
                    type="submit"
                    disabled={loading || digits.join("").length < 6}
                    whileHover={!loading ? { opacity: 0.9 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    style={{
                      width:          "100%",
                      padding:        "13px 16px",
                      borderRadius:   10,
                      border:         "none",
                      background:     digits.join("").length < 6
                        ? "rgba(245,166,35,0.3)"
                        : "linear-gradient(145deg,#F5A623,#D97706)",
                      color:          "#060912",
                      fontSize:       14,
                      fontWeight:     700,
                      cursor:         loading ? "wait" : digits.join("").length < 6 ? "not-allowed" : "pointer",
                      fontFamily:     "inherit",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      gap:            10,
                      boxShadow:      digits.join("").length === 6 ? "0 4px 24px rgba(245,166,35,0.28)" : "none",
                      transition:     "all 0.2s",
                      outline:        "none",
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#060912", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        Verifying...
                      </>
                    ) : "Verify & sign in"}
                  </motion.button>
                </form>
              </motion.div>

              {/* Back to login */}
              <motion.p
                {...fadeUp(0.28)}
                style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "rgba(var(--text-rgb), 0.32)" }}
              >
                Wrong account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  style={{ background: "none", border: "none", color: "#F5A623", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", fontSize: 14, padding: 0 }}
                >
                  Back to sign in
                </button>
              </motion.p>

              {/* Expiry note */}
              <motion.p
                {...fadeUp(0.32)}
                style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "rgba(var(--text-rgb), 0.22)", fontFamily: "monospace", letterSpacing: "0.04em" }}
              >
                CODE EXPIRES IN 10 MINUTES
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--void)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 24, height: 24, border: "2px solid rgba(245,166,35,0.2)", borderTopColor: "#F5A623", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
