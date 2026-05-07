import type { UserStatus } from "../../types";

const AVATAR_COLORS: Record<string, string> = {
  SA: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
  KN: "linear-gradient(135deg,#06b6d4,#2563eb)",
  PS: "linear-gradient(135deg,#f59e0b,#d97706)",
  LF: "linear-gradient(135deg,#10b981,#059669)",
  AD: "linear-gradient(135deg,#f43f5e,#e11d48)",
  HC: "linear-gradient(135deg,#6366f1,#4f46e5)",
  AM: "linear-gradient(135deg,#22d3ee,#2563eb)",
};

const STATUS_COLOR: Record<UserStatus, string> = {
  online: "#4ade80",
  away: "#fbbf24",
  offline: "#6b7280",
  typing: "#22d3ee",
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
  const dotSize = size * 0.28;
  return (
    <div
      style={{ position: "relative", flexShrink: 0, width: size, height: size }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background:
            AVATAR_COLORS[initials] ??
            "linear-gradient(135deg,#22d3ee,#2563eb)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.33,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.02em",
        }}
      >
        {initials}
      </div>
      {showStatus && status && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: STATUS_COLOR[status],
            border: "2px solid #0D1117",
            animation:
              status === "online" || status === "typing" ? "none" : "none",
          }}
        />
      )}
    </div>
  );
}
