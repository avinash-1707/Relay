import { motion } from "motion/react";
import { useState, useRef, useEffect, useCallback } from "react";
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

/* ─── Attachment renderers ─────────────────────────────────────────────────── */

function ImageAttachment({ att }: { att: Attachment }) {
  return (
    <a href={att.url} target="_blank" rel="noreferrer" style={{ display: "block" }}>
      <img
        src={att.url}
        alt={att.fileName ?? "image"}
        style={{
          maxWidth:   "100%",
          maxHeight:  260,
          borderRadius: 10,
          display:    "block",
          objectFit:  "cover",
        }}
      />
    </a>
  );
}

/* ─── Deterministic waveform bars from URL seed ─────────────────────────── */

function seedBars(seed: string, count: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return Array.from({ length: count }, (_, i) => {
    h = (Math.imul(1664525, h) + 1013904223) | 0;
    const t = i / count;
    // bell-ish envelope so edges are quieter
    const env = Math.sin(Math.PI * t) * 0.55 + 0.45;
    return (((h >>> 0) / 0xffffffff) * 0.75 + 0.25) * env;
  });
}

function fmt(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function AudioAttachment({ att, isOwn }: { att: Attachment; isOwn: boolean }) {
  const [playing,  setPlaying]  = useState(false);
  const [current,  setCurrent]  = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef  = useRef<HTMLAudioElement>(null);
  const BAR_COUNT = 40;
  const bars      = useRef(seedBars(att.url, BAR_COUNT)).current;

  const accent = isOwn ? "#F5A623" : "#8B5CF6";
  const dimAlpha = isOwn ? "rgba(245,166,35,0.22)" : "rgba(139,92,246,0.22)";

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onMeta  = () => setDuration(el.duration || 0);
    const onTime  = () => setCurrent(el.currentTime);
    const onEnded = () => { setPlaying(false); setCurrent(0); };
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else         { el.play(); setPlaying(true); }
  }, [playing]);

  const seekTo = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * duration;
    setCurrent(el.currentTime);
  }, [duration]);

  const progress = duration > 0 ? current / duration : 0;
  const displayTime = playing || current > 0 ? fmt(current) : fmt(duration);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: 220, padding: "2px 0" }}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={att.url} preload="metadata" />

      {/* Play / Pause button */}
      <button
        onClick={togglePlay}
        style={{
          width:          42,
          height:         42,
          borderRadius:   "50%",
          border:         "none",
          background:     accent,
          color:          "#060912",
          cursor:         "pointer",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          flexShrink:     0,
          boxShadow:      `0 2px 12px ${accent}55`,
          transition:     "transform 0.12s, box-shadow 0.12s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.07)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      >
        {playing ? (
          /* Pause icon */
          <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
            <rect x="1.5" y="1" width="3.5" height="11" rx="1.2" />
            <rect x="8"   y="1" width="3.5" height="11" rx="1.2" />
          </svg>
        ) : (
          /* Play icon */
          <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
            <path d="M2.5 1.8l9 4.7-9 4.7V1.8z" />
          </svg>
        )}
      </button>

      {/* Waveform + time */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
        {/* Waveform bars */}
        <div
          onClick={seekTo}
          style={{
            display:     "flex",
            alignItems:  "center",
            gap:         2,
            height:      28,
            cursor:      "pointer",
            userSelect:  "none",
          }}
        >
          {bars.map((h, i) => {
            const barProgress = i / BAR_COUNT;
            const played = barProgress < progress;
            return (
              <div
                key={i}
                style={{
                  flex:         "0 0 2px",
                  borderRadius: 2,
                  height:       `${Math.round(h * 100)}%`,
                  background:   played ? accent : dimAlpha,
                  transition:   "background 0.08s",
                }}
              />
            );
          })}
        </div>

        {/* Time */}
        <span
          style={{
            fontSize:     9,
            fontFamily:   "monospace",
            letterSpacing: "0.04em",
            color:        isOwn ? "rgba(245,166,35,0.55)" : "rgba(var(--text-rgb), 0.35)",
            lineHeight:   1,
          }}
        >
          {displayTime}
        </span>
      </div>
    </div>
  );
}

function FileAttachment({ att, isOwn }: { att: Attachment; isOwn: boolean }) {
  const ext = att.fileName?.split(".").pop()?.toUpperCase() ?? "FILE";
  return (
    <a
      href={att.url}
      target="_blank"
      rel="noreferrer"
      download={att.fileName ?? true}
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            10,
        padding:        "8px 10px",
        borderRadius:   10,
        background:     isOwn ? "rgba(245,166,35,0.07)" : "rgba(var(--border-rgb), 0.04)",
        border:         `1px solid ${isOwn ? "rgba(245,166,35,0.14)" : "rgba(var(--border-rgb), 0.06)"}`,
        textDecoration: "none",
        color:          "inherit",
        transition:     "background 0.15s",
      }}
    >
      <div
        style={{
          width:          34,
          height:         34,
          borderRadius:   8,
          background:     isOwn
            ? "linear-gradient(145deg,rgba(245,166,35,0.18),rgba(217,119,6,0.18))"
            : "linear-gradient(145deg,rgba(139,92,246,0.14),rgba(43,127,255,0.14))",
          border:         `1px solid ${isOwn ? "rgba(245,166,35,0.28)" : "rgba(139,92,246,0.18)"}`,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       9,
          fontWeight:     800,
          color:          isOwn ? "#F5A623" : "#8B5CF6",
          flexShrink:     0,
          letterSpacing:  "0.02em",
          fontFamily:     "monospace",
        }}
      >
        {ext.slice(0, 4)}
      </div>

      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontSize:     12,
            color:        "rgba(var(--text-rgb), 0.85)",
            fontWeight:   500,
            whiteSpace:   "nowrap",
            overflow:     "hidden",
            textOverflow: "ellipsis",
            maxWidth:     160,
          }}
        >
          {att.fileName ?? "File"}
        </div>
        {att.fileSize && (
          <div style={{ fontSize: 10, color: "rgba(var(--text-rgb), 0.28)", fontFamily: "monospace" }}>
            {formatBytes(att.fileSize)}
          </div>
        )}
      </div>

      <svg
        width="13" height="13"
        fill="none" stroke="rgba(var(--text-rgb), 0.28)" strokeWidth="2" viewBox="0 0 24 24"
        style={{ marginLeft: "auto", flexShrink: 0 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    </a>
  );
}

function renderAttachment(att: Attachment, i: number, isOwn: boolean) {
  const mime = att.fileType ?? "";
  if (mime.startsWith("image/")) return <ImageAttachment key={i} att={att} />;
  if (mime.startsWith("audio/")) return <AudioAttachment key={i} att={att} isOwn={isOwn} />;
  return <FileAttachment key={i} att={att} isOwn={isOwn} />;
}

/* ─── Bubble ──────────────────────────────────────────────────────────────── */

export default function MessageBubble({ message, isOwn, showTail, animate = false }: Props) {
  const attachments:   Attachment[] = message.attachments ?? [];
  const hasText        = message.text.trim().length > 0;
  const hasAttachments = attachments.length > 0;
  const isDeleted      = message.text === "This message was deleted";
  const imageOnly      = hasAttachments && !hasText && attachments.every((a) => a.fileType?.startsWith("image/"));

  const base: React.CSSProperties = {
    maxWidth:     "clamp(240px, 72%, 560px)",
    padding:      imageOnly ? 4 : "9px 13px",
    borderRadius: 16,
    fontSize:     14,
    lineHeight:   1.55,
    wordBreak:    "break-word",
    position:     "relative",
    overflow:     imageOnly ? "hidden" : undefined,
  };

  /* Own: warm amber-blue gradient — arcade "sent" feel */
  const ownStyle: React.CSSProperties = {
    ...base,
    background: "linear-gradient(145deg,rgba(245,166,35,0.15),rgba(43,127,255,0.13))",
    border:     "1px solid rgba(245,166,35,0.22)",
    color:      "rgba(var(--text-rgb), 0.92)",
    borderBottomRightRadius: showTail ? 4 : 16,
    boxShadow:  animate
      ? "0 0 22px rgba(245,166,35,0.1), 0 4px 18px rgba(0,0,0,0.28)"
      : "0 2px 10px rgba(0,0,0,0.22)",
  };

  /* Theirs: cool dark glass with violet tint */
  const theirStyle: React.CSSProperties = {
    ...base,
    background: "rgba(var(--panel-rgb), 0.72)",
    border:     "1px solid rgba(139,92,246,0.11)",
    color:      "rgba(var(--text-rgb), 0.88)",
    borderBottomLeftRadius: showTail ? 4 : 16,
    boxShadow:  "0 2px 10px rgba(0,0,0,0.22)",
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
      <div style={isOwn ? ownStyle : theirStyle}>
        {hasAttachments && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, ...(hasText ? { marginBottom: 6 } : {}) }}>
            {attachments.map((att, i) => renderAttachment(att, i, isOwn))}
          </div>
        )}

        {hasText && (
          <span style={isDeleted ? { color: "rgba(var(--text-rgb), 0.22)", fontStyle: "italic" } : {}}>
            {message.text}
          </span>
        )}

        {/* Timestamp + status */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            4,
            justifyContent: "flex-end",
            marginTop:      4,
            opacity:        0.7,
          }}
        >
          <span style={{ fontSize: 10, color: "rgba(var(--text-rgb), 0.26)", fontFamily: "monospace" }}>
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
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1,  y: 0,  scale: 1    }}
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
