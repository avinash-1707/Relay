import type { UserStatus } from "../../types";

const AVATAR_COLORS: Record<string, string> = {
  SA: "linear-gradient(145deg,#8B5CF6,#7C3AED)",
  KN: "linear-gradient(145deg,#2B7FFF,#1D4ED8)",
  PS: "linear-gradient(145deg,#F5A623,#D97706)",
  LF: "linear-gradient(145deg,#10B981,#059669)",
  AD: "linear-gradient(145deg,#F43F5E,#E11D48)",
  HC: "linear-gradient(145deg,#6366F1,#4F46E5)",
  AM: "linear-gradient(145deg,#22D3EE,#2563EB)",
};

const STATUS_COLOR: Record<UserStatus, string> = {
  online:  "#00E676",
  away:    "#FFB300",
  offline: "#4B5563",
  typing:  "#F5A623",
};

const STATUS_GLOW: Partial<Record<UserStatus, string>> = {
  online: "rgba(0,230,118,0.65)",
  typing: "rgba(245,166,35,0.65)",
};

interface AvatarProps {
  initials: string;
  status?: UserStatus;
  size?: number;
  showStatus?: boolean;
}

export default function Avatar({
  initials,
  status,
  size = 40,
  showStatus = true,
}: AvatarProps) {
  const dotSize   = Math.floor(size * 0.28);
  const isActive  = status === "online" || status === "typing";

  return (
    <div style={{ position: "relative", flexShrink: 0, width: size, height: size }}>
      {/* Glowing outer ring when online / typing */}
      {isActive && (
        <div
          style={{
            position:     "absolute",
            inset:        -2,
            borderRadius: "50%",
            border:       `1.5px solid ${status === "online" ? "rgba(0,230,118,0.35)" : "rgba(245,166,35,0.35)"}`,
            animation:    "neon-pulse 2.4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Avatar circle */}
      <div
        style={{
          width:          size,
          height:         size,
          borderRadius:   "50%",
          background:     AVATAR_COLORS[initials] ?? "linear-gradient(145deg,#F5A623,#2B7FFF)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       size * 0.33,
          fontWeight:     700,
          color:          "#fff",
          letterSpacing:  "-0.02em",
          position:       "relative",
          zIndex:          1,
        }}
      >
        {initials}
      </div>

      {/* Status dot */}
      {showStatus && status && (
        <div style={{ position: "absolute", bottom: 0, right: 0, zIndex: 2 }}>
          {isActive && (
            <div
              style={{
                position:   "absolute",
                inset:      -1,
                width:      dotSize + 2,
                height:     dotSize + 2,
                borderRadius: "50%",
                background:   STATUS_COLOR[status],
                opacity:      0,
                animation:    "presence-ring 2.2s ease-out infinite",
                pointerEvents: "none",
              }}
            />
          )}
          <div
            style={{
              width:        dotSize,
              height:       dotSize,
              borderRadius: "50%",
              background:   STATUS_COLOR[status],
              border:       "2px solid var(--space)",
              boxShadow:    isActive && STATUS_GLOW[status]
                ? `0 0 7px ${STATUS_GLOW[status]}`
                : "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
