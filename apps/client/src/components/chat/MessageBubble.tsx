import { motion } from "motion/react";
import { MessageStatusIcon } from "../shared/StatusIcon";
import type { Message, Attachment } from "../../types";

interface Props {
  message: Message;
  isOwn: boolean;
  showTail: boolean;
  animate?: boolean;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Attachment renderers ─────────────────────────────────────────────────────

function ImageAttachment({ att }: { att: Attachment }) {
  return (
    <a href={att.url} target="_blank" rel="noreferrer" style={{ display: "block" }}>
      <img
        src={att.url}
        alt={att.fileName ?? "image"}
        style={{
          maxWidth: "100%",
          maxHeight: 260,
          borderRadius: 10,
          display: "block",
          objectFit: "cover",
        }}
      />
    </a>
  );
}

function AudioAttachment({ att }: { att: Attachment }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>🎙️</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
          {att.fileName ?? "Voice message"}
          {att.fileSize ? ` · ${formatBytes(att.fileSize)}` : ""}
        </span>
      </div>
      <audio
        controls
        src={att.url}
        style={{
          width: "100%",
          height: 32,
          accentColor: "#22d3ee",
        }}
      />
    </div>
  );
}

function FileAttachment({ att }: { att: Attachment }) {
  const ext = att.fileName?.split(".").pop()?.toUpperCase() ?? "FILE";
  return (
    <a
      href={att.url}
      target="_blank"
      rel="noreferrer"
      download={att.fileName ?? true}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        textDecoration: "none",
        color: "inherit",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.09)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)")
      }
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "linear-gradient(135deg,rgba(34,211,238,0.15),rgba(37,99,235,0.15))",
          border: "1px solid rgba(34,211,238,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          color: "#22d3ee",
          flexShrink: 0,
          letterSpacing: "0.02em",
        }}
      >
        {ext.slice(0, 4)}
      </div>
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.85)",
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 180,
          }}
        >
          {att.fileName ?? "File"}
        </div>
        {att.fileSize && (
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
            {formatBytes(att.fileSize)}
          </div>
        )}
      </div>
      <svg
        width="14"
        height="14"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        style={{ marginLeft: "auto", flexShrink: 0 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    </a>
  );
}

function renderAttachment(att: Attachment, i: number) {
  const mime = att.fileType ?? "";
  if (mime.startsWith("image/")) return <ImageAttachment key={i} att={att} />;
  if (mime.startsWith("audio/")) return <AudioAttachment key={i} att={att} />;
  return <FileAttachment key={i} att={att} />;
}

// ─── Bubble ───────────────────────────────────────────────────────────────────

export default function MessageBubble({
  message,
  isOwn,
  showTail,
  animate = false,
}: Props) {
  const attachments: Attachment[] = message.attachments ?? [];
  const hasText = message.text.trim().length > 0;
  const hasAttachments = attachments.length > 0;
  const isDeleted = message.text === "This message was deleted";

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
    background: "linear-gradient(135deg,rgba(6,182,212,0.22),rgba(37,99,235,0.22))",
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

  // Image-only messages get tighter padding
  const imageOnly = hasAttachments && !hasText && attachments.every((a) => a.fileType?.startsWith("image/"));

  const bubbleStyle: React.CSSProperties = {
    ...(isOwn ? ownStyle : theirStyle),
    ...(imageOnly ? { padding: 4, overflow: "hidden" } : {}),
  };

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isOwn ? "flex-end" : "flex-start",
      }}
    >
      <div style={bubbleStyle}>
        {/* Attachments */}
        {hasAttachments && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, ...(hasText ? { marginBottom: 6 } : {}) }}>
            {attachments.map((att, i) => renderAttachment(att, i))}
          </div>
        )}

        {/* Text */}
        {hasText && (
          <span style={isDeleted ? { color: "rgba(255,255,255,0.3)", fontStyle: "italic" } : {}}>
            {message.text}
          </span>
        )}

        {/* Timestamp + status */}
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
        style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start" }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start" }}>
      {content}
    </div>
  );
}
