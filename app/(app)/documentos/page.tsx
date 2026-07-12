"use client"

import Link from "next/link"
import { useState } from "react"

import { DocPill } from "@/components/ds"
import { IconCalendar, IconDatabase, IconDownload, IconEye, IconFileText, IconPlus } from "@/components/ds/icons"
import { EmptyState, ErrorState, SkeletonRows } from "@/components/estados"
import { useToast } from "@/components/providers"
import { useDocumentos } from "@/lib/api/hooks"
import type { TipoDocumento } from "@/lib/types"

const tiposDoc: Record<TipoDocumento, { bg: string; color: string }> = {
  ETP: { bg: "var(--doc-etp-bg)", color: "var(--doc-etp)" },
  TR: { bg: "var(--doc-tr-bg)", color: "var(--doc-tr)" },
  "Cotação": { bg: "var(--doc-cotacao-bg)", color: "var(--doc-cotacao)" },
  Mapa: { bg: "var(--doc-mapa-bg)", color: "var(--doc-mapa)" },
}

const th = {
  paddingBlock: 10,
  paddingInline: 16,
  textAlign: "left" as const,
  fontSize: 11,
  color: "var(--color-text-muted)",
  fontWeight: 600,
  letterSpacing: "var(--tracking-caps)",
  textTransform: "uppercase" as const,
}

function formatGeradoEm(iso: string): string {
  const [data, hora] = iso.split("T")
  const [ano, mes, dia] = (data ?? "").split("-")
  return `${dia}/${mes}/${ano} — ${(hora ?? "").slice(0, 5)}`
}

export default function Documentos() {
  const showToast = useToast()
  const documentos = useDocumentos()
  const [filtroTipo, setFiltroTipo] = useState<TipoDocumento | null>(null)

  const docs = (documentos.data ?? []).filter((d) => filtroTipo === null || d.tipo === filtroTipo)

  const resumo = [
    { label: "Total de Documentos", value: "141", icon: <IconFileText size={22} /> },
    { label: "Gerados este Mês", value: "14", icon: <IconCalendar size={22} /> },
    { label: "Armazenamento Usado", value: "51 MB", icon: <IconDatabase size={22} /> },
  ]

  return (
    <div className="gd-page">
      {/* Cards de resumo — ícones de linha, sem emoji (correção 3.3.2) */}
      <div className="gd-grid-3" style={{ marginBottom: 24, maxWidth: 700 }}>
        {resumo.map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--surface-card)",
              border: "var(--border-default)",
              borderRadius: "var(--radius-card)",
              paddingBlock: 16,
              paddingInline: 18,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ display: "flex", color: "var(--color-royal)" }}>{s.icon}</span>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "var(--text-body)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "var(--tracking-stat-sm)",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
        <div
          style={{
            paddingBlock: 16,
            paddingInline: 20,
            borderBottom: "var(--border-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-body)" }}>
            Documentos Gerados
          </h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(Object.keys(tiposDoc) as TipoDocumento[]).map((f) => {
              const ativo = filtroTipo === f
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => setFiltroTipo(ativo ? null : f)}
                  style={{
                    paddingBlock: 5,
                    paddingInline: 12,
                    borderRadius: "var(--radius-sm)",
                    border: ativo ? "var(--border-royal)" : "var(--border-default)",
                    background: ativo ? "var(--tint-royal-bg)" : "var(--color-ice)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: ativo ? "var(--color-royal)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "var(--transition-fast)",
                  }}
                >
                  {f}
                </button>
              )
            })}
          </div>
        </div>

        {documentos.isPending && <SkeletonRows rows={7} />}
        {documentos.isError && <ErrorState onRetry={() => void documentos.refetch()} />}
        {documentos.isSuccess && docs.length === 0 && <EmptyState message="Nenhum documento encontrado para o filtro selecionado" />}

        {documentos.isSuccess && docs.length > 0 && (
          <div className="gd-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
            <thead>
              <tr style={{ background: "var(--color-ice)", borderBottom: "var(--border-default)" }}>
                {["Documento", "Processo", "Tipo", "Formato", "Gerado em", "Tamanho", "Status", ""].map((h, i) => (
                  <th key={h === "" ? `vazio-${i}` : h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map((doc, i) => {
                const tc = tiposDoc[doc.tipo]
                return (
                  <tr key={doc.id} className="gd-row" style={{ borderBottom: i < docs.length - 1 ? "var(--border-row)" : "none" }}>
                    <td style={{ paddingBlock: 13, paddingInline: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-body)" }}>{doc.titulo}</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                        {doc.id}
                      </div>
                    </td>
                    <td style={{ paddingBlock: 13, paddingInline: 16 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-royal)", fontWeight: 600 }}>
                        {doc.processoId}
                      </span>
                    </td>
                    <td style={{ paddingBlock: 13, paddingInline: 16 }}>
                      <DocPill status={doc.tipo} bg={tc.bg} color={tc.color} />
                    </td>
                    <td style={{ paddingBlock: 13, paddingInline: 16, fontSize: 12, color: "var(--text-secondary)" }}>{doc.formato}</td>
                    <td style={{ paddingBlock: 13, paddingInline: 16, fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                      {formatGeradoEm(doc.geradoEm)}
                    </td>
                    <td style={{ paddingBlock: 13, paddingInline: 16, fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--color-text-muted)" }}>
                      {doc.tamanho}
                    </td>
                    <td style={{ paddingBlock: 13, paddingInline: 16 }}>
                      <DocPill status={doc.status === "final" ? "Final" : "Rascunho"} bg={doc.status === "final" ? "var(--tint-success-bg)" : "var(--color-border-soft)"} color={doc.status === "final" ? "var(--tint-success-fg)" : "var(--color-slate-strong)"} />
                    </td>
                    <td style={{ paddingBlock: 13, paddingInline: 16 }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          title="Download DOCX/PDF"
                          aria-label={`Baixar ${doc.titulo}`}
                          onClick={() => showToast("Exportação DOCX/PDF com timbre disponível na integração com o backend.")}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "var(--radius-sm)",
                            border: "var(--border-default)",
                            background: "var(--color-ice)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--color-royal)",
                          }}
                        >
                          <IconDownload size={13} strokeWidth={2.5} />
                        </button>
                        <button
                          type="button"
                          title="Visualizar"
                          aria-label={`Visualizar ${doc.titulo}`}
                          onClick={() => showToast("Pré-visualização disponível na integração com o backend.")}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "var(--radius-sm)",
                            border: "var(--border-default)",
                            background: "var(--color-ice)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <IconEye size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* CTA gerar novo documento */}
      <div
        className="gd-on-dark"
        style={{
          marginTop: 20,
          background: "var(--gradient-hero)",
          borderRadius: "var(--radius-card)",
          paddingBlock: 24,
          paddingInline: 28,
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flexGrow: 1, flexShrink: 1, flexBasis: 260 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "var(--on-dark-text)", margin: 0, marginBottom: 6 }}>
            Gerar Novo Documento
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--on-dark-text-60)" }}>
            Selecione um processo com ETP ou TR concluído para gerar o documento final em DOCX e PDF.
          </p>
        </div>
        <Link
          href="/processos"
          style={{
            paddingBlock: 11,
            paddingInline: 24,
            background: "var(--action-primary)",
            borderRadius: "var(--radius-lg)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--color-surface)",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <IconPlus size={14} strokeWidth={2.5} />
          Selecionar Processo
        </Link>
      </div>
    </div>
  )
}
