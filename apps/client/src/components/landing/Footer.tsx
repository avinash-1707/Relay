const LINKS = {
  Product:    ["Features", "Security", "Pricing", "Changelog"],
  Help:       ["Documentation", "Getting started", "Status", "Contact"],
  Company:    ["About", "Blog", "Careers", "Privacy"],
} as const;

export default function Footer() {
  return (
    <footer style={{ position: "relative", borderTop: "1px solid rgba(245,166,35,0.07)" }}>
      {/* Top amber accent line */}
      <div
        style={{
          position:   "absolute",
          top:        0,
          left:       0,
          right:      0,
          height:     1,
          background: "linear-gradient(90deg,transparent,rgba(245,166,35,0.22),rgba(43,127,255,0.1),transparent)",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 40px" }}>
        <div className="footer-links-grid">
          {/* Brand column */}
          <div>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
              <div
                style={{
                  width:          30,
                  height:         30,
                  borderRadius:   9,
                  background:     "linear-gradient(145deg,#F5A623,#D97706)",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  boxShadow:      "0 0 14px rgba(245,166,35,0.3)",
                  flexShrink:     0,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1L14.5 4.75V11.25L8 15L1.5 11.25V4.75L8 1Z"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="1.3"
                    fill="rgba(255,255,255,0.2)"
                    strokeLinejoin="round"
                  />
                  <path d="M8 4.5L11.5 6.5V10L8 12L4.5 10V6.5L8 4.5Z" fill="rgba(255,255,255,0.7)" />
                </svg>
              </div>
              <span
                style={{
                  fontSize:      13,
                  fontWeight:    800,
                  color:         "var(--text)",
                  letterSpacing: "0.1em",
                  fontFamily:    "'Geist Mono', monospace",
                  textTransform: "uppercase",
                }}
              >
                RELAY
              </span>
            </div>

            <p
              style={{
                fontSize:   13,
                color:      "rgba(var(--text-rgb), 0.26)",
                lineHeight: 1.75,
                maxWidth:   200,
                marginBottom: 20,
              }}
            >
              Secure real-time messaging for everyone. End-to-end encrypted.
            </p>

            {/* Status indicator */}
            <div
              style={{
                display:     "inline-flex",
                alignItems:  "center",
                gap:         7,
                padding:     "5px 11px",
                borderRadius: 100,
                border:      "1px solid rgba(34,197,94,0.15)",
                background:  "rgba(34,197,94,0.04)",
              }}
            >
              <span
                style={{
                  width:        5,
                  height:       5,
                  borderRadius: "50%",
                  background:   "#22C55E",
                  boxShadow:    "0 0 5px rgba(34,197,94,0.7)",
                  animation:    "neon-pulse 2.4s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize:      8,
                  fontFamily:    "monospace",
                  letterSpacing: "0.1em",
                  color:         "rgba(34,197,94,0.6)",
                  textTransform: "uppercase",
                }}
              >
                SYSTEMS NOMINAL
              </span>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4
                style={{
                  fontSize:      9,
                  fontFamily:    "monospace",
                  letterSpacing: "0.18em",
                  color:         "rgba(245,166,35,0.42)",
                  textTransform: "uppercase",
                  marginBottom:  16,
                }}
              >
                {group}
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{
                        fontSize:       13,
                        color:          "rgba(var(--text-rgb), 0.28)",
                        textDecoration: "none",
                        transition:     "color 0.18s",
                        letterSpacing:  "0.01em",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(var(--text-rgb), 0.68)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(var(--text-rgb), 0.28)"; }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            16,
            paddingTop:     24,
            borderTop:      "1px solid rgba(245,166,35,0.05)",
            flexWrap:       "wrap",
          }}
        >
          <p
            style={{
              fontSize:      9,
              color:         "rgba(var(--text-rgb), 0.17)",
              fontFamily:    "monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            © 2026 RELAY · ALL RIGHTS RESERVED
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize:       9,
                  color:          "rgba(var(--text-rgb), 0.17)",
                  textDecoration: "none",
                  fontFamily:     "monospace",
                  letterSpacing:  "0.1em",
                  textTransform:  "uppercase",
                  transition:     "color 0.18s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(var(--text-rgb), 0.48)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(var(--text-rgb), 0.17)"; }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
