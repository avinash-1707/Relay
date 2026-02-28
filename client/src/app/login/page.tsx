"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence, cubicBezier } from "motion/react";

// ── Types ─────────────────────────────────────────────────────────────────────

type AuthMode = "login" | "register";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

// ── Animation helpers ─────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: cubicBezier(0.22, 1, 0.36, 1), delay },
});

// ── Sub-components ────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

interface FieldErrorProps {
  message?: string;
}

function FieldError({ message }: FieldErrorProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: 12,
            color: "#f87171",
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span>⚠</span> {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// ── Input style helper ────────────────────────────────────────────────────────

function getInputStyle(
  focused: boolean,
  hasError: boolean,
  paddingRight?: number,
): React.CSSProperties {
  return {
    width: "100%",
    padding: "12px 16px",
    paddingRight: paddingRight ?? 16,
    borderRadius: 10,
    border: `1px solid ${hasError ? "rgba(248,113,113,0.5)" : focused ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.08)"}`,
    background: focused ? "rgba(34,211,238,0.03)" : "rgba(255,255,255,0.03)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit",
    boxShadow: focused ? "0 0 0 3px rgba(34,211,238,0.08)" : "none",
  };
}

// ── Checkbox component ────────────────────────────────────────────────────────

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  error?: string;
}

function Checkbox({ checked, onChange, label, error }: CheckboxProps) {
  return (
    <div>
      <div
        onClick={onChange}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            marginTop: 1,
            borderRadius: 4,
            border: `1px solid ${error ? "rgba(248,113,113,0.5)" : checked ? "rgba(34,211,238,0.6)" : "rgba(255,255,255,0.15)"}`,
            background: checked
              ? "rgba(34,211,238,0.15)"
              : "rgba(255,255,255,0.04)",
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          {checked && (
            <svg
              width="10"
              height="10"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              viewBox="0 0 12 12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 6l3 3 5-5"
              />
            </svg>
          )}
        </div>
        <span
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.5,
          }}
        >
          {label}
        </span>
      </div>
      <FieldError message={error} />
    </div>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────────

interface LoginFormProps {
  onSuccess: () => void;
  onGoogleLoading: (v: boolean) => void;
  googleLoading: boolean;
}

function LoginForm({
  onSuccess,
  onGoogleLoading,
  googleLoading,
}: LoginFormProps) {
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ defaultValues: { rememberMe: false } });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (_data: LoginFormData) => {
    await new Promise((r) => setTimeout(r, 1500));
    onSuccess();
  };

  const handleGoogle = async () => {
    onGoogleLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    onGoogleLoading(false);
    onSuccess();
  };

  return (
    <>
      {/* Google Button */}
      <motion.button
        {...fadeUp(0.12)}
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || isSubmitting}
        whileHover={{ background: "rgba(255,255,255,0.07)" }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)",
          color: "rgba(255,255,255,0.85)",
          fontSize: 14,
          fontWeight: 500,
          cursor: googleLoading ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontFamily: "inherit",
          transition: "all 0.2s",
          marginBottom: 24,
          outline: "none",
        }}
      >
        {googleLoading ? (
          <div
            style={{
              width: 18,
              height: 18,
              border: "2px solid rgba(255,255,255,0.15)",
              borderTopColor: "#22d3ee",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
        ) : (
          <GoogleIcon />
        )}
        {googleLoading ? "Connecting..." : "Continue with Google"}
      </motion.button>

      <Divider />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: 4 }}
      >
        {/* Email */}
        <motion.div {...fadeUp(0.16)} style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email address</label>
          <input
            type="email"
            placeholder="you@company.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email",
              },
            })}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            style={getInputStyle(focused === "email", !!errors.email)}
          />
          <FieldError message={errors.email?.message} />
        </motion.div>

        {/* Password */}
        <motion.div {...fadeUp(0.2)} style={{ marginBottom: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <label style={labelStyle}>Password</label>
            <a
              href="#"
              style={{
                fontSize: 12,
                color: "#22d3ee",
                textDecoration: "none",
                opacity: 0.8,
              }}
            >
              Forgot password?
            </a>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              style={getInputStyle(
                focused === "password",
                !!errors.password,
                44,
              )}
            />
            <EyeToggle
              open={showPass}
              onToggle={() => setShowPass((v) => !v)}
            />
          </div>
          <FieldError message={errors.password?.message} />
        </motion.div>

        {/* Remember me */}
        <motion.div
          {...fadeUp(0.24)}
          style={{ marginBottom: 24, marginTop: 8 }}
        >
          <Checkbox
            checked={rememberMe}
            onChange={() => setValue("rememberMe", !rememberMe)}
            label="Keep me signed in"
          />
        </motion.div>

        <SubmitButton
          loading={isSubmitting}
          label="Sign in"
          loadingLabel="Signing in..."
        />
      </form>
    </>
  );
}

// ── Register Form ─────────────────────────────────────────────────────────────

interface RegisterFormProps {
  onSuccess: () => void;
  onGoogleLoading: (v: boolean) => void;
  googleLoading: boolean;
}

function RegisterForm({
  onSuccess,
  onGoogleLoading,
  googleLoading,
}: RegisterFormProps) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ defaultValues: { acceptTerms: false } });

  const acceptTerms = watch("acceptTerms");
  const password = watch("password");

  const onSubmit = async (_data: RegisterFormData) => {
    await new Promise((r) => setTimeout(r, 1500));
    onSuccess();
  };

  const handleGoogle = async () => {
    onGoogleLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    onGoogleLoading(false);
    onSuccess();
  };

  return (
    <>
      {/* Google Button */}
      <motion.button
        {...fadeUp(0.12)}
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || isSubmitting}
        whileHover={{ background: "rgba(255,255,255,0.07)" }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)",
          color: "rgba(255,255,255,0.85)",
          fontSize: 14,
          fontWeight: 500,
          cursor: googleLoading ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontFamily: "inherit",
          transition: "all 0.2s",
          marginBottom: 24,
          outline: "none",
        }}
      >
        {googleLoading ? (
          <div
            style={{
              width: 18,
              height: 18,
              border: "2px solid rgba(255,255,255,0.15)",
              borderTopColor: "#22d3ee",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
        ) : (
          <GoogleIcon />
        )}
        {googleLoading ? "Connecting..." : "Sign up with Google"}
      </motion.button>

      <Divider />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: 4 }}
      >
        {/* Full Name */}
        <motion.div {...fadeUp(0.14)} style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Full name</label>
          <input
            type="text"
            placeholder="Jane Smith"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "At least 2 characters" },
            })}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
            style={getInputStyle(focused === "name", !!errors.name)}
          />
          <FieldError message={errors.name?.message} />
        </motion.div>

        {/* Email */}
        <motion.div {...fadeUp(0.16)} style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email address</label>
          <input
            type="email"
            placeholder="you@company.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email",
              },
            })}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            style={getInputStyle(focused === "email", !!errors.email)}
          />
          <FieldError message={errors.email?.message} />
        </motion.div>

        {/* Password */}
        <motion.div {...fadeUp(0.2)} style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)/,
                  message: "Include an uppercase letter and a number",
                },
              })}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              style={getInputStyle(
                focused === "password",
                !!errors.password,
                44,
              )}
            />
            <EyeToggle
              open={showPass}
              onToggle={() => setShowPass((v) => !v)}
            />
          </div>
          <FieldError message={errors.password?.message} />
        </motion.div>

        {/* Confirm Password */}
        <motion.div {...fadeUp(0.22)} style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Confirm password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) => val === password || "Passwords do not match",
              })}
              onFocus={() => setFocused("confirmPassword")}
              onBlur={() => setFocused(null)}
              style={getInputStyle(
                focused === "confirmPassword",
                !!errors.confirmPassword,
                44,
              )}
            />
            <EyeToggle
              open={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
            />
          </div>
          <FieldError message={errors.confirmPassword?.message} />
        </motion.div>

        {/* Accept Terms */}
        <motion.div
          {...fadeUp(0.26)}
          style={{ marginBottom: 24, marginTop: 4 }}
        >
          <Checkbox
            checked={acceptTerms}
            onChange={() =>
              setValue("acceptTerms", !acceptTerms, { shouldValidate: true })
            }
            label={
              <>
                I agree to the{" "}
                <a
                  href="#"
                  style={{ color: "#22d3ee", textDecoration: "none" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  style={{ color: "#22d3ee", textDecoration: "none" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
              </>
            }
            error={errors.acceptTerms?.message}
          />
          {/* Hidden input to register acceptTerms with RHF validation */}
          <input
            type="checkbox"
            style={{ display: "none" }}
            {...register("acceptTerms", {
              validate: (v) => v || "You must accept the terms to continue",
            })}
          />
        </motion.div>

        <SubmitButton
          loading={isSubmitting}
          label="Create account"
          loadingLabel="Creating account..."
        />
      </form>
    </>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "rgba(255,255,255,0.55)",
  marginBottom: 8,
  letterSpacing: "0.01em",
};

function Divider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
      }}
    >
      <div
        style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}
      />
      <span
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.05em",
        }}
      >
        OR
      </span>
      <div
        style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}
      />
    </div>
  );
}

function EyeToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "absolute",
        right: 12,
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(255,255,255,0.3)",
        display: "flex",
        padding: 4,
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color =
          "rgba(255,255,255,0.7)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color =
          "rgba(255,255,255,0.3)")
      }
    >
      <EyeIcon open={open} />
    </button>
  );
}

function SubmitButton({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <motion.button
      {...fadeUp(0.28)}
      type="submit"
      disabled={loading}
      whileHover={!loading ? { opacity: 0.92 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
      style={{
        width: "100%",
        padding: "13px 16px",
        borderRadius: 10,
        border: "none",
        background: "linear-gradient(135deg,#06b6d4,#2563eb)",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: loading ? "wait" : "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        boxShadow: "0 4px 24px rgba(6,182,212,0.2)",
        transition: "opacity 0.2s",
        outline: "none",
      }}
    >
      {loading ? (
        <>
          <div
            style={{
              width: 16,
              height: 16,
              border: "2px solid rgba(255,255,255,0.25)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </motion.button>
  );
}

// ── Success Screen ────────────────────────────────────────────────────────────

function SuccessScreen({ mode }: { mode: AuthMode }) {
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
          width: 72,
          height: 72,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg,rgba(34,211,238,0.15),rgba(37,99,235,0.15))",
          border: "1px solid rgba(34,211,238,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
        }}
      >
        <svg
          width="32"
          height="32"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </motion.div>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 10,
          letterSpacing: "-0.03em",
        }}
      >
        {mode === "login" ? "Welcome back" : "Account created!"}
      </h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
        {mode === "login"
          ? "Redirecting to your workspace..."
          : "Setting up your workspace..."}
      </p>
      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#22d3ee",
            animation: "pulse 1.2s infinite",
          }}
        />
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function RelayAuth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [success, setSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setSuccess(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080B11",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #0D1117 inset !important;
          -webkit-text-fill-color: #fff !important;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Background glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "30%",
            width: 500,
            height: 400,
            borderRadius: "50%",
            background: "rgba(6,182,212,0.05)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "25%",
            width: 400,
            height: 350,
            borderRadius: "50%",
            background: "rgba(37,99,235,0.06)",
            filter: "blur(90px)",
          }}
        />
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.03,
          }}
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div style={{ position: "relative", width: "100%", maxWidth: 440 }}>
        <AnimatePresence mode="wait">
          {success ? (
            <SuccessScreen key="success" mode={mode} />
          ) : (
            <motion.div
              key={`form-${mode}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                duration: 0.3,
                ease: cubicBezier(0.22, 1, 0.36, 1),
              }}
            >
              {/* Logo */}
              <motion.div
                {...fadeUp(0)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: 40,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: "linear-gradient(135deg,#22d3ee,#2563eb)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7 L6 3 L12 7 L6 11 Z" fill="white" />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      color: "#fff",
                    }}
                  >
                    Relay
                  </span>
                </div>
                <h1
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-0.04em",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  {mode === "login"
                    ? "Sign in to your account"
                    : "Create your account"}
                </h1>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.38)",
                    textAlign: "center",
                  }}
                >
                  {mode === "login"
                    ? "Welcome back. Enter your credentials to continue."
                    : "Join thousands of teams using Relay."}
                </p>
              </motion.div>

              {/* Mode Toggle */}
              <motion.div
                {...fadeUp(0.06)}
                style={{
                  display: "flex",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 12,
                  padding: 4,
                  marginBottom: 24,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {(["login", "register"] as AuthMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    style={{
                      flex: 1,
                      padding: "9px 16px",
                      borderRadius: 9,
                      border: "none",
                      background:
                        mode === m ? "rgba(34,211,238,0.12)" : "transparent",
                      color: mode === m ? "#22d3ee" : "rgba(255,255,255,0.38)",
                      fontSize: 13,
                      fontWeight: mode === m ? 600 : 400,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                      boxShadow:
                        mode === m ? "0 0 0 1px rgba(34,211,238,0.2)" : "none",
                    }}
                  >
                    {m === "login" ? "Sign in" : "Register"}
                  </button>
                ))}
              </motion.div>

              {/* Card */}
              <motion.div
                {...fadeUp(0.08)}
                style={{
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.025)",
                  backdropFilter: "blur(20px)",
                  padding: "32px 32px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    background:
                      "linear-gradient(to right, transparent, rgba(34,211,238,0.3), transparent)",
                  }}
                />

                {mode === "login" ? (
                  <LoginForm
                    onSuccess={() => setSuccess(true)}
                    onGoogleLoading={setGoogleLoading}
                    googleLoading={googleLoading}
                  />
                ) : (
                  <RegisterForm
                    onSuccess={() => setSuccess(true)}
                    onGoogleLoading={setGoogleLoading}
                    googleLoading={googleLoading}
                  />
                )}
              </motion.div>

              {/* Footer link */}
              <motion.p
                {...fadeUp(0.34)}
                style={{
                  textAlign: "center",
                  marginTop: 24,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.32)",
                }}
              >
                {mode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("register")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#22d3ee",
                        textDecoration: "none",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: 14,
                        padding: 0,
                      }}
                    >
                      Create one free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#22d3ee",
                        textDecoration: "none",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: 14,
                        padding: 0,
                      }}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </motion.p>

              {/* Trust badges */}
              <motion.div
                {...fadeUp(0.4)}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 24,
                  marginTop: 32,
                }}
              >
                {[
                  { icon: "🔒", label: "SOC 2 Type II" },
                  { icon: "🛡", label: "E2E Encrypted" },
                  { icon: "⚡", label: "99.99% Uptime" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.22)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    <span style={{ fontSize: 12 }}>{icon}</span>
                    {label}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
