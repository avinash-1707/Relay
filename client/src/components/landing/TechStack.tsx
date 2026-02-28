import { motion } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const stack = [
  {
    name: "WebSocket",
    color: "from-blue-500/20 to-blue-600/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    name: "gRPC",
    color: "from-cyan-500/20 to-cyan-600/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  {
    name: "Kafka",
    color: "from-orange-500/20 to-orange-600/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
  },
  {
    name: "Redis",
    color: "from-red-500/20 to-red-600/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  {
    name: "PostgreSQL",
    color: "from-sky-500/20 to-sky-600/10",
    text: "text-sky-400",
    border: "border-sky-500/20",
  },
  {
    name: "Kubernetes",
    color: "from-blue-500/20 to-indigo-600/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    name: "Cloudflare",
    color: "from-amber-500/20 to-orange-600/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  {
    name: "Rust core",
    color: "from-rose-500/20 to-rose-600/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
  },
];

export default function TechStack() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold tracking-[0.15em] text-cyan-400 uppercase mb-3"
            >
              Built to scale
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-5"
            >
              Infrastructure you'd build yourself. Already built.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/45 text-base leading-relaxed"
            >
              Relay's core is written in Rust for predictable, low-latency
              performance. The message broker layer uses Kafka for durability,
              while Redis keeps presence state at microsecond speed. Kubernetes
              handles elastic scaling across regions — automatically.
            </motion.p>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              {[
                { value: "1M+", label: "Concurrent connections per node" },
                { value: "45+", label: "Global edge regions" },
                { value: "0ms", label: "Cold start (always-warm)" },
                { value: "SOC 2", label: "Type II certified" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="text-xl font-bold text-white mb-1">
                    {value}
                  </div>
                  <div className="text-xs text-white/40 leading-snug">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: stack badges */}
          <div>
            <div className="flex flex-wrap gap-3">
              {stack.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  className={`px-4 py-2.5 rounded-lg border ${item.border} bg-gradient-to-br ${item.color} ${item.text} text-sm font-medium tracking-wide`}
                >
                  {item.name}
                </motion.div>
              ))}
            </div>

            {/* Architecture note */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 p-5 rounded-xl bg-white/[0.025] border border-white/[0.06]"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
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
                      d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white mb-1">
                    Open telemetry built in
                  </div>
                  <div className="text-xs text-white/40 leading-relaxed">
                    Every message carries trace context. Plug into your existing
                    Datadog, Grafana, or Honeycomb setup in minutes.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
