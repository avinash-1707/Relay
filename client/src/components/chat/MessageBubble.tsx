import { motion } from "framer-motion";
import { MessageStatusIcon } from "../shared/StatusIcon";
import type { Message } from "../../types";

interface Props {
  message: Message;
  isOwn: boolean;
  showTail: boolean;
  animate?: boolean;
}

export default function MessageBubble({
  message,
  isOwn,
  showTail,
  animate = false,
}: Props) {
  const base: React.CSSProperties = {
    maxWidth: "62%",
    padding: "9px 13px",
    borderRadius: 16,
    fontSize: 14,
    lineHeight: 1.55,
    wordBreak: "break-word",
    position: "relative",
  };

  const ownStyle: React.CSSProperties = {
    ...base,
    background:
      "linear-gradient(135deg,rgba(6,182,212,0.22),rgba(37,99,235,0.22))",
    border: "1px solid rgba(34,211,238,0.15)",
    color: "rgba(255,255,255,0.92)",
    borderBottomRightRadius: showTail ? 4 : 16,
  };

  const theirStyle: React.CSSProperties = {
    ...base,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.07)",
    color: "rgba(255,255,255,0.88)",
    borderBottomLeftRadius: showTail ? 4 : 16,
  };

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isOwn ? "flex-end" : "flex-start",
      }}
    >
      <div style={isOwn ? ownStyle : theirStyle}>
        <span>{message.text}</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            justifyContent: "flex-end",
            marginTop: 4,
            opacity: 0.7,
          }}
        >
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
            {message.timestamp}
          </span>
          {isOwn && <MessageStatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          justifyContent: isOwn ? "flex-end" : "flex-start",
        }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
      }}
    >
      {content}
    </div>
  );
}
