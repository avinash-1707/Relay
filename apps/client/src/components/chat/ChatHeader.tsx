import Avatar from "../shared/Avatar";
import type { User } from "../../types";

interface Props {
  participant: User;
}

const BUTTONS = [
  {
    title: "Voice call",
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    title: "Video call",
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "Search messages",
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    title: "More options",
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
] as const;

export default function ChatHeader({ participant }: Props) {
  const statusLabel =
    participant.status === "online"
      ? "LINK ACTIVE"
      : participant.status === "away"
        ? `AWAY · ${participant.lastSeen ?? ""}`
        : `LAST PING ${participant.lastSeen ?? "UNKNOWN"}`;

  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "12px 20px",
        borderBottom:   "1px solid rgba(245,166,35,0.09)",
        background:     "rgba(var(--space-rgb), 0.92)",
        backdropFilter: "blur(22px)",
        flexShrink:     0,
        position:       "relative",
        overflow:       "hidden",
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
          background: "linear-gradient(90deg,transparent 0%,rgba(245,166,35,0.28) 30%,rgba(43,127,255,0.18) 70%,transparent 100%)",
        }}
      />

      {/* CRT overlay */}
      <div className="crt-overlay" />

      {/* Participant info */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
        <Avatar initials={participant.avatar} status={participant.status} size={40} />

        <div>
          <div
            style={{
              fontSize:      14,
              fontWeight:    700,
              color:         "var(--text)",
              letterSpacing: "-0.01em",
              lineHeight:    1.2,
            }}
          >
            {participant.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
            {participant.status === "online" && (
              <span
                style={{
                  width:        5,
                  height:       5,
                  borderRadius: "50%",
                  background:   "#00E676",
                  display:      "inline-block",
                  boxShadow:    "0 0 7px rgba(0,230,118,0.8)",
                }}
              />
            )}
            <span
              style={{
                fontSize:     9,
                color:        participant.status === "online" ? "#00E676" : "rgba(var(--text-rgb), 0.26)",
                fontFamily:   "monospace",
                letterSpacing: "0.08em",
              }}
            >
              {statusLabel}
            </span>
            {participant.region && (
              <span style={{ fontSize: 9, color: "rgba(var(--text-rgb), 0.17)", fontFamily: "monospace" }}>
                · {participant.region}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 2, position: "relative", zIndex: 1 }}>
        {BUTTONS.map((btn) => (
          <button
            key={btn.title}
            title={btn.title}
            style={{
              width:          34,
              height:         34,
              borderRadius:   8,
              border:         "1px solid transparent",
              background:     "transparent",
              color:          "rgba(var(--text-rgb), 0.28)",
              cursor:         "pointer",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              transition:     "all 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background   = "rgba(245,166,35,0.07)";
              el.style.borderColor  = "rgba(245,166,35,0.18)";
              el.style.color        = "rgba(245,166,35,0.78)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background   = "transparent";
              el.style.borderColor  = "transparent";
              el.style.color        = "rgba(240,240,248,0.28)";
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
