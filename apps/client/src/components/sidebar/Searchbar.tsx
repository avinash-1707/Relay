"use client";

import { useState } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ padding: "10px 14px 8px" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* Scanner sweep on focus */}
        {focused && (
          <div
            style={{
              position:    "absolute",
              top:         0,
              bottom:      0,
              width:       "2px",
              background:  "linear-gradient(180deg,transparent,#F5A623,transparent)",
              borderRadius: 1,
              animation:   "scanner-sweep 1.8s ease-in-out infinite",
              pointerEvents: "none",
              zIndex:       2,
              opacity:      0.55,
            }}
          />
        )}

        {/* Search icon */}
        <div
          style={{
            position:  "absolute",
            left:      11,
            color:     focused ? "#F5A623" : "rgba(var(--text-rgb), 0.22)",
            transition: "color 0.2s",
            lineHeight: 0,
            zIndex:     1,
          }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="SEARCH COMMS..."
          style={{
            width:        "100%",
            padding:      "8px 30px 8px 32px",
            borderRadius: 10,
            border:       focused
              ? "1px solid rgba(245,166,35,0.3)"
              : "1px solid rgba(var(--border-rgb), 0.055)",
            background:   focused ? "rgba(245,166,35,0.04)" : "rgba(var(--border-rgb), 0.03)",
            color:        "var(--text)",
            fontSize:     10,
            fontFamily:   "'Geist Mono', monospace",
            letterSpacing: "0.07em",
            outline:      "none",
            transition:   "all 0.22s",
            boxShadow:    focused
              ? "0 0 0 3px rgba(245,166,35,0.05), 0 0 18px rgba(245,166,35,0.05)"
              : "none",
          }}
        />

        {value && (
          <button
            onClick={() => onChange("")}
            style={{
              position:   "absolute",
              right:      8,
              width:      17,
              height:     17,
              borderRadius: "50%",
              background: "rgba(var(--border-rgb), 0.07)",
              border:     "none",
              color:      "rgba(var(--text-rgb), 0.45)",
              cursor:     "pointer",
              display:    "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize:   9,
              lineHeight: 1,
              transition: "background 0.15s",
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
