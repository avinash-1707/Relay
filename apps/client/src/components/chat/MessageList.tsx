import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import MessageBubble from "./MessageBubble";
import type { Message } from "../../types";

interface Props {
  messages: Message[];
  currentUserId: string;
  participantName: string;
}

function DateDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0", margin: "12px 0" }}>
      <div
        style={{
          flex:       1,
          height:     1,
          background: "linear-gradient(90deg,transparent,rgba(245,166,35,0.07))",
        }}
      />
      <span
        style={{
          fontSize:     9,
          color:        "rgba(245,166,35,0.38)",
          letterSpacing: "0.16em",
          fontWeight:   700,
          fontFamily:   "monospace",
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex:       1,
          height:     1,
          background: "linear-gradient(90deg,rgba(245,166,35,0.07),transparent)",
        }}
      />
    </div>
  );
}

export default function MessageList({ messages, currentUserId }: Props) {
  const bottomRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="relay-scroll"
      style={{
        flex:          1,
        overflowY:     "auto",
        padding:       "20px 24px",
        display:       "flex",
        flexDirection: "column",
        gap:           3,
        background:    "transparent",
      }}
    >
      {/* E2E encrypted banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ duration: 0.4 }}
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            8,
          padding:        "6px 16px",
          borderRadius:   8,
          background:     "rgba(245,166,35,0.035)",
          border:         "1px solid rgba(245,166,35,0.09)",
          marginBottom:   16,
          alignSelf:      "center",
        }}
      >
        <svg width="10" height="10" fill="none" stroke="rgba(245,166,35,0.65)" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span
          style={{
            fontSize:     9,
            color:        "rgba(245,166,35,0.55)",
            letterSpacing: "0.12em",
            fontFamily:   "monospace",
          }}
        >
          E2E ENCRYPTED · SECURE CHANNEL
        </span>
      </motion.div>

      <DateDivider label="TODAY" />

      {messages.map((msg, i) => {
        const isOwn    = msg.senderId === currentUserId;
        const nextMsg  = messages[i + 1];
        const showTail = !nextMsg || nextMsg.senderId !== msg.senderId;
        const isLast   = i === messages.length - 1;

        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={isOwn}
            showTail={showTail}
            animate={isLast}
          />
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
