"use client"

import { useState } from "react"

import { Button, StatusBadge, Tag, Textarea, ValidationMsg } from "@/components/ds"
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconEye,
  IconFolder,
  IconHelp,
  IconUser,
  IconX,
} from "@/components/ds/icons"
import { EmptyState, ErrorState, SkeletonRows } from "@/components/estados"
import { useToast } from "@/components/providers"
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
      <div className="gd-page">
        <SkeletonRows rows={6} />
      </div>
    )
  }
  if (fila.isError) {
    return (
      <div className="gd-page">
        <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)" }}>
          <ErrorState onRetry={() => void fila.refetch()} />
        </div>
      </div>
    )
  }

  const pendentesCount = itens.filter((a) => a.status === "aguardando").length

  return (
    <div className="gd-split">
      {/* Lista à esquerda (empilha acima do detalhe no celular) */}
      <div className="gd-approvals-rail">
        <div style={{ paddingBlock: 16, paddingInline: 18, borderBottom: "var(--border-soft)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-body)" }}>Pendentes de Aprovação</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            {pendentesCount} documentos aguardando análise
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {itens.length === 0 && <EmptyState message="Nenhum item na fila de aprovação" />}
          {itens.map((a) => (
            <div
              key={a.processoId}
              className="gd-row"
              onClick={() => {
                setSelected(a.processoId)
                setComment("")
                setErroComentario(false)
              }}
              style={{
                paddingBlock: 14,
                paddingInline: 18,
                borderBottom: "var(--border-row)",
                background: activeId === a.processoId ? "var(--tint-royal-bg)" : "transparent",
                borderLeft: activeId === a.processoId ? "var(--border-royal-3)" : "var(--border-transparent-3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-body)", flex: 1 }}>{a.objeto}</div>
                {a.status === "aguardando" && a.urgente && <Tag tone="warning">Urgente</Tag>}
                {a.status === "aprovado" && <Tag tone="success">Aprovado</Tag>}
                {a.status === "rejeitado" && <Tag tone="danger">Rejeitado</Tag>}
                {a.status === "em_revisao" && <Tag tone="violet">Em Retificação</Tag>}
              </div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-text-muted)", marginBottom: 4 }}>
                {a.processoId}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{a.secretaria}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Tag tone="neutral">{a.tipo}</Tag>
                <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Prazo: {formatData(a.prazo)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalhe à direita */}
      {active && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--surface-app)" }}>
          <div style={{ background: "var(--color-surface)", borderBottom: "var(--border-default)", paddingBlock: 16, paddingInline: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-muted)", marginBottom: 4 }}>
                  {active.processoId}
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "var(--text-body)",
                    letterSpacing: "var(--tracking-display)",
                  }}
                >
                  {active.objeto}
                </h2>
                <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <IconFolder size={12} /> {active.secretaria}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <IconUser size={12} /> {active.responsavel}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <IconCalendar size={12} /> Enviado em {formatData(active.enviadoEm)}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: active.urgente ? "var(--color-warning-strong)" : "var(--text-secondary)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
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

          <div className="gd-split-content" style={{ flex: 1, overflowY: "auto" }}>
            {/* Cards de informação */}
            <div className="gd-info-grid">
              {[
                { label: "Modalidade", value: <span>{active.modalidade}</span> },
                { label: "Tipo", value: <span>{active.tipo}</span> },
                { label: "Valor Estimado", value: <span style={{ fontFamily: "var(--font-mono)" }}>{formatBRL(active.valorEstimado)}</span> },
                { label: "Status", value: <StatusBadge status={active.status} size="sm" /> },
              ].map((info) => (
                <div
                  key={info.label}
                  style={{
                    background: "var(--surface-card)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-xl)",
                    paddingBlock: 12,
                    paddingInline: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-muted)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "var(--tracking-caps)",
                      marginBottom: 5,
                    }}
                  >
                    {info.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-body)" }}>{info.value}</div>
                </div>
              ))}
            </div>

            {/* Checklist de conformidade */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-card)",
                paddingBlock: 18,
                paddingInline: 20,
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text-body)", margin: 0, marginBottom: 14 }}>
                Checklist de Conformidade
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {active.checklist.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "var(--radius-full)",
                        background: item.ok ? "var(--tint-success-bg)" : "var(--tint-danger-bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: item.ok ? "var(--color-success)" : "var(--color-danger)",
                      }}
                    >
                      {item.ok ? <IconCheck size={10} strokeWidth={3.5} /> : <IconX size={10} strokeWidth={3.5} />}
                    </span>
                    <span style={{ fontSize: 13, color: item.ok ? "var(--text-label)" : "var(--color-danger)", fontWeight: item.ok ? 400 : 600 }}>
                      {item.texto}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trilha de auditoria */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-card)",
                paddingBlock: 18,
                paddingInline: 20,
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text-body)", margin: 0, marginBottom: 14 }}>
                Histórico do Processo
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {active.trilha.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "var(--radius-full)",
                          background:
                            t.evento === "aprovacao"
                              ? "var(--color-success)"
                              : t.evento === "rejeicao"
                                ? "var(--color-danger)"
                                : t.evento === "retificacao"
                                  ? "var(--color-violet)"
                                  : "var(--color-royal)",
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      />
                      {i < active.trilha.length - 1 && <span style={{ width: 2, flex: 1, background: "var(--color-border-soft)" }} />}
                    </div>
                    <div style={{ paddingBottom: i < active.trilha.length - 1 ? 16 : 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-body)" }}>{eventoLabel[t.evento]}</span>
                        <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                          {STATUS_PROCESSO_LABEL[t.de]} → {STATUS_PROCESSO_LABEL[t.para]}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                          {formatData(t.data)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                        {t.autor} · {PAPEL_LABEL[t.papel]}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-label)", marginTop: 4, lineHeight: 1.5 }}>{t.comentario}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parecer */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-card)",
                paddingBlock: 18,
                paddingInline: 20,
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text-body)", margin: 0, marginBottom: 4 }}>
                Parecer / Observações
              </h3>
              <p style={{ margin: 0, marginBottom: 10, fontSize: 12, color: "var(--color-text-muted)" }}>
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
              <div className="gd-actions-stack">
                <Button
                  variant="danger-soft"
                  size="lg"
                  style={{ flex: 1, fontWeight: 700 }}
                  icon={<IconX size={15} strokeWidth={2.5} />}
                  disabled={decidir.isPending}
                  onClick={() => handleDecisao("rejeitar")}
                >
                  Rejeitar e Devolver
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  style={{ flex: 1, fontWeight: 700, color: "var(--tint-violet-fg)", borderColor: "var(--color-violet)" }}
                  icon={<IconHelp size={15} />}
                  disabled={decidir.isPending}
                  onClick={() => handleDecisao("retificar")}
                >
                  Solicitar Retificação
                </Button>
                <Button
                  variant="success"
                  size="lg"
                  style={{ flex: 1, fontWeight: 700 }}
                  icon={<IconCheck size={15} strokeWidth={2.5} />}
                  disabled={decidir.isPending}
                  onClick={() => handleDecisao("aprovar")}
                >
                  Aprovar Processo
                </Button>
              </div>
            ) : (
              <div
                style={{
                  background:
                    active.status === "aprovado"
                      ? "var(--tint-success-bg)"
                      : active.status === "rejeitado"
                        ? "var(--tint-danger-bg)"
                        : "var(--tint-violet-bg)",
                  border: `1px solid ${
                    active.status === "aprovado"
                      ? "var(--tint-success-border)"
                      : active.status === "rejeitado"
                        ? "var(--tint-danger-border-strong)"
                        : "var(--color-violet)"
                  }`,
                  borderRadius: "var(--radius-xl)",
                  paddingBlock: 16,
                  paddingInline: 20,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color:
                      active.status === "aprovado"
                        ? "var(--tint-success-fg)"
                        : active.status === "rejeitado"
                          ? "var(--tint-danger-fg)"
                          : "var(--tint-violet-fg)",
                  }}
                >
                  {active.status === "aprovado" && "✓ Processo Aprovado"}
                  {active.status === "rejeitado" && "✕ Processo Rejeitado"}
                  {active.status === "em_revisao" && "Retificação Solicitada — processo devolvido para Em Revisão"}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                  Decisão registrada na trilha de auditoria acima.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
