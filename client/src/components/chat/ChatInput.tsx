"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onSend: (text: string) => void;
  participantName: string;
}

const EMOJI_SET = ["😊", "👍", "🔥", "🚀", "✅", "💯", "🎯", "⚡"];

export default function ChatInput({ onSend, participantName }: Props) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const attachButtons = [
    {
      title: "Attach file",
      icon: (
        <svg
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
          />
        </svg>
      ),
    },
    {
      title: "Send image",
      icon: (
        <svg
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      ),
    },
  ];

  const canSend = text.trim().length > 0;

  return (
    <div
      style={{
        padding: "12px 20px 16px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(13,17,23,0.95)",
        backdropFilter: "blur(12px)",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Emoji picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute",
              bottom: "100%",
              left: 20,
              marginBottom: 8,
              padding: "10px 12px",
              borderRadius: 12,
              background: "#161B22",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              gap: 6,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {EMOJI_SET.map((e) => (
              <button
                key={e}
                onClick={() => {
                  setText((t) => t + e);
                  setShowEmoji(false);
                  inputRef.current?.focus();
                }}
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 4,
                  borderRadius: 6,
                  transition: "background 0.1s",
                }}
                onMouseEnter={(ev) =>
                  (ev.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
                onMouseLeave={(ev) =>
                  (ev.currentTarget.style.background = "none")
                }
              >
                {e}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        {/* Left actions */}
        <div style={{ display: "flex", gap: 2, paddingBottom: 4 }}>
          <button
            onClick={() => setShowEmoji((s) => !s)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              border: "none",
              background: showEmoji ? "rgba(34,211,238,0.1)" : "transparent",
              color: showEmoji ? "#22d3ee" : "rgba(255,255,255,0.35)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>
          </button>
          {attachButtons.map((btn) => (
            <button
              key={btn.title}
              title={btn.title}
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                border: "none",
                background: "transparent",
                color: "rgba(255,255,255,0.35)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.35)";
              }}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Text area */}
        <div style={{ flex: 1, position: "relative" }}>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Message ${participantName}...`}
            rows={1}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "#fff",
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
              resize: "none",
              lineHeight: 1.5,
              maxHeight: 120,
              overflowY: "auto",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(34,211,238,0.3)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.08)")
            }
          />
        </div>

        {/* Send / Mic */}
        <div style={{ paddingBottom: 4 }}>
          <AnimatePresence mode="wait">
            {canSend ? (
              <motion.button
                key="send"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={handleSend}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg,#06b6d4,#2563eb)",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(6,182,212,0.3)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
