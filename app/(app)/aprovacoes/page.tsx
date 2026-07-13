"use client"

import { useState } from "react"

import { Button, StatusBadge, Tag, Textarea, ValidationMsg } from "@/components/ui"
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconEye,
  IconFolder,
  IconHelp,
  IconUser,
  IconX,
} from "@/components/ui/icons"
import { EmptyState, ErrorState, SkeletonRows } from "@/components/shared/estados"
import { useToast } from "@/components/shared/providers"
import { useDecidirAprovacao, useFilaAprovacoes } from "@/lib/api/hooks"
import { formatBRL, formatData } from "@/lib/format"
import { PAPEL_LABEL, STATUS_PROCESSO_LABEL, type DecisaoAprovacao, type ItemAprovacao } from "@/lib/types"

const eventoLabel: Record<string, string> = {
  envio: "Envio",
  aprovacao: "Aprovação",
  rejeicao: "Rejeição",
  retificacao: "Solicitação de Retificação",
  conclusao: "Conclusão",
}

/** Cor do ponto na trilha por tipo de evento. */
const eventoDot: Record<string, string> = {
  aprovacao: "bg-success",
  rejeicao: "bg-danger",
  retificacao: "bg-violet",
  envio: "bg-royal",
  conclusao: "bg-royal",
}

export default function Aprovacoes() {
  const showToast = useToast()
  const fila = useFilaAprovacoes()
  const decidir = useDecidirAprovacao()

  const [selected, setSelected] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [erroComentario, setErroComentario] = useState(false)

  const itens = fila.data ?? []
  const activeId = selected ?? itens[0]?.processoId ?? null
  const active: ItemAprovacao | undefined = itens.find((a) => a.processoId === activeId)

  const handleDecisao = (decisao: DecisaoAprovacao) => {
    if (!active) return
    if (comment.trim() === "") {
      setErroComentario(true)
      return
    }
    setErroComentario(false)
    // Limpa o campo já no clique (o comentário vai junto na mutação) — limpar no
    // onSuccess apagaria um parecer que o usuário começou a digitar para OUTRO
    // item selecionado durante a mutação.
    setComment("")
    decidir.mutate(
      { processoId: active.processoId, decisao, comentario: comment.trim() },
      {
        onSuccess: () => {
          showToast(
            decisao === "aprovar"
              ? "Processo aprovado — decisão registrada na trilha de auditoria."
              : decisao === "rejeitar"
                ? "Processo rejeitado e devolvido ao elaborador."
                : "Retificação solicitada — o processo retorna para Em Revisão."
          )
        },
      }
    )
  }

  if (fila.isPending) {
    return (
      <div className="p-4 sm:p-5 lg:p-7">
        <SkeletonRows rows={6} />
      </div>
    )
  }
  if (fila.isError) {
    return (
      <div className="p-4 sm:p-5 lg:p-7">
        <div className="rounded-card border border-border bg-surface">
          <ErrorState onRetry={() => void fila.refetch()} />
        </div>
      </div>
    )
  }

  const pendentesCount = itens.filter((a) => a.status === "aguardando").length

  // Estado final (não-aguardando): classes do banner de decisão registrada.
  const finalBanner =
    active?.status === "aprovado"
      ? { box: "bg-tint-success-bg border-tint-success-border", texto: "text-tint-success-fg", label: "✓ Processo Aprovado" }
      : active?.status === "rejeitado"
        ? { box: "bg-tint-danger-bg border-tint-danger-border-strong", texto: "text-tint-danger-fg", label: "✕ Processo Rejeitado" }
        : { box: "bg-tint-violet-bg border-violet", texto: "text-tint-violet-fg", label: "Retificação Solicitada — processo devolvido para Em Revisão" }

  return (
    <div className="flex flex-col lg:h-full lg:flex-row lg:overflow-hidden">
      {/* Lista à esquerda (empilha acima do detalhe no celular) */}
      <div className="flex w-full shrink-0 flex-col overflow-hidden border-b border-border bg-surface lg:w-85 lg:min-w-85 lg:border-r lg:border-b-0">
        <div className="border-b border-border-soft px-4.5 py-4">
          <div className="text-base font-bold text-text-1">Pendentes de Aprovação</div>
          <div className="mt-0.5 text-sm text-text-3">{pendentesCount} documentos aguardando análise</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {itens.length === 0 && <EmptyState message="Nenhum item na fila de aprovação" />}
          {itens.map((a) => (
            <div
              key={a.processoId}
              onClick={() => {
                setSelected(a.processoId)
                setComment("")
                setErroComentario(false)
              }}
              className={`cursor-pointer border-b border-ice px-4.5 py-3.5 transition-colors ${
                activeId === a.processoId ? "border-l-[3px] border-l-royal bg-tint-royal-bg" : "border-l-[3px] border-l-transparent hover:bg-ice"
              }`}
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div className="flex-1 text-base font-semibold text-text-1">{a.objeto}</div>
                {a.status === "aguardando" && a.urgente && <Tag tone="warning">Urgente</Tag>}
                {a.status === "aprovado" && <Tag tone="success">Aprovado</Tag>}
                {a.status === "rejeitado" && <Tag tone="danger">Rejeitado</Tag>}
                {a.status === "em_revisao" && <Tag tone="violet">Em Retificação</Tag>}
              </div>
              <div className="mb-1 font-mono text-xs text-text-muted">{a.processoId}</div>
              <div className="mb-1 text-sm text-text-3">{a.secretaria}</div>
              <div className="flex items-center gap-2">
                <Tag tone="neutral">{a.tipo}</Tag>
                <span className="text-xs text-text-muted">Prazo: {formatData(a.prazo)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalhe à direita */}
      {active && (
        <div className="flex flex-1 flex-col overflow-hidden bg-ice">
          <div className="border-b border-border bg-surface px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-2.5">
              <div className="min-w-0">
                <div className="mb-1 font-mono text-xs text-text-muted">{active.processoId}</div>
                <h2 className="m-0 font-display text-lg font-extrabold tracking-display text-text-1">{active.objeto}</h2>
                <div className="mt-2 flex flex-wrap gap-3.5">
                  <span className="inline-flex items-center gap-1.25 text-sm text-text-3">
                    <IconFolder size={12} /> {active.secretaria}
                  </span>
                  <span className="inline-flex items-center gap-1.25 text-sm text-text-3">
                    <IconUser size={12} /> {active.responsavel}
                  </span>
                  <span className="inline-flex items-center gap-1.25 text-sm text-text-3">
                    <IconCalendar size={12} /> Enviado em {formatData(active.enviadoEm)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.25 text-sm font-bold ${
                      active.urgente ? "text-warning-strong" : "text-text-3"
                    }`}
                  >
                    <IconClock size={12} /> Prazo: {formatData(active.prazo)}
                  </span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<IconEye size={13} />}
                onClick={() => showToast("Pré-visualização dos documentos disponível na integração com o backend.")}
              >
                Visualizar Documentos
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {/* Cards de informação */}
            <div className="mb-5 grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3.5">
              {[
                { label: "Modalidade", value: <span>{active.modalidade}</span> },
                { label: "Tipo", value: <span>{active.tipo}</span> },
                { label: "Valor Estimado", value: <span className="font-mono">{formatBRL(active.valorEstimado)}</span> },
                { label: "Status", value: <StatusBadge status={active.status} size="sm" /> },
              ].map((info) => (
                <div key={info.label} className="rounded-xl border border-border bg-surface px-3.5 py-3">
                  <div className="mb-1.25 text-xs font-semibold tracking-caps text-text-muted uppercase">{info.label}</div>
                  <div className="text-base font-bold text-text-1">{info.value}</div>
                </div>
              ))}
            </div>

            {/* Checklist de conformidade */}
            <div className="mb-4 rounded-card border border-border bg-surface px-5 py-4.5">
              <h3 className="m-0 mb-3.5 font-display text-md font-bold text-text-1">Checklist de Conformidade</h3>
              <div className="flex flex-col gap-2">
                {active.checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                        item.ok ? "bg-tint-success-bg text-success" : "bg-tint-danger-bg text-danger"
                      }`}
                    >
                      {item.ok ? <IconCheck size={10} strokeWidth={3.5} /> : <IconX size={10} strokeWidth={3.5} />}
                    </span>
                    <span className={`text-base ${item.ok ? "text-text-2" : "font-semibold text-danger"}`}>{item.texto}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trilha de auditoria */}
            <div className="mb-4 rounded-card border border-border bg-surface px-5 py-4.5">
              <h3 className="m-0 mb-3.5 font-display text-md font-bold text-text-1">Histórico do Processo</h3>
              <div className="flex flex-col">
                {active.trilha.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`mt-1 size-2.5 shrink-0 rounded-full ${eventoDot[t.evento] ?? "bg-royal"}`} />
                      {i < active.trilha.length - 1 && <span className="w-0.5 flex-1 bg-border-soft" />}
                    </div>
                    <div className={`flex-1 ${i < active.trilha.length - 1 ? "pb-4" : ""}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-text-1">{eventoLabel[t.evento]}</span>
                        <span className="text-xs text-text-muted">
                          {STATUS_PROCESSO_LABEL[t.de]} → {STATUS_PROCESSO_LABEL[t.para]}
                        </span>
                        <span className="font-mono text-xs text-text-muted">{formatData(t.data)}</span>
                      </div>
                      <div className="mt-0.5 text-sm text-text-3">
                        {t.autor} · {PAPEL_LABEL[t.papel]}
                      </div>
                      <div className="mt-1 text-base leading-normal text-text-2">{t.comentario}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parecer */}
            <div className="mb-4 rounded-card border border-border bg-surface px-5 py-4.5">
              <h3 className="m-0 mb-1 font-display text-md font-bold text-text-1">Parecer / Observações</h3>
              <p className="m-0 mb-2.5 text-sm text-text-muted">
                O comentário é obrigatório e ficará registrado na trilha de auditoria do processo.
              </p>
              <Textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value)
                  if (e.target.value.trim() !== "") setErroComentario(false)
                }}
                placeholder="Registre seu parecer ou observações sobre o processo..."
                rows={4}
              />
              {erroComentario && <ValidationMsg type="error" msg="Informe o parecer antes de registrar a decisão." />}
            </div>

            {/* Decisão — empilha no celular, lado a lado no tablet+ */}
            {active.status === "aguardando" ? (
              <div className="flex flex-col gap-2.5 md:flex-row md:gap-3">
                <Button
                  variant="danger-soft"
                  size="lg"
                  className="flex-1 font-bold"
                  icon={<IconX size={15} strokeWidth={2.5} />}
                  disabled={decidir.isPending}
                  onClick={() => handleDecisao("rejeitar")}
                >
                  Rejeitar e Devolver
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1 border-violet font-bold text-tint-violet-fg"
                  icon={<IconHelp size={15} />}
                  disabled={decidir.isPending}
                  onClick={() => handleDecisao("retificar")}
                >
                  Solicitar Retificação
                </Button>
                <Button
                  variant="success"
                  size="lg"
                  className="flex-1 font-bold"
                  icon={<IconCheck size={15} strokeWidth={2.5} />}
                  disabled={decidir.isPending}
                  onClick={() => handleDecisao("aprovar")}
                >
                  Aprovar Processo
                </Button>
              </div>
            ) : (
              <div className={`rounded-xl border px-5 py-4 text-center ${finalBanner.box}`}>
                <div className={`text-lg font-bold ${finalBanner.texto}`}>{finalBanner.label}</div>
                <div className="mt-1 text-base text-text-3">Decisão registrada na trilha de auditoria acima.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
