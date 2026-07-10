"use client"

import { useState, type CSSProperties, type ReactNode } from "react"

/** Botão de ação — alturas fixas sm 32 · md 36 · lg 40, raio 8, rótulo 13–14/600. */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  disabled,
  style,
  onClick,
  type = "button",
  title,
}: {
  variant?: "primary" | "secondary" | "dark" | "success" | "ghost" | "danger-soft"
  size?: "sm" | "md" | "lg"
  icon?: ReactNode
  children?: ReactNode
  disabled?: boolean
  style?: CSSProperties
  onClick?: () => void
  type?: "button" | "submit"
  title?: string
}) {
  const [hover, setHover] = useState(false)

  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    border: "none",
    borderRadius: "var(--radius-md)",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    transition: "var(--transition-fast)",
    whiteSpace: "nowrap",
  }
  const sizes: Record<string, CSSProperties> = {
    sm: { paddingInline: 14, height: 32, fontSize: 13 },
    md: { paddingInline: 16, height: 36, fontSize: 13 },
    lg: { paddingInline: 20, height: 40, fontSize: 14 },
  }
  const variants: Record<string, CSSProperties> = {
    primary: {
      background: disabled
        ? "var(--color-border)"
        : hover
          ? "var(--action-primary-hover)"
          : "var(--action-primary)",
      color: disabled ? "var(--color-text-muted)" : "var(--color-surface)",
    },
    secondary: {
      background: hover ? "var(--color-ice)" : "var(--color-surface)",
      border: "var(--border-default)",
      color: "var(--color-text-3)",
    },
    dark: { background: "var(--color-navy)", color: "var(--color-surface)" },
    success: { background: "var(--color-success)", color: "var(--color-surface)" },
    ghost: { background: hover ? "var(--tint-royal-bg)" : "transparent", color: "var(--color-royal)" },
    "danger-soft": {
      background: "var(--tint-danger-bg)",
      border: "2px solid var(--tint-danger-border-strong)",
      color: "var(--color-danger)",
    },
  }

  return (
    <button
      type={type}
      disabled={disabled}
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {icon}
      {children}
    </button>
  )
}

/** Toggle 40×22 com knob branco — única sombra permitida do sistema. */
export function Toggle({
  checked,
  onChange,
  color = "var(--color-royal)",
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  color?: string
  label?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: "var(--radius-full)",
        border: "none",
        cursor: "pointer",
        padding: 0,
        background: checked ? color : "var(--color-text-faint)",
        transition: "var(--transition-bg)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: "var(--radius-full)",
          background: "var(--color-surface)",
          transition: "left 0.2s",
          boxShadow: "var(--shadow-toggle-knob)",
        }}
      />
    </button>
  )
}
