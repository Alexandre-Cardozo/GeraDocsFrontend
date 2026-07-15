"use client"

import Link from "next/link"
import { useState } from "react"

import { DocPill, StatCard } from "@/components/ui"
import { IconCalendar, IconDatabase, IconDownload, IconEye, IconFileText, IconPlus } from "@/components/ui/icons"
import { EmptyState, ErrorState, SkeletonRows } from "@/components/shared/estados"
import { Th } from "@/components/shared/tabela"
import { useToast } from "@/components/shared/providers"
import { useDocumentos, useResumoDocumentos } from "@/lib/api/hooks"
import { CATALOGO, ORDEM_FLUXO } from "@/lib/documentos"
import { formatDataHora } from "@/lib/format"
import type { TipoDocumento } from "@/lib/types"

export default function Documentos() {
  const showToast = useToast()
  const documentos = useDocumentos()
  const resumoDados = useResumoDocumentos()
  const [filtroTipo, setFiltroTipo] = useState<TipoDocumento | null>(null)

  const docs = (documentos.data ?? []).filter((d) => filtroTipo === null || d.tipo === filtroTipo)

  const r = resumoDados.data

  return (
    <div className="max-w-content p-4 sm:p-5 lg:p-7">
      {/* Cards de resumo — StatCard padrão do DS (mesmo dos demais dashboards) */}
      <div className="mb-6 grid grid-cols-1 gap-3 xs:grid-cols-3">
        <StatCard label="Total de Documentos" value={r ? String(r.total) : "—"} icon={IconFileText} tone="royal" />
        <StatCard label="Gerados este Mês" value={r ? String(r.esteMes) : "—"} icon={IconCalendar} tone="teal" />
        <StatCard label="Armazenamento Usado" value={r ? `${r.armazenamentoMB} MB` : "—"} icon={IconDatabase} tone="success" />
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border-soft px-5 py-4">
          <h3 className="m-0 font-display text-lg font-bold text-text-1">Documentos Gerados</h3>
          <div className="flex flex-wrap gap-2">
            {ORDEM_FLUXO.map((f) => {
              const ativo = filtroTipo === f
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => setFiltroTipo(ativo ? null : f)}
                  className={`cursor-pointer rounded-sm px-3 py-1.25 text-sm font-semibold transition-colors ${
                    ativo ? "border border-royal bg-tint-royal-bg text-royal" : "border border-border bg-ice text-text-3"
                  }`}
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-ice">
                  {["Documento", "Processo", "Tipo", "Formato", "Gerado em", "Tamanho", "Status", ""].map((h, i) => (
                    <Th key={h === "" ? `vazio-${i}` : h}>{h}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, i) => (
                  <tr key={doc.id} className={`transition-colors hover:bg-ice ${i < docs.length - 1 ? "border-b border-ice" : ""}`}>
                    <td className="px-4 py-3.25">
                      <div className="text-base font-semibold text-text-1">{doc.titulo}</div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-xs text-text-muted">{doc.id}</span>
                        <span className="rounded-sm bg-border-soft px-1.5 py-0.5 font-mono text-2xs font-semibold text-slate-strong">
                          v{doc.versao}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.25">
                      <span className="font-mono text-xs font-semibold text-royal">{doc.processoId}</span>
                    </td>
                    <td className="px-4 py-3.25">
                      <DocPill status={doc.tipo} classes={CATALOGO[doc.tipo].chip} />
                    </td>
                    <td className="px-4 py-3.25 text-sm text-text-3">{doc.formato}</td>
                    <td className="px-4 py-3.25 text-sm whitespace-nowrap text-text-3">{formatDataHora(doc.geradoEm)}</td>
                    <td className="px-4 py-3.25 font-mono text-sm text-text-muted">{doc.tamanho}</td>
                    <td className="px-4 py-3.25">
                      <DocPill
                        status={doc.status === "final" ? "Final" : "Rascunho"}
                        classes={doc.status === "final" ? "bg-tint-success-bg text-tint-success-fg" : "bg-border-soft text-slate-strong"}
                      />
                    </td>
                    <td className="px-4 py-3.25">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          title="Download DOCX/PDF"
                          aria-label={`Baixar ${doc.titulo}`}
                          onClick={() => showToast("Exportação DOCX/PDF com timbre disponível na integração com o backend.")}
                          className="flex size-7 cursor-pointer items-center justify-center rounded-sm border border-border bg-ice text-royal"
                        >
                          <IconDownload size={13} strokeWidth={2.5} />
                        </button>
                        <button
                          type="button"
                          title="Visualizar"
                          aria-label={`Visualizar ${doc.titulo}`}
                          onClick={() => showToast("Pré-visualização disponível na integração com o backend.")}
                          className="flex size-7 cursor-pointer items-center justify-center rounded-sm border border-border bg-ice text-text-3"
                        >
                          <IconEye size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CTA gerar novo documento */}
      <div className="on-dark mt-5 flex flex-wrap items-center gap-5 rounded-card px-7 py-6 gradient-hero">
        <div className="flex-[1_1_260px]">
          <h3 className="m-0 mb-1.5 font-display text-md font-extrabold text-on-dark">Gerar Novo Documento</h3>
          <p className="m-0 text-base text-on-dark-60">
            Selecione um processo com ETP ou TR concluído para gerar o documento final em DOCX e PDF.
          </p>
        </div>
        <Link
          href="/processos"
          className="flex items-center gap-2 rounded-lg bg-royal px-6 py-2.75 text-md font-bold whitespace-nowrap text-surface no-underline"
        >
          <IconPlus size={14} strokeWidth={2.5} />
          Selecionar Processo
        </Link>
      </div>
    </div>
  )
}
