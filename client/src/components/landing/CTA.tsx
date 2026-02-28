import { motion } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function FinalCTA() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent overflow-hidden px-8 py-20 text-center">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-500/8 blur-[80px] pointer-events-none" />
          {/* Top line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold tracking-[0.15em] text-cyan-400 uppercase mb-4"
          >
            Get started today
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.55,
              delay: 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5 max-w-2xl mx-auto"
          >
            Ship real-time features this sprint.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-white/45 text-base max-w-md mx-auto mb-10"
          >
            Free tier includes 1M messages/month. No credit card required.
            Production-ready from day one.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <a
              href="#"
              className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-cyan-500/25"
            >
              Start for free
            </a>
            <a
              href="#"
              className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200 flex items-center gap-1.5"
            >
              Talk to sales
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
