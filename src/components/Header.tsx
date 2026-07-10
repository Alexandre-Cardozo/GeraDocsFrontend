import type { View } from "../App"

interface Props {
  title: string
  currentView: View
  navigate: (view: View) => void
}

export default function Header({ title, currentView, navigate }: Props) {
  const showNewProcess = currentView === "processes" || currentView === "dashboard"

  return (
    <header
      style={{
        height: 60,
        background: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 16,
        flexShrink: 0,
      }}
    >
      {/* Breadcrumb / title */}
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 17,
            fontWeight: 700,
            color: "#071A3D",
            margin: 0,
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </h1>
      </div>

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 8,
          padding: "0 12px",
          height: 36,
          width: 240,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          placeholder="Buscar processo, documento..."
          style={{
            border: "none",
            background: "transparent",
            fontSize: 13,
            color: "#071A3D",
            outline: "none",
            width: "100%",
          }}
        />
        <span style={{ fontSize: 11, color: "#CBD5E1", fontFamily: "JetBrains Mono, monospace", background: "#F1F5F9", padding: "2px 5px", borderRadius: 4 }}>
          ⌘K
        </span>
      </div>

      {/* Notifications */}
      <button
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          border: "1px solid #E2E8F0",
          background: "#F8FAFC",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <div
          style={{
            position: "absolute",
            top: 7,
            right: 7,
            width: 7,
            height: 7,
            background: "#EF4444",
            borderRadius: 999,
            border: "2px solid #F8FAFC",
          }}
        />
      </button>

      {showNewProcess && (
        <button
          onClick={() => navigate("new-process")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#2563EB",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "0 16px",
            height: 36,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#2563EB")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo Processo
        </button>
      )}
    </header>
  )
}
