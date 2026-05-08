import type { MessageStatus } from "../../types";

export function MessageStatusIcon({ status }: { status: MessageStatus }) {
  if (status === "sent") {
    return (
      <svg
        width="14"
        height="14"
        fill="none"
        viewBox="0 0 24 24"
        style={{ stroke: "rgba(var(--text-rgb), 0.22)" }}
        strokeWidth="2.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    );
  }

  if (status === "delivered") {
    return (
      <svg width="16" height="14" viewBox="0 0 28 20" fill="none">
        <path
          d="M2 10 L8 16 L18 4"
          style={{ stroke: "rgba(var(--text-rgb), 0.28)" }}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 10 L16 16 L26 4"
          style={{ stroke: "rgba(var(--text-rgb), 0.28)" }}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  /* read — amber glow ticks */
  return (
    <svg width="16" height="14" viewBox="0 0 28 20" fill="none">
      <path
        d="M2 10 L8 16 L18 4"
        stroke="#F5A623"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10 L16 16 L26 4"
        stroke="#F5A623"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
