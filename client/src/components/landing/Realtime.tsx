import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const messages = [
  {
    id: 1,
    from: "them",
    name: "Sena",
    text: "Deployment went out. All green ✓",
    time: "09:41",
    delay: 0,
  },
  {
    id: 2,
    from: "me",
    text: "Latency looking solid — P99 at 140ms",
    time: "09:41",
    delay: 600,
  },
  {
    id: 3,
    from: "them",
    name: "Sena",
    text: "Relay handled 2M events in the last hour",
    time: "09:42",
    delay: 1400,
  },
  {
    id: 4,
    from: "me",
    text: "Zero drops. That's what I like to see.",
    time: "09:42",
    delay: 2200,
  },
  {
    id: 5,
    from: "them",
    name: "Sena",
    text: "Spinning up the Singapore node now 🌏",
    time: "09:43",
    delay: 3100,
  },
];

function ChatBubble({
  msg,
  visible,
}: {
  msg: (typeof messages)[0];
  visible: boolean;
}) {
  const isMe = msg.from === "me";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
    >
      {!isMe && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
          {msg.name?.[0]}
        </div>
      )}
      <div
        className={`max-w-[78%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}
      >
        <div
          className={`px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed ${
            isMe
              ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-sm"
              : "bg-white/8 text-white/85 rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-white/25 px-1">{msg.time}</span>
      </div>
    </motion.div>
  );
}

function MockChat() {
  const [visibleCount, setVisibleCount] = useState(0);
  const { ref, isInView } = useScrollReveal();

  useEffect(() => {
    if (!isInView) return;
    let cancelled = false;
    messages.forEach((msg, i) => {
      setTimeout(() => {
        if (!cancelled) setVisibleCount(i + 1);
      }, msg.delay);
    });
    return () => {
      cancelled = true;
    };
  }, [isInView]);

  return (
    <div ref={ref} className="relative">
      {/* Window chrome */}
      <div className="rounded-2xl border border-white/10 bg-[#0D1117] overflow-hidden shadow-2xl shadow-black/50">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-white/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              relay-team · 3 members
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="p-5 flex flex-col gap-4 min-h-[280px]">
          {messages.map((msg, i) => (
            <ChatBubble key={msg.id} msg={msg} visible={i < visibleCount} />
          ))}

          {/* Typing indicator */}
          {visibleCount >= messages.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex-shrink-0" />
              <div className="flex items-center gap-1 px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white/8">
                {[0, 0.15, 0.3].map((d) => (
                  <motion.span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-white/40"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Input bar */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <span className="text-sm text-white/20 flex-1">
              Reply to team...
            </span>
            <svg
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="text-cyan-400"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Latency badge */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute -right-5 -bottom-5 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-xs font-mono text-green-400"
      >
        ↓ 128ms · NYC → SGP
      </motion.div>
    </div>
  );
}

export default function RealTime() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: explanation */}
          <div ref={ref}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold tracking-[0.15em] text-cyan-400 uppercase mb-3"
            >
              Real-time experience
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-5"
            >
              Delivery that feels instant. Because it is.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-white/45 text-base leading-relaxed mb-10"
            >
              Relay's architecture prioritizes low-latency over everything.
              WebSocket connections are maintained at the edge, with intelligent
              routing ensuring the shortest network path.
            </motion.p>

            {/* Callouts */}
            <div className="flex flex-col gap-5">
              {[
                {
                  label: "Persistent connections",
                  desc: "Long-lived WebSocket sessions at every edge node.",
                },
                {
                  label: "Optimistic delivery",
                  desc: "Messages rendered locally before server confirmation.",
                },
                {
                  label: "Conflict-free sync",
                  desc: "CRDT-based state ensures consistency without locking.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.18 + i * 0.07 }}
                  className="flex gap-4"
                >
                  <div className="w-5 h-5 rounded-full bg-cyan-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-sm text-white/40">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: mock chat */}
          <div className="relative lg:pl-4">
            <MockChat />
          </div>
        </div>
      </div>
    </section>
  );
}
