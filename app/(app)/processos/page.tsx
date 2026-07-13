"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button, DocPill, FilterTabs, SearchInput, StatusBadge, Tag } from "@/components/ui"
import { IconChevronRight, IconDownload, IconFilter } from "@/components/ui/icons"
import { EmptyState, ErrorState, SkeletonRows } from "@/components/shared/estados"
import { Th } from "@/components/shared/tabela"
import { useToast } from "@/components/shared/providers"
import { useProcessos } from "@/lib/api/hooks"
import { formatBRL } from "@/lib/format"
import type { StatusProcesso } from "@/lib/types"

const statusFilters = [
  { key: "todos", label: "Todos" },
  { key: "rascunho", label: "Rascunho" },
  { key: "em_revisao", label: "Em Revisão" },
  { key: "aguardando", label: "Aguardando" },
  { key: "aprovado", label: "Aprovado" },
  { key: "concluido", label: "Concluído" },
  { key: "rejeitado", label: "Rejeitado" },
]

export default function Processos() {
  const router = useRouter()
  const showToast = useToast()
  const [activeFilter, setActiveFilter] = useState("todos")
  const [busca, setBusca] = useState("")
  const [pagina, setPagina] = useState(1)

  const processos = useProcessos({
    busca,
    status: activeFilter as StatusProcesso | "todos",
    pagina,
    porPagina: 8,
  })

  const itens = processos.data?.itens ?? []

  return (
    <div className="gd-page">
      {/* Filtros */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <SearchInput
          grow
          placeholder="Buscar por título ou número..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value)
            setPagina(1)
          }}
          background="var(--color-surface)"
        />

        <FilterTabs
          options={statusFilters}
          active={activeFilter}
          onChange={(key) => {
            setActiveFilter(key)
            setPagina(1)
          }}
        />

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Button
            variant="secondary"
            icon={<IconFilter size={14} />}
            onClick={() => showToast("Filtros avançados ficarão disponíveis na integração com o backend.")}
          >
            Filtros
          </Button>
          <Button
            variant="secondary"
            icon={<IconDownload size={14} />}
            onClick={() => showToast("Exportação da lista disponível na integração com o backend.")}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
        {processos.isPending && <SkeletonRows rows={8} />}
        {processos.isError && <ErrorState onRetry={() => void processos.refetch()} />}

        {processos.isSuccess && itens.length > 0 && (
          <div className="gd-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 880 }}>
            <thead>
              <tr style={{ background: "var(--color-ice)", borderBottom: "var(--border-default)" }}>
                {["Processo / Objeto", "Secretaria", "Modalidade", "Valor Est.", "ETP", "TR", "Responsável", "Status", ""].map((h, i) => (
                  <Th key={h === "" ? `vazio-${i}` : h}>
                    {h}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {itens.map((p, i) => (
                <tr
                  key={p.id}
                  className="gd-row"
                  onClick={() => router.push(`/processos/${p.id}/etp`)}
                  style={{ borderBottom: i < itens.length - 1 ? "var(--border-row)" : "none" }}
                >
                  <td style={{ paddingBlock: 14, paddingInline: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-body)", maxWidth: 260 }}>{p.objeto}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", marginTop: 3 }}>
                      {p.id}
                    </div>
                  </td>
                  <td style={{ paddingBlock: 14, paddingInline: 16, fontSize: 12, color: "var(--text-secondary)", maxWidth: 160 }}>
                    {p.secretaria}
                  </td>
                  <td style={{ paddingBlock: 14, paddingInline: 16 }}>
                    <Tag tone="info">{p.modalidade}</Tag>
                  </td>
                  <td
                    style={{
                      paddingBlock: 14,
                      paddingInline: 16,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--color-petroleum)",
                      fontFamily: "var(--font-mono)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatBRL(p.valorEstimado)}
                  </td>
                  <td style={{ paddingBlock: 14, paddingInline: 16 }}>
                    <DocPill status={p.etpStatus} />
                  </td>
                  <td style={{ paddingBlock: 14, paddingInline: 16 }}>
                    <DocPill status={p.trStatus} />
                  </td>
                  <td style={{ paddingBlock: 14, paddingInline: 16, fontSize: 12, color: "var(--text-secondary)" }}>{p.responsavel}</td>
                  <td style={{ paddingBlock: 14, paddingInline: 16 }}>
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                  <td style={{ paddingBlock: 14, paddingInline: 16 }}>
                    <button
                      type="button"
                      aria-label={`Abrir processo ${p.id}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/processos/${p.id}/etp`)
                      }}
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
                      <IconChevronRight size={13} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}

        {processos.isSuccess && itens.length === 0 && <EmptyState message="Nenhum processo encontrado" />}

        {processos.isSuccess && (
          <div
            style={{
              paddingBlock: 12,
              paddingInline: 16,
              borderTop: "var(--border-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              Exibindo {itens.length} de {processos.data.total} processos
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {Array.from({ length: processos.data.totalPaginas }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPagina(p)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "var(--radius-sm)",
                    border: "var(--border-default)",
                    background: p === pagina ? "var(--color-navy)" : "var(--color-surface)",
                    color: p === pagina ? "var(--color-surface)" : "var(--text-secondary)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
