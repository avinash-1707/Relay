import { useState } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ padding: "12px 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "9px 14px",
          borderRadius: 10,
          border: `1px solid ${focused ? "rgba(34,211,238,0.25)" : "rgba(255,255,255,0.06)"}`,
          background: focused
            ? "rgba(34,211,238,0.03)"
            : "rgba(255,255,255,0.03)",
          transition: "all 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(34,211,238,0.06)" : "none",
        }}
      >
        <svg
          width="14"
          height="14"
          fill="none"
          stroke={focused ? "#22d3ee" : "rgba(255,255,255,0.25)"}
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{ flexShrink: 0, transition: "stroke 0.2s" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search conversations..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: 13,
            width: "100%",
            fontFamily: "inherit",
          }}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              lineHeight: 1,
            }}
          >
            <svg width="13" height="13" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
