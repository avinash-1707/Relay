import { motion, cubicBezier } from "motion/react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: cubicBezier(0.22, 1, 0.36, 1), delay },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-blue-600/8 blur-[80px]" />
        {/* Grid lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
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

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        {/* Status badge */}
        <motion.div
          {...fadeUp(0)}
          className="inline-flex items-center gap-2 mb-8"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-xs text-cyan-400 font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Now in public beta — 200ms global latency
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.08)}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto"
        >
          Messaging at{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            the speed
          </span>
          <br />
          of the internet.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...fadeUp(0.15)}
          className="text-lg text-white/45 max-w-xl mx-auto leading-relaxed mb-10"
        >
          Relay is a real-time messaging infrastructure built for global scale.
          End-to-end encrypted, sub-200ms delivery, zero operational overhead.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.22)}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <a
            href="#"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-cyan-500/20"
          >
            Start building free
          </a>
          <a
            href="#"
            className="px-6 py-3 rounded-lg border border-white/10 text-white/70 text-sm font-medium hover:border-white/20 hover:text-white/90 transition-all duration-200 flex items-center gap-2"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM9.75 16.5v-9l6.5 4.5-6.5 4.5z" />
            </svg>
            Watch demo
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          {...fadeUp(0.3)}
          className="mt-16 flex items-center justify-center gap-8 flex-wrap"
        >
          {[
            { value: "10B+", label: "Messages daily" },
            { value: "99.99%", label: "Uptime SLA" },
            { value: "180+", label: "Countries" },
            { value: "<200ms", label: "P99 latency" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white tracking-tight">
                {value}
              </div>
              <div className="text-xs text-white/35 mt-0.5 tracking-wide">
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
