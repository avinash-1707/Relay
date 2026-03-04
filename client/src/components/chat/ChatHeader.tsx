import Avatar from "../shared/Avatar";
import type { User } from "../../types";

interface Props {
  participant: User;
}

export default function ChatHeader({ participant }: Props) {
  const statusLabel =
    participant.status === "online"
      ? "Active now"
      : participant.status === "away"
        ? `Away · ${participant.lastSeen ?? ""}`
        : `Last seen ${participant.lastSeen ?? "recently"}`;

  const buttons = [
    {
      title: "Voice call",
      icon: (
        <svg
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
          />
        </svg>
      ),
    },
    {
      title: "Video call",
      icon: (
        <svg
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ),
    },
    {
      title: "Search messages",
      icon: (
        <svg
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      ),
    },
    {
      title: "More options",
      icon: (
        <svg
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(13,17,23,0.95)",
        backdropFilter: "blur(12px)",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar
          initials={participant.avatar}
          status={participant.status}
          size={40}
        />
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {participant.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 2,
            }}
          >
            {participant.status === "online" && (
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                }}
              />
            )}
            <span
              style={{
                fontSize: 12,
                color:
                  participant.status === "online"
                    ? "#4ade80"
                    : "rgba(255,255,255,0.3)",
              }}
            >
              {statusLabel}
            </span>
            {participant.region && (
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
                · {participant.region}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 2 }}>
        {buttons.map((btn) => (
          <button
            key={btn.title}
            title={btn.title}
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.38)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.38)";
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
