import Avatar from "../shared/Avatar";
import type { User } from "../../types";

interface Props {
  participant: User;
  onBack?: () => void;
}

const BUTTONS = [
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

export default function ChatHeader({ participant, onBack }: Props) {
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
      <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
        {onBack && (
          <button
            onClick={onBack}
            title="Back"
            style={{
              width:          34,
              height:         34,
              borderRadius:   8,
              border:         "1px solid rgba(245,166,35,0.14)",
              background:     "rgba(245,166,35,0.06)",
              color:          "rgba(245,166,35,0.78)",
              cursor:         "pointer",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              flexShrink:     0,
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
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

      {/* Action buttons — hidden on mobile to save space */}
      <div style={{ display: onBack ? "none" : "flex", gap: 2, position: "relative", zIndex: 1 }}>
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
