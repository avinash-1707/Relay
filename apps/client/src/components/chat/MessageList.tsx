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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "4px 0",
        margin: "8px 0",
      }}
    >
      <div
        style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }}
      />
      <span
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.06em",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <div
        style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }}
      />
    </div>
  );
}

export default function MessageList({
  messages,
  currentUserId,
  participantName,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="relay-scroll"
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        background: "transparent",
      }}
    >
      {/* Encrypted banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "8px 16px",
          borderRadius: 10,
          background: "rgba(34,211,238,0.04)",
          border: "1px solid rgba(34,211,238,0.1)",
          marginBottom: 16,
          alignSelf: "center",
        }}
      >
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
        <span
          style={{
            fontSize: 11,
            color: "rgba(34,211,238,0.7)",
            letterSpacing: "0.02em",
          }}
        >
          Messages are end-to-end encrypted
        </span>
      </motion.div>

      <DateDivider label="TODAY" />

      {messages.map((msg, i) => {
        const isOwn = msg.senderId === currentUserId;
        const nextMsg = messages[i + 1];
        const showTail = !nextMsg || nextMsg.senderId !== msg.senderId;
        const isLast = i === messages.length - 1;

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
