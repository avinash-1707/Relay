import { motion } from "motion/react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { Conversation } from "../../types";
import type { ServerAttachment } from "../../lib/api";
import { useTyping } from "../../hooks/useTyping";

interface Props {
  conversation: Conversation;
  currentUserId: string;
  currentUserDisplayName: string;
  onSend: (text: string, messageType?: string, attachments?: ServerAttachment[]) => void;
  onBack?: () => void;
}

const WAVEFORM_ANIMS = ["waveform-a", "waveform-b", "waveform-c", "waveform-d"] as const;

export default function ChatWindow({
  conversation,
  currentUserId,
  currentUserDisplayName,
  onSend,
  onBack,
}: Props) {
  const { typingUsers, notifyTyping, stopTyping } = useTyping(
    conversation.id,
    currentUserDisplayName,
  );
  const typingNames = Object.values(typingUsers);

  return (
    <motion.div
      key={conversation.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{
        flex:          1,
        display:       "flex",
        flexDirection: "column",
        height:        "100dvh",
        overflow:      "hidden",
        position:      "relative",
        background:    "var(--void)",
      }}
    >
      {/* CRT scanlines */}
      <div className="crt-overlay" style={{ zIndex: 0 }} />

      {/* Amber-tinted grid */}
      <svg
        style={{
          position:      "absolute",
          inset:         0,
          width:         "100%",
          height:        "100%",
          opacity:       0.022,
          pointerEvents: "none",
          zIndex:        0,
        }}
      >
        <defs>
          <pattern id="cw-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#F5A623" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cw-grid)" />
      </svg>

      {/* Amber ambient blob — upper right */}
      <div
        style={{
          position:      "absolute",
          top:           "18%",
          left:          "58%",
          width:          520,
          height:         400,
          borderRadius:  "50%",
          background:    "rgba(245,166,35,0.014)",
          filter:        "blur(110px)",
          pointerEvents: "none",
          zIndex:        0,
          animation:     "ambient-drift 14s ease-in-out infinite",
        }}
      />

      {/* Violet ambient blob — lower left */}
      <div
        style={{
          position:      "absolute",
          bottom:        "15%",
          left:          "15%",
          width:          420,
          height:         320,
          borderRadius:  "50%",
          background:    "rgba(139,92,246,0.013)",
          filter:        "blur(100px)",
          pointerEvents: "none",
          zIndex:        0,
        }}
      />

      {/* Chat UI */}
      <div
        style={{
          position:      "relative",
          zIndex:        1,
          display:       "flex",
          flexDirection: "column",
          height:        "100%",
        }}
      >
        <ChatHeader participant={conversation.participant} onBack={onBack} />

        <MessageList
          messages={conversation.messages}
          currentUserId={currentUserId}
          participantName={conversation.participant.name}
        />

        {/* Waveform typing indicator */}
        {typingNames.length > 0 && (
          <div
            style={{
              padding:    "0 24px 8px",
              display:    "flex",
              alignItems: "center",
              gap:        10,
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 3, height: 22 }}>
              {WAVEFORM_ANIMS.map((anim, i) => (
                <div
                  key={i}
                  style={{
                    width:                   3,
                    borderRadius:            2,
                    background:              "#F5A623",
                    animationName:           anim,
                    animationDuration:       "1.3s",
                    animationTimingFunction: "ease-in-out",
                    animationIterationCount: "infinite",
                    animationDelay:          `${i * 0.1}s`,
                    height:                  4,
                    opacity:                 0.75,
                    alignSelf:               "center",
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize:     10,
                color:        "rgba(245,166,35,0.55)",
                fontFamily:   "monospace",
                letterSpacing: "0.06em",
              }}
            >
              {typingNames[0]} TRANSMITTING
            </span>
          </div>
        )}

        <ChatInput
          onSend={onSend}
          participantName={conversation.participant.name.split(" ")[0]}
          onTyping={notifyTyping}
          onStopTyping={stopTyping}
        />
      </div>
    </motion.div>
  );
}
