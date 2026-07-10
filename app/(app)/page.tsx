"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { StatCard, StatusBadge, Tag } from "@/components/ds"
import {
  IconCheckCircle,
  IconClipboardList,
  IconClock,
  IconDownload,
  IconFile,
  IconFileText,
  IconPlus,
  IconSearch,
} from "@/components/ds/icons"
import { ErrorState, SkeletonRows } from "@/components/estados"
import { useEstatisticas, useFilaAprovacoes, useProcessos, useUsuarioAtual } from "@/lib/api/hooks"
import { formatBRL, formatData } from "@/lib/format"

const th = {
  paddingBlock: 10,
  paddingInline: 16,
  textAlign: "left" as const,
  fontSize: 11,
  color: "var(--color-text-muted)",
  fontWeight: 600,
  letterSpacing: "var(--tracking-caps)",
  textTransform: "uppercase" as const,
  borderBottom: "var(--border-soft)",
}

export default function Dashboard() {
  const router = useRouter()
  const { data: usuario } = useUsuarioAtual()
  const estatisticas = useEstatisticas()
  const processos = useProcessos({ porPagina: 5 })
  const aprovacoes = useFilaAprovacoes()

  const recentes = processos.data?.itens ?? []
  const pendentes = (aprovacoes.data ?? []).filter((a) => a.status === "aguardando")

  return (
    <div style={{ padding: 28, maxWidth: "var(--content-max)" }}>
      {/* Saudação */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
            Segunda-feira, 07 de julho de 2024
          </p>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              fontWeight: 800,
              color: "var(--text-body)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            Bom dia, {usuario?.primeiroNome ?? "..."}
          </h2>
        </div>
        <Link
          href="/processos/novo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--action-primary)",
            color: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            paddingBlock: 11,
            paddingInline: 20,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <IconPlus size={15} strokeWidth={2.5} />
          Novo Processo de Contratação
        </Link>
      </div>

      {/* Stats */}
      {estatisticas.isError ? (
        <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", marginBottom: 24 }}>
          <ErrorState onRetry={() => void estatisticas.refetch()} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {estatisticas.isPending ? (
            Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                aria-hidden
                style={{
                  background: "var(--surface-card)",
                  border: "var(--border-default)",
                  borderRadius: "var(--radius-card)",
                  height: 130,
                }}
              />
            ))
          ) : (
            <>
              <StatCard
                label="Processos Ativos"
                value={String(estatisticas.data.processosAtivos)}
                sub={`+${estatisticas.data.processosNovosMes} este mês`}
                trend="up"
                icon={<IconFile size={20} />}
                color="var(--color-royal)"
                bg="var(--tint-royal-bg)"
              />
              <StatCard
                label="Aguardando Aprovação"
                value={String(estatisticas.data.aguardandoAprovacao)}
                sub={`${estatisticas.data.aguardandoUrgentes} com urgência`}
                trend="warn"
                icon={<IconClock size={20} />}
                color="var(--color-warning-strong)"
                bg="var(--tint-warning-bg)"
              />
              <StatCard
                label="Documentos Gerados"
                value={String(estatisticas.data.documentosGerados)}
                sub={`${estatisticas.data.documentosSemana} esta semana`}
                trend="up"
                icon={<IconDownload size={20} />}
                color="var(--color-teal)"
                bg="var(--doc-tr-bg)"
              />
              <StatCard
                label="ETPs Concluídos"
                value={String(estatisticas.data.etpsConcluidos)}
                sub={`Taxa de conclusão: ${estatisticas.data.taxaConclusao}%`}
                trend="up"
                icon={<IconCheckCircle size={20} />}
                color="var(--color-green)"
                bg="var(--status-done-bg)"
              />
            </>
          )}
        </div>
      )}

      <div className="gd-dash-grid">
        {/* Processos recentes */}
        <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
          <div
            style={{
              paddingBlock: 18,
              paddingInline: 20,
              borderBottom: "var(--border-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-body)" }}>
              Processos Recentes
            </h3>
            <Link href="/processos" style={{ fontSize: 13, color: "var(--color-royal)", fontWeight: 600 }}>
              Ver todos →
            </Link>
          </div>

          {processos.isPending && <SkeletonRows rows={5} />}
          {processos.isError && <ErrorState onRetry={() => void processos.refetch()} />}
          {processos.isSuccess && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-ice)" }}>
                  {["Processo", "Secretaria", "Valor Est.", "Status", "Data"].map((h) => (
                    <th key={h} style={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentes.map((p, i) => (
                  <tr
                    key={p.id}
                    className="gd-row"
                    onClick={() => router.push(`/processos/${p.id}/etp`)}
                    style={{ borderBottom: i < recentes.length - 1 ? "var(--border-row)" : "none" }}
                  >
                    <td style={{ paddingBlock: 13, paddingInline: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-body)" }}>{p.objeto}</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                        {p.id}
                      </div>
                    </td>
                    <td style={{ paddingBlock: 13, paddingInline: 16, fontSize: 12, color: "var(--text-secondary)" }}>{p.secretaria}</td>
                    <td
                      style={{
                        paddingBlock: 13,
                        paddingInline: 16,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--color-petroleum)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {formatBRL(p.valorEstimado)}
                    </td>
                    <td style={{ paddingBlock: 13, paddingInline: 16 }}>
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td style={{ paddingBlock: 13, paddingInline: 16, fontSize: 12, color: "var(--color-text-muted)" }}>
                      {formatData(p.atualizadoEm)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Coluna direita */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Pendentes de aprovação */}
          <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
            <div
              style={{
                padding: 18,
                borderBottom: "var(--border-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-body)" }}>
                Pendentes de Aprovação
              </h3>
              <span
                style={{
                  background: "var(--tint-danger-bg)",
                  color: "var(--color-danger)",
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: "var(--radius-full)",
                  paddingBlock: 2,
                  paddingInline: 8,
                }}
              >
                {aprovacoes.isSuccess ? pendentes.length : "…"}
              </span>
            </div>
            {aprovacoes.isPending && <SkeletonRows rows={3} height={36} />}
            {aprovacoes.isError && <ErrorState onRetry={() => void aprovacoes.refetch()} />}
            {aprovacoes.isSuccess && (
              <div style={{ paddingBlock: 8 }}>
                {pendentes.map((item) => (
                  <div
                    key={item.processoId}
                    className="gd-row"
                    onClick={() => router.push("/aprovacoes")}
                    style={{ paddingBlock: 12, paddingInline: 18, display: "flex", alignItems: "flex-start", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        background: "var(--tint-royal-bg)",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-royal)", fontFamily: "var(--font-mono)" }}>
                        {item.tipo === "ETP + TR" ? "ETP" : item.tipo}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text-body)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.objeto}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                        {item.processoId}
                      </div>
                    </div>
                    {item.urgente && <Tag tone="warning">Urgente</Tag>}
                  </div>
                ))}
              </div>
            )}
            <div style={{ paddingBlock: 12, paddingInline: 18, borderTop: "var(--border-soft)" }}>
              <Link
                href="/aprovacoes"
                style={{
                  display: "block",
                  width: "100%",
                  paddingBlock: 9,
                  background: "var(--tint-royal-bg)",
                  color: "var(--color-royal)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Ver todas as aprovações
              </Link>
            </div>
          </div>

          {/* Ações rápidas — ícones de linha, sem emoji (correção 3.3.2) */}
          <div className="gd-on-dark" style={{ background: "var(--color-navy)", borderRadius: "var(--radius-card)", paddingBlock: 20, paddingInline: 18 }}>
            <h3 style={{ margin: 0, marginBottom: 14, fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--on-dark-text)" }}>
              Ações Rápidas
            </h3>
            {[
              { label: "Novo ETP", desc: "Estudo Técnico Preliminar", icon: <IconClipboardList size={18} /> },
              { label: "Novo TR", desc: "Termo de Referência", icon: <IconFileText size={18} /> },
              { label: "Consultar PNCP", desc: "Portal Nacional de Contratações", icon: <IconSearch size={18} /> },
            ].map((a) => (
              <button
                key={a.label}
                type="button"
                className="gd-dark-row"
                onClick={() => router.push("/processos/novo")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  paddingBlock: 10,
                  paddingInline: 12,
                  background: "var(--on-dark-fill)",
                  border: "var(--border-on-dark-soft)",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  marginBottom: 8,
                  textAlign: "left",
                }}
              >
                <span style={{ display: "flex", color: "var(--color-electric)" }}>{a.icon}</span>
                <span style={{ display: "block" }}>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--on-dark-text)" }}>{a.label}</span>
                  <span style={{ display: "block", fontSize: 11, color: "var(--on-dark-text-40)" }}>{a.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
