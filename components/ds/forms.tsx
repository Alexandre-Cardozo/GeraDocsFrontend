"use client"

import type { ChangeEvent, CSSProperties, ReactNode, SelectHTMLAttributes } from "react"

import { IconCheck, IconFile, IconSearch, IconUpload, IconX } from "@/components/ds/icons"

const controleBase: CSSProperties = {
  width: "100%",
  paddingBlock: 10,
  paddingInline: 13,
  border: "var(--border-default)",
  borderRadius: "var(--radius-md)",
  fontSize: 14,
  color: "var(--text-body)",
  background: "var(--color-surface)",
  fontFamily: "var(--font-body)",
  boxSizing: "border-box",
}

export function Input({
  value,
  onChange,
  placeholder,
  prefix,
  style,
  id,
}: {
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  prefix?: string
  style?: CSSProperties
  id?: string
}) {
  if (prefix) {
    return (
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 13,
            color: "var(--text-secondary)",
            fontWeight: 600,
          }}
        >
          {prefix}
        </span>
        <input
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ ...controleBase, paddingLeft: 32, ...style }}
        />
      </div>
    )
  }
  return <input id={id} value={value} onChange={onChange} placeholder={placeholder} style={{ ...controleBase, ...style }} />
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  style,
  id,
}: {
  value?: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
  style?: CSSProperties
  id?: string
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{ ...controleBase, resize: "vertical", lineHeight: 1.6, ...style }}
    />
  )
}

export function Select({
  style,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select style={{ ...controleBase, ...style }} {...rest}>
      {children}
    </select>
  )
}

/** Rótulo + asterisco de obrigatório + frase de orientação. */
export function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-label)", marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: "var(--color-danger)", marginLeft: 4 }}>*</span>}
      </label>
      {hint && <p style={{ margin: 0, marginBottom: 8, fontSize: 12, color: "var(--color-text-muted)" }}>{hint}</p>}
      {children}
    </div>
  )
}

/** Drop-zone tracejada que vira chip de arquivo após a seleção. */
export function FileUpload({
  file,
  onChange,
  placeholder = "Clique para selecionar ou arraste o arquivo",
  accept = ".pdf,.docx",
}: {
  file: string | null
  onChange: (v: string | null) => void
  placeholder?: string
  accept?: string
}) {
  if (file) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--color-ice)",
          border: "var(--border-default)",
          borderRadius: "var(--radius-md)",
          paddingBlock: 10,
          paddingInline: 14,
        }}
      >
        <span style={{ display: "flex", color: "var(--color-royal)" }}>
          <IconFile size={16} />
        </span>
        <span style={{ flex: 1, fontSize: 13, color: "var(--text-label)", fontWeight: 500 }}>{file}</span>
        <button
          type="button"
          aria-label="Remover arquivo"
          onClick={() => onChange(null)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: 2, display: "flex" }}
        >
          <IconX size={14} strokeWidth={2.5} />
        </button>
      </div>
    )
  }
  return (
    <label style={{ display: "block", cursor: "pointer" }}>
      <input
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onChange(f.name)
        }}
      />
      <div
        style={{
          border: "var(--border-dashed)",
          borderRadius: "var(--radius-md)",
          paddingBlock: 18,
          paddingInline: 20,
          textAlign: "center",
          transition: "var(--transition-fast)",
          background: "var(--surface-upload)",
        }}
      >
        <span style={{ display: "block", width: 20, margin: "0 auto", marginBottom: 8, color: "var(--color-text-muted)" }}>
          <IconUpload size={20} strokeWidth={1.5} />
        </span>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>{placeholder}</p>
        <p style={{ margin: 0, marginTop: 4, fontSize: 11, color: "var(--color-text-muted)" }}>
          {accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")}
        </p>
      </div>
    </label>
  )
}

/** Círculo royal preenchido com check branco. */
export function CheckMark({ small }: { small?: boolean }) {
  const s = small ? 16 : 20
  return (
    <span
      style={{
        width: s,
        height: s,
        borderRadius: "var(--radius-full)",
        background: "var(--color-royal)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "var(--color-surface)",
      }}
    >
      <IconCheck size={small ? 9 : 11} strokeWidth={3.5} />
    </span>
  )
}

/** Card selecionável (modalidades / modos de ATA): borda royal 2px + tint. */
export function ChoiceCard({
  selected,
  onClick,
  icon,
  title,
  desc,
  size = "normal",
}: {
  selected: boolean
  onClick: () => void
  icon?: ReactNode
  title: string
  desc?: string
  size?: "normal" | "small"
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        paddingBlock: size === "small" ? 12 : 16,
        paddingInline: size === "small" ? 16 : 20,
        borderRadius: "var(--radius-card)",
        border: selected ? "var(--border-selected)" : "var(--border-default)",
        background: selected ? "var(--tint-royal-bg)" : "var(--color-surface)",
        cursor: "pointer",
        textAlign: "left",
        transition: "var(--transition-fast)",
        width: "100%",
      }}
    >
      {icon && <span style={{ display: "flex", alignItems: "center", flexShrink: 0, color: "var(--color-royal)" }}>{icon}</span>}
      <span style={{ flex: 1, display: "block" }}>
        <span
          style={{
            display: "block",
            fontSize: size === "small" ? 13 : 14,
            fontWeight: 700,
            color: "var(--text-body)",
            fontFamily: "var(--font-display)",
          }}
        >
          {title}
        </span>
        {desc && (
          <span style={{ display: "block", fontSize: size === "small" ? 12 : 13, color: "var(--text-secondary)", marginTop: 2 }}>
            {desc}
          </span>
        )}
      </span>
      {selected && <CheckMark small={size === "small"} />}
    </button>
  )
}

/** Campo de busca com lupa; chip ⌘K opcional. */
export function SearchInput({
  placeholder = "Buscar...",
  value,
  onChange,
  kbd,
  width = 240,
  background = "var(--color-ice)",
  grow,
}: {
  placeholder?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  kbd?: string
  width?: number
  background?: string
  grow?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background,
        border: "var(--border-default)",
        borderRadius: "var(--radius-md)",
        paddingInline: 12,
        height: 36,
        width: grow ? undefined : width,
        flexGrow: grow ? 1 : undefined, flexShrink: grow ? 1 : undefined, flexBasis: grow ? 260 : undefined,
        maxWidth: grow ? 320 : undefined,
      }}
    >
      <span style={{ display: "flex", color: "var(--color-text-muted)" }}>
        <IconSearch size={14} />
      </span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          border: "none",
          background: "transparent",
          fontSize: 13,
          color: "var(--text-body)",
          width: "100%",
          fontFamily: "var(--font-body)",
        }}
      />
      {kbd && (
        <span
          style={{
            fontSize: 11,
            color: "var(--color-text-faint)",
            fontFamily: "var(--font-mono)",
            background: "var(--color-border-soft)",
            paddingBlock: 2,
            paddingInline: 5,
            borderRadius: "var(--radius-xs)",
          }}
        >
          {kbd}
        </span>
      )}
    </div>
  )
}

/** Filtro segmentado: pill navy ativa dentro de grupo branco com borda. */
export function FilterTabs({
  options,
  active,
  onChange,
}: {
  options: Array<{ key: string; label: string }>
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        background: "var(--color-surface)",
        border: "var(--border-default)",
        borderRadius: "var(--radius-md)",
        padding: 4,
        flexWrap: "wrap",
      }}
    >
      {options.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={() => onChange(f.key)}
          style={{
            paddingBlock: 5,
            paddingInline: 12,
            borderRadius: "var(--radius-sm)",
            border: "none",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            background: active === f.key ? "var(--color-navy)" : "transparent",
            color: active === f.key ? "var(--color-surface)" : "var(--text-secondary)",
            transition: "var(--transition-fast)",
            fontFamily: "var(--font-body)",
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
