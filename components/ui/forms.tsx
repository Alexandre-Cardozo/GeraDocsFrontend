"use client"

import { useEffect, useRef, useState, type ChangeEvent, type ReactNode, type SelectHTMLAttributes } from "react"

import { IconCheck, IconChevronDown, IconFile, IconSearch, IconUpload, IconX } from "@/components/ui/icons"

/** Base compartilhada dos controles de formulário (input 14px, raio 8, borda). */
const controleBase = "w-full rounded-md border border-border bg-surface px-3.25 py-2.5 font-body text-md text-text-1"

export function Input({
  value,
  onChange,
  placeholder,
  prefix,
  className = "",
  id,
}: {
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  prefix?: string
  className?: string
  id?: string
}) {
  if (prefix) {
    return (
      <div className="relative">
        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-base font-semibold text-text-3">
          {prefix}
        </span>
        <input
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${controleBase} pl-8 ${className}`}
        />
      </div>
    )
  }
  return (
    <input id={id} value={value} onChange={onChange} placeholder={placeholder} className={`${controleBase} ${className}`} />
  )
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
  id,
}: {
  value?: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
  className?: string
  id?: string
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`${controleBase} resize-y leading-[1.6] ${className}`}
    />
  )
}

export function Select({
  className = "",
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={`${controleBase} ${className}`} {...rest}>
      {children}
    </select>
  )
}

export interface DropdownOption {
  value: string
  label: string
}

/**
 * Dropdown padronizado do DS (não usa o `<select>` nativo do SO): botão com o
 * valor selecionado + chevron e um popover de opções estilizado. Fecha ao clicar
 * fora ou com Esc.
 */
export function Dropdown({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
}: {
  value: string
  onChange: (v: string) => void
  options: DropdownOption[]
  ariaLabel?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selecionada = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const aoClicarFora = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", aoClicarFora)
    return () => document.removeEventListener("pointerdown", aoClicarFora)
  }, [open])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false)
        }}
        className="flex h-9.5 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-border bg-surface px-3.25 font-body text-md text-text-1"
      >
        <span className="truncate">{selecionada?.label ?? "Selecione..."}</span>
        <span className={`flex shrink-0 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}>
          <IconChevronDown size={16} />
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-border bg-surface py-1 shadow-md"
        >
          {options.map((o) => {
            const ativa = o.value === value
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={ativa}
                  onClick={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-base transition-colors ${
                    ativa ? "bg-tint-royal-bg font-semibold text-royal" : "text-text-1 hover:bg-ice"
                  }`}
                >
                  <span className="truncate">{o.label}</span>
                  {ativa && <IconCheck size={14} strokeWidth={2.5} />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
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
      <label className="mb-1.5 block text-base font-semibold text-text-2">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      {hint && <p className="mb-2 text-sm text-text-muted">{hint}</p>}
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
      <div className="flex items-center gap-2.5 rounded-md border border-border bg-ice px-3.5 py-2.5">
        <span className="flex text-royal">
          <IconFile size={16} />
        </span>
        <span className="flex-1 text-base font-medium text-text-2">{file}</span>
        <button
          type="button"
          aria-label="Remover arquivo"
          onClick={() => onChange(null)}
          className="flex cursor-pointer border-0 bg-transparent p-0.5 text-text-muted"
        >
          <IconX size={14} strokeWidth={2.5} />
        </button>
      </div>
    )
  }
  return (
    <label className="block cursor-pointer">
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onChange(f.name)
        }}
      />
      <div className="rounded-md border-2 border-dashed border-text-faint bg-surface-upload px-5 py-4.5 text-center transition-colors">
        <span className="mx-auto mb-2 block w-5 text-text-muted">
          <IconUpload size={20} strokeWidth={1.5} />
        </span>
        <p className="m-0 text-base text-text-3">{placeholder}</p>
        <p className="mt-1 mb-0 text-xs text-text-muted">
          {accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")}
        </p>
      </div>
    </label>
  )
}

/** Círculo royal preenchido com check branco. */
export function CheckMark({ small }: { small?: boolean }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-royal text-surface ${small ? "size-4" : "size-5"}`}
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
      className={`flex w-full cursor-pointer items-center gap-3.5 rounded-card text-left transition-colors ${
        size === "small" ? "px-4 py-3" : "px-5 py-4"
      } ${selected ? "border-2 border-royal bg-tint-royal-bg" : "border border-border bg-surface"}`}
    >
      {icon && <span className="flex shrink-0 items-center text-royal">{icon}</span>}
      <span className="block flex-1">
        <span className={`block font-display font-bold text-text-1 ${size === "small" ? "text-base" : "text-md"}`}>
          {title}
        </span>
        {desc && <span className={`mt-0.5 block text-text-3 ${size === "small" ? "text-sm" : "text-base"}`}>{desc}</span>}
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
  tone = "ice",
  grow,
}: {
  placeholder?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  kbd?: string
  tone?: "ice" | "surface"
  grow?: boolean
}) {
  return (
    <div
      className={`flex h-9 items-center gap-2 rounded-md border border-border px-3 ${tone === "ice" ? "bg-ice" : "bg-surface"} ${
        grow ? "max-w-80 flex-[1_1_260px]" : "w-60"
      }`}
    >
      <span className="flex text-text-muted">
        <IconSearch size={14} />
      </span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-0 bg-transparent font-body text-base text-text-1"
      />
      {kbd && (
        <span className="rounded-xs bg-border-soft px-1.25 py-0.5 font-mono text-xs text-text-faint">{kbd}</span>
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
    <div className="flex flex-wrap gap-1.5 rounded-md border border-border bg-surface p-1">
      {options.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={() => onChange(f.key)}
          className={`cursor-pointer rounded-sm border-0 px-3 py-1.25 font-body text-sm font-semibold transition-colors ${
            active === f.key ? "bg-navy text-surface" : "bg-transparent text-text-3"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
