import { motion } from "motion/react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { Conversation } from "../../types";

interface Props {
  conversation: Conversation;
  currentUserId: string;
  onSend: (text: string) => void;
}

export default function ChatWindow({
  conversation,
  currentUserId,
  onSend,
}: Props) {
  return (
    <motion.div
      key={conversation.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Subtle background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.018,
          }}
        >
          <defs>
            <pattern
              id="chatgrid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chatgrid)" />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "60%",
            width: 400,
            height: 300,
            borderRadius: "50%",
            background: "rgba(34,211,238,0.02)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <ChatHeader participant={conversation.participant} />
        <MessageList
          messages={conversation.messages}
          currentUserId={currentUserId}
          participantName={conversation.participant.name}
        />
        <ChatInput
          onSend={onSend}
          participantName={conversation.participant.name.split(" ")[0]}
        />
      </div>
    </motion.div>
  );
}
