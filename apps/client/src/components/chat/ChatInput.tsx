"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { uploadFile } from "@/lib/api";
import type { ServerAttachment } from "@/lib/api";

interface Props {
  onSend: (text: string, messageType?: string, attachments?: ServerAttachment[]) => void;
  participantName: string;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

/* ─── Emoji data ─────────────────────────────────────────────────────────── */

const EMOJI_CATEGORIES: { label: string; icon: string; emojis: string[] }[] = [
  {
    label: "Smileys", icon: "😀",
    emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","🫠","😉","😊","😇","🥰","😍","🤩","😘","😗","☺️","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🫡","🤭","🫢","🫣","🤫","🤔","🫤","🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","😮‍💨","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳","🥺","🥹","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"],
  },
  {
    label: "People", icon: "👋",
    emojis: ["👋","🤚","🖐️","✋","🖖","🫱","🫲","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🦷","🦴","👀","👁️","👅","👄","💋","🧑","👶","🧒","👦","👧","👱","👨","🧔","👩","🧓","👴","👵","🙍","🙎","🙅","🙆","💁","🙋","🧏","🙇","🤦","🤷","💆","💇","🚶","🧍","🧎","🏃","💃","🕺"],
  },
  {
    label: "Animals", icon: "🐶",
    emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐻‍❄️","🐨","🐯","🦁","🐮","🐷","🐽","🐸","🐵","🙈","🙉","🙊","🐒","🦆","🐧","🐦","🐤","🦅","🦉","🦇","🐝","🪱","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷️","🦂","🐢","🐍","🦎","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦣","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🦬","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐈","🐈‍⬛","🐓","🦃","🦤","🦚","🦜","🦢","🦩","🕊️","🐇","🦝","🦨","🦡","🦫","🦦","🦥","🐁","🐀","🐿️","🦔"],
  },
  {
    label: "Food", icon: "🍕",
    emojis: ["🍇","🍈","🍉","🍊","🍋","🍌","🍍","🥭","🍎","🍏","🍐","🍑","🍒","🍓","🫐","🥝","🍅","🫒","🥥","🥑","🍆","🥔","🥕","🌽","🌶️","🫑","🥒","🥬","🥦","🧄","🧅","🍄","🥜","🫘","🌰","🍞","🥐","🥖","🫓","🥨","🥯","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🫔","🌮","🌯","🥙","🧆","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🦪","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","☕","🫖","🍵","🍶","🍾","🍷","🍸","🍹","🍺","🍻","🥂","🥃","🫗","🥤","🧋","🧃","🧉","🧊"],
  },
  {
    label: "Activity", icon: "⚽",
    emojis: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🏑","🥍","🏏","🪃","🥅","⛳","🪁","🛝","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","🥌","🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","⛹️","🤺","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🏆","🥇","🥈","🥉","🏅","🎖️","🏵️","🎗️","🎫","🎟️","🎪","🤹","🎭","🩰","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🪘","🎷","🎺","🪗","🎸","🪕","🎻","🪈","🎲","♟️","🎯","🎳","🪃","🎮","🎰","🧩","🪄","🎭","🖼️","🧸","🎊","🎉","🎀","🎁"],
  },
  {
    label: "Objects", icon: "💡",
    emojis: ["⌚","📱","📲","💻","⌨️","🖥️","🖨️","🖱️","🖲️","💽","💾","💿","📀","🧮","📷","📸","📹","🎥","📞","☎️","📺","📻","🧭","⏱️","⏲️","⏰","🕰️","⌛","⏳","📡","🔋","🪫","🔌","💡","🔦","🕯️","🪔","🧯","💰","🪙","💴","💵","💶","💷","💸","💳","💹","📧","📨","📩","📝","📁","📂","📅","📆","📌","📍","📏","📐","✂️","🔒","🔓","🔑","🗝️","🔨","⚒️","🛠️","🔧","🔩","⚙️","🔗","⛓️","🧲","🪜","🛏️","🛋️","🪑","🚽","🚿","🛁","🧴","🧷","🧹","🧺","🧻","🧼","🧽","🔮","💎","🧿","🪬","🗿","🪄","🎎","🧸","🪆","🖼️","🪞","🪟","🛒","🪴","🧳"],
  },
  {
    label: "Symbols", icon: "❤️",
    emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉️","✡️","🔯","☯️","☦️","🛐","⛎","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","🆔","⚛️","🉑","☢️","☣️","📴","📳","🈶","🈚","🈸","🈺","🈷️","✴️","🆚","🅰️","🅱️","🆎","🆑","🅾️","🆘","❌","⭕","🛑","⛔","📛","🚫","💯","💢","♨️","🚫","✅","🈯","💹","❎","🌐","💠","Ⓜ️","🌀","💤","🏧","🚾","♿","🅿️","🛗","🈳","🈂️","🚹","🚺","🚼","⚧️","🚻","🚮","🎦","📶","🈁","🔣","ℹ️","🔤","🔡","🔠","🆖","🆗","🆙","🆒","🆕","🆓","🔟","🔢","#️⃣","*️⃣","⏏️","▶️","⏸️","⏹️","⏺️","⏭️","⏮️","⏩","⏪","⏫","⏬","◀️","🔼","🔽","➡️","⬅️","⬆️","⬇️","↗️","↘️","↙️","↖️","↕️","↔️","↩️","↪️","⤴️","⤵️","🔀","🔁","🔂","🔄","🔃","🎵","🎶","➕","➖","➗","✖️","♾️","💲","💱","™️","©️","®️","〰️","➰","➿","✔️","☑️","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪","🟤","🔺","🔻","🔷","🔶","🔹","🔸","🔲","🔳","▪️","▫️","◾","◽","◼️","◻️","🟥","🟧","🟨","🟩","🟦","🟪","⬛","⬜","🟫","🔈","🔇","🔉","🔊","🔔","🔕","📣","📢","💬","💭","🗯️","♠️","♣️","♥️","♦️","🃏","🎴","🀄","🎭","🎨"],
  },
];

/* ─── Pending attachment ─────────────────────────────────────────────────── */

interface PendingAttachment {
  file: File;
  previewUrl: string | null;
  uploading: boolean;
  uploaded: ServerAttachment | null;
  error: string | null;
}

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ChatInput({ onSend, participantName, onTyping, onStopTyping }: Props) {
  const [text,              setText]              = useState("");
  const [showEmoji,         setShowEmoji]         = useState(false);
  const [emojiTab,          setEmojiTab]          = useState(0);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [recording,         setRecording]         = useState(false);
  const [recordingSeconds,  setRecordingSeconds]  = useState(0);
  const [inputFocused,      setInputFocused]      = useState(false);

  const inputRef         = useRef<HTMLTextAreaElement>(null);
  const imageInputRef    = useRef<HTMLInputElement>(null);
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { pendingAttachments.forEach((a) => { if (a.previewUrl) URL.revokeObjectURL(a.previewUrl); }); };
  }, []);

  function addFile(file: File) {
    const isImage    = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : null;
    const pending: PendingAttachment = { file, previewUrl, uploading: true, uploaded: null, error: null };
    setPendingAttachments((prev) => [...prev, pending]);
    uploadFile(file)
      .then((att) => setPendingAttachments((prev) => prev.map((p) => p.file === file ? { ...p, uploading: false, uploaded: att } : p)))
      .catch(() =>  setPendingAttachments((prev) => prev.map((p) => p.file === file ? { ...p, uploading: false, error: "Upload failed" } : p)));
  }

  function removeAttachment(index: number) {
    setPendingAttachments((prev) => {
      const removed = prev[index];
      if (removed.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  const readyAttachments = pendingAttachments.filter((a) => a.uploaded);
  const stillUploading   = pendingAttachments.some((a) => a.uploading);

  const handleSend = () => {
    if (stillUploading) return;
    const hasText  = text.trim().length > 0;
    const hasFiles = readyAttachments.length > 0;
    if (!hasText && !hasFiles) return;

    const attachments = readyAttachments.map((a) => a.uploaded!);
    let messageType = "text";
    if (attachments.length > 0) {
      const mime = attachments[0].fileType;
      if      (mime.startsWith("image/")) messageType = "image";
      else if (mime.startsWith("audio/")) messageType = "audio";
      else                                messageType = "file";
    }
    onStopTyping?.();
    onSend(text.trim(), messageType, attachments.length > 0 ? attachments : undefined);
    setText("");
    setPendingAttachments([]);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  async function startRecording() {
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        addFile(new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" }));
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch { alert("Microphone access denied."); }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setRecording(false);
      if (recordingTimerRef.current) { clearInterval(recordingTimerRef.current); recordingTimerRef.current = null; }
    }
  }

  const canSend = !stillUploading && (text.trim().length > 0 || readyAttachments.length > 0);

  return (
    <div
      style={{
        padding:        "12px 20px 16px",
        borderTop:      "1px solid rgba(245,166,35,0.08)",
        background:     "rgba(var(--space-rgb), 0.92)",
        backdropFilter: "blur(22px)",
        flexShrink:     0,
        position:       "relative",
      }}
    >
      {/* Top iridescent line */}
      <div
        style={{
          position:  "absolute",
          top:       0,
          left:      0,
          right:     0,
          height:    1,
          background: "linear-gradient(90deg,transparent 0%,rgba(245,166,35,0.18) 40%,rgba(43,127,255,0.12) 70%,transparent 100%)",
        }}
      />

      {/* Hidden file inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) addFile(f); e.target.value = ""; }} />
      <input ref={fileInputRef}  type="file"                style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) addFile(f); e.target.value = ""; }} />

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            style={{
              position:    "absolute",
              bottom:      "100%",
              left:        20,
              marginBottom: 8,
              width:       324,
              borderRadius: 14,
              background:  "var(--panel)",
              border:      "1px solid rgba(245,166,35,0.14)",
              boxShadow:   "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4)",
              overflow:    "hidden",
            }}
          >
            {/* Accent strip */}
            <div style={{ height: 2, background: "linear-gradient(90deg,#F5A623,#2B7FFF,#8B5CF6)" }} />

            {/* Category tabs */}
            <div style={{ display: "flex", padding: "5px 6px 0", gap: 1, borderBottom: "1px solid rgba(var(--border-rgb), 0.05)" }}>
              {EMOJI_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.label}
                  onClick={() => setEmojiTab(i)}
                  title={cat.label}
                  style={{
                    flex:        1,
                    padding:     "5px 2px",
                    borderRadius: "5px 5px 0 0",
                    border:      "none",
                    background:  emojiTab === i ? "rgba(245,166,35,0.1)" : "transparent",
                    fontSize:    15,
                    cursor:      "pointer",
                    fontFamily:  "inherit",
                    borderBottom: emojiTab === i ? "2px solid #F5A623" : "2px solid transparent",
                    transition:  "all 0.15s",
                    opacity:     emojiTab === i ? 1 : 0.42,
                    lineHeight:  1,
                  }}
                >
                  {cat.icon}
                </button>
              ))}
            </div>

            {/* Emoji grid */}
            <div
              className="relay-scroll"
              style={{ padding: "8px", display: "flex", flexWrap: "wrap", gap: 2, maxHeight: 200, overflowY: "auto" }}
            >
              {EMOJI_CATEGORIES[emojiTab].emojis.map((e) => (
                <button
                  key={e}
                  onClick={() => setText((t) => t + e)}
                  style={{
                    fontSize:    20,
                    cursor:      "pointer",
                    background:  "none",
                    border:      "none",
                    padding:     "4px 5px",
                    borderRadius: 6,
                    lineHeight:  1,
                    transition:  "background 0.1s",
                  }}
                  onMouseEnter={(ev) => (ev.currentTarget.style.background = "rgba(var(--border-rgb), 0.07)")}
                  onMouseLeave={(ev) => (ev.currentTarget.style.background = "none")}
                >
                  {e}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending attachments */}
      <AnimatePresence>
        {pendingAttachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{    opacity: 0, height: 0 }}
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10, overflow: "hidden" }}
          >
            {pendingAttachments.map((att, i) => (
              <AttachmentChip key={i} att={att} onRemove={() => removeAttachment(i)} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        {/* Left action bar */}
        <div style={{ display: "flex", gap: 2, paddingBottom: 4 }}>
          <InputIconBtn title="Emoji" active={showEmoji} onClick={() => setShowEmoji((s) => !s)}>
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </InputIconBtn>
          <InputIconBtn title="Send image" onClick={() => imageInputRef.current?.click()}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </InputIconBtn>
          <InputIconBtn title="Attach file" onClick={() => fileInputRef.current?.click()}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
          </InputIconBtn>
        </div>

        {/* Input area */}
        <div style={{ flex: 1, position: "relative" }}>
          {recording ? (
            <div
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        10,
                padding:    "10px 14px",
                borderRadius: 12,
                border:     "1px solid rgba(245,166,35,0.25)",
                background: "rgba(245,166,35,0.05)",
                color:      "rgba(245,166,35,0.88)",
                fontSize:   13,
                fontWeight: 500,
              }}
            >
              {/* Pulsing rec dot */}
              <span
                style={{
                  width:        8,
                  height:       8,
                  borderRadius: "50%",
                  background:   "#F5A623",
                  animation:    "pulse 1s infinite",
                  flexShrink:   0,
                  boxShadow:    "0 0 8px rgba(245,166,35,0.6)",
                }}
              />
              REC {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2, "0")}
              <span style={{ color: "rgba(var(--text-rgb), 0.3)", fontSize: 11, marginLeft: "auto", fontFamily: "monospace", letterSpacing: "0.04em" }}>
                STOP TO SEND
              </span>
            </div>
          ) : (
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (e.target.value.trim()) onTyping?.();
                else onStopTyping?.();
              }}
              onKeyDown={handleKey}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder={`Message ${participantName}...`}
              rows={1}
              style={{
                width:       "100%",
                padding:     "10px 14px",
                borderRadius: 12,
                border:      inputFocused
                  ? "1px solid rgba(245,166,35,0.3)"
                  : "1px solid rgba(var(--border-rgb), 0.07)",
                background:  inputFocused
                  ? "rgba(245,166,35,0.04)"
                  : "rgba(var(--border-rgb), 0.035)",
                color:       "var(--text)",
                fontSize:    14,
                fontFamily:  "inherit",
                outline:     "none",
                resize:      "none",
                lineHeight:  1.5,
                maxHeight:   120,
                overflowY:   "auto",
                transition:  "border-color 0.22s, background 0.22s, box-shadow 0.22s",
                boxSizing:   "border-box",
                boxShadow:   inputFocused
                  ? "0 0 0 3px rgba(245,166,35,0.055), 0 0 18px rgba(245,166,35,0.04)"
                  : "none",
              }}
            />
          )}
        </div>

        {/* Send / Mic / Stop */}
        <div style={{ paddingBottom: 4 }}>
          <AnimatePresence mode="wait">
            {canSend ? (
              <motion.button
                key="send"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{    scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={handleSend}
                whileHover={{ scale: 1.06 }}
                whileTap={{   scale: 0.94 }}
                style={{
                  width:          40,
                  height:         40,
                  borderRadius:   12,
                  border:         "none",
                  background:     "linear-gradient(145deg,#F5A623,#D97706)",
                  color:          "#060912",
                  cursor:         "pointer",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  boxShadow:      "0 4px 18px rgba(245,166,35,0.35)",
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </motion.button>
            ) : recording ? (
              <motion.button
                key="stop"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{    scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={stopRecording}
                whileHover={{ scale: 1.06 }}
                whileTap={{   scale: 0.94 }}
                style={{
                  width:          40,
                  height:         40,
                  borderRadius:   12,
                  border:         "none",
                  background:     "linear-gradient(145deg,#F5A623,#D97706)",
                  color:          "#060912",
                  cursor:         "pointer",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  boxShadow:      "0 4px 18px rgba(245,166,35,0.35)",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <rect x="1" y="1" width="10" height="10" rx="2" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{    scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={startRecording}
                style={{
                  width:          40,
                  height:         40,
                  borderRadius:   12,
                  border:         "1px solid rgba(var(--border-rgb), 0.07)",
                  background:     "rgba(var(--border-rgb), 0.035)",
                  color:          "rgba(var(--text-rgb), 0.38)",
                  cursor:         "pointer",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  transition:     "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,166,35,0.22)";
                  (e.currentTarget as HTMLButtonElement).style.background  = "rgba(245,166,35,0.07)";
                  (e.currentTarget as HTMLButtonElement).style.color       = "rgba(245,166,35,0.7)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(var(--border-rgb), 0.07)";
                  (e.currentTarget as HTMLButtonElement).style.background  = "rgba(var(--border-rgb), 0.035)";
                  (e.currentTarget as HTMLButtonElement).style.color       = "rgba(var(--text-rgb), 0.38)";
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─── Input icon button ──────────────────────────────────────────────────── */

function InputIconBtn({
  children, title, active = false, onClick,
}: {
  children: React.ReactNode;
  title: string;
  active?: boolean;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const on = active || hov;
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:          36,
        height:         36,
        borderRadius:   9,
        border:         on ? "1px solid rgba(245,166,35,0.24)" : "1px solid transparent",
        background:     on ? "rgba(245,166,35,0.08)" : "transparent",
        color:          on ? "#F5A623" : "rgba(var(--text-rgb), 0.32)",
        cursor:         "pointer",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        transition:     "all 0.15s",
        boxShadow:      on ? "0 0 10px rgba(245,166,35,0.09)" : "none",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Attachment chip ────────────────────────────────────────────────────── */

function AttachmentChip({ att, onRemove }: { att: PendingAttachment; onRemove: () => void }) {
  const isImage = att.file.type.startsWith("image/");
  const isAudio = att.file.type.startsWith("audio/");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1   }}
      exit={{    opacity: 0, scale: 0.9 }}
      style={{
        position:     "relative",
        borderRadius: 10,
        border:       `1px solid ${att.error ? "rgba(248,113,113,0.35)" : "rgba(245,166,35,0.14)"}`,
        background:   "rgba(245,166,35,0.04)",
        overflow:     "hidden",
        flexShrink:   0,
      }}
    >
      {isImage && att.previewUrl ? (
        <img src={att.previewUrl} alt="preview" style={{ width: 72, height: 72, objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", maxWidth: 200 }}>
          <span style={{ fontSize: 18 }}>{isAudio ? "🎙️" : "📎"}</span>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 11, color: "rgba(var(--text-rgb), 0.72)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>
              {att.file.name}
            </div>
            <div style={{ fontSize: 10, color: "rgba(var(--text-rgb), 0.28)", fontFamily: "monospace" }}>
              {fmtBytes(att.file.size)}
            </div>
          </div>
        </div>
      )}

      {att.uploading && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 18, height: 18, border: "2px solid rgba(var(--border-rgb), 0.14)", borderTopColor: "#F5A623", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      )}

      {att.error && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(248,113,113,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#f87171" }}>
          Failed
        </div>
      )}

      {!att.uploading && (
        <button
          onClick={onRemove}
          style={{
            position:       "absolute",
            top:            4,
            right:          4,
            width:          17,
            height:         17,
            borderRadius:   "50%",
            background:     "rgba(0,0,0,0.65)",
            border:         "none",
            color:          "#fff",
            fontSize:       9,
            cursor:         "pointer",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            lineHeight:     1,
          }}
        >
          ✕
        </button>
      )}
    </motion.div>
  );
}
