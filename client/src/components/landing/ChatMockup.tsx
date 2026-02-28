import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const messages = [
  {
    id: 1,
    text: "Hey! Did you get the file I sent?",
    from: "other",
    time: "10:42 AM",
  },
  {
    id: 2,
    text: "Just got it, looks great! 🔥",
    from: "me",
    time: "10:43 AM",
    read: true,
  },
  { id: 3, text: "Perfect. Deploying now...", from: "other", time: "10:43 AM" },
  {
    id: 4,
    text: "Let me know when it's live!",
    from: "me",
    time: "10:44 AM",
    read: true,
  },
];

export default function ChatMockup() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    messages.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 600 + i * 700));
    });
    timers.push(
      setTimeout(() => setShowTyping(true), 600 + messages.length * 700 + 400),
    );
    timers.push(
      setTimeout(
        () => {
          setShowTyping(false);
          setShowNew(true);
        },
        600 + messages.length * 700 + 2200,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-[360px]">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00E5CC]/10 to-[#0088FF]/10 blur-3xl rounded-3xl" />

      <div className="relative rounded-3xl border border-white/10 bg-[#0D1520]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/8 flex items-center gap-3 bg-white/[0.02]">
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00E5CC] to-[#0088FF] flex items-center justify-center font-bold text-sm text-[#080C14]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            A
          </div>
          <div>
            <div
              className="text-sm font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Alex Chen
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span
                className="text-xs text-emerald-400/80"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Online
              </span>
            </div>
          </div>
          <div className="ml-auto flex gap-3 text-white/30">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 1 8.18a2 2 0 0 1 1.99-2H6a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 12" />
            </svg>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-3 min-h-[320px]">
          <AnimatePresence>
            {messages.slice(0, visibleCount).map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] ${
                    msg.from === "me"
                      ? "bg-gradient-to-br from-[#00E5CC] to-[#0088FF] text-[#080C14]"
                      : "bg-white/8 text-white"
                  } rounded-2xl ${msg.from === "me" ? "rounded-br-sm" : "rounded-bl-sm"} px-4 py-2.5`}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {msg.text}
                  </p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 ${msg.from === "me" ? "text-[#080C14]/50" : "text-white/30"}`}
                  >
                    <span
                      className="text-[10px]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {msg.time}
                    </span>
                    {msg.from === "me" && msg.read && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M18 6L7 17l-4-4" />
                        <path d="M22 6l-9 11" opacity="0.6" />
                      </svg>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* New incoming message after loop */}
            {showNew && (
              <motion.div
                key="new"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-start"
              >
                <div className="bg-white/8 text-white rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[75%]">
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    It's live! 🚀 Relay deployed
                  </p>
                  <span
                    className="text-[10px] text-white/30 block text-right mt-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    10:45 AM
                  </span>
                </div>
              </motion.div>
            )}

            {/* Typing indicator */}
            {showTyping && !showNew && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="flex justify-start"
              >
                <div className="bg-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white/40"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/8 flex items-center gap-3">
          <div
            className="flex-1 bg-white/6 rounded-full px-4 py-2.5 text-white/25 text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Message Alex...
          </div>
          <button className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00E5CC] to-[#0088FF] flex items-center justify-center flex-shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#080C14"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
