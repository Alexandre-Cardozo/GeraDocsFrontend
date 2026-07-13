"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Button, ProgressBar } from "@/components/ui"
import {
  IconCheck,
  IconChevronRight,
  IconFile,
  IconHelp,
  IconInfo,
  IconSearch,
  IconUpload,
  IconX,
  IconXCircle,
} from "@/components/ui/icons"
import { ErrorState, LoadingState } from "@/components/shared/estados"
import { useToast } from "@/components/shared/providers"
import { useAnalisarDFD, useParecerDFD, useProcesso } from "@/lib/api/hooks"
import type { AchadoDFD } from "@/lib/types"

const etapasAnalise = [
  "Leitura e estruturação do documento",
  "Verificação de conformidade legal",
  "Cruzamento com PCA 2025",
  "Geração do parecer",
]

function severidadeCfg(achado: AchadoDFD) {
  if (achado.tipo === "conformidade") {
    return { bg: "var(--status-done-bg)", border: "var(--tint-success-border)", icon: "✓", iconColor: "var(--color-success)", textColor: "var(--tint-success-fg)" }
  }
  if (achado.severidade === "atencao") {
    return { bg: "var(--tint-danger-bg)", border: "var(--tint-danger-border)", icon: "✕", iconColor: "var(--color-danger)", textColor: "var(--tint-danger-fg)" }
  }
  return { bg: "var(--tint-warning-bg)", border: "var(--tint-warning-border)", icon: "!", iconColor: "var(--color-warning)", textColor: "var(--tint-warning-fg)" }
}

export default function VerificacaoDFD() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const showToast = useToast()
  const processoId = params.id

  const processo = useProcesso(processoId)
  const parecer = useParecerDFD(processoId)
  const analisar = useAnalisarDFD(processoId)

  // undefined = usuário ainda não mexeu → herda o DFD anexado na criação do processo.
  const [dfdFileEscolhido, setDfdFile] = useState<string | null | undefined>(undefined)
  const dfdFile = dfdFileEscolhido === undefined ? (processo.data?.dfdArquivo ?? null) : dfdFileEscolhido
  const [progress, setProgress] = useState(0)
  const [analisando, setAnalisando] = useState(false)
  const [reenviando, setReenviando] = useState(false)
  const intervalo = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => {
    if (intervalo.current) clearInterval(intervalo.current)
  }, [])

  const handleAnalyze = () => {
    if (!dfdFile) return
    setAnalisando(true)
    setProgress(0)
    analisar.mutate(dfdFile, {
      onSuccess: () => setReenviando(false),
      onError: (erro) => {
        // Falha na análise: interrompe a animação e volta ao upload com aviso.
        if (intervalo.current) clearInterval(intervalo.current)
        setAnalisando(false)
        setProgress(0)
        showToast(`Não foi possível analisar o DFD: ${erro.message}. Tente novamente.`)
      },
    })
    intervalo.current = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 18 + 5
        if (next >= 100) {
          if (intervalo.current) clearInterval(intervalo.current)
          setTimeout(() => setAnalisando(false), 300)
          return 100
        }
        return next
      })
    }, 280)
  }

  const done = !analisando && parecer.data != null && !reenviando
  const upload = !analisando && (parecer.data == null || reenviando)

  if (processo.isPending || parecer.isPending) {
    return (
      <div className="gd-page" style={{ maxWidth: "var(--content-max-review)" }}>
        <LoadingState label="Carregando processo..." />
      </div>
    )
  }
  if (processo.isError) {
    return (
      <div className="gd-page" style={{ maxWidth: "var(--content-max-review)" }}>
        <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)" }}>
          <ErrorState message={processo.error.message} onRetry={() => void processo.refetch()} />
        </div>
      </div>
    )
  }

  const okCount = parecer.data?.achados.filter((a) => a.tipo === "conformidade").length ?? 0
  const warnCount = parecer.data?.achados.filter((a) => a.tipo === "alerta" && a.severidade === "recomendacao").length ?? 0
  const errorCount = parecer.data?.achados.filter((a) => a.tipo === "alerta" && a.severidade === "atencao").length ?? 0

  return (
    <div className="gd-page" style={{ maxWidth: "var(--content-max-review)" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <Link href="/processos" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Processos
        </Link>
        <span style={{ display: "flex", color: "var(--color-text-faint)" }}>
          <IconChevronRight size={14} strokeWidth={2.5} />
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-royal)", fontWeight: 700 }}>{processoId}</span>
        <span style={{ display: "flex", color: "var(--color-text-faint)" }}>
          <IconChevronRight size={14} strokeWidth={2.5} />
        </span>
        <span style={{ fontSize: 13, color: "var(--text-body)", fontWeight: 600 }}>Verificação do DFD</span>
      </div>

      {/* Indicador de fase */}
      <div
        className="gd-on-dark"
        style={{
          background: "var(--gradient-hero)",
          borderRadius: 14,
          paddingBlock: 20,
          paddingInline: 24,
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            background: "var(--on-dark-electric-chip)",
            borderRadius: "var(--radius-card)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--color-electric)",
          }}
        >
          <IconHelp size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "var(--on-dark-text)", marginBottom: 4 }}>
            Fase 1 — Verificação do DFD pela IA
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--on-dark-text-60)" }}>
            O modelo analisará o DFD quanto à completude, conformidade legal e compatibilidade com o PCA antes de iniciar a elaboração do ETP e TR.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          {[
            { label: "Verificação DFD", active: true },
            { label: "ETP", active: false },
            { label: "TR", active: false },
          ].map((ph) => (
            <div key={ph.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "var(--radius-full)",
                  background: ph.active ? "var(--color-electric)" : "var(--on-dark-text-20)",
                }}
              />
              <span style={{ fontSize: 11, color: ph.active ? "var(--on-dark-text)" : "var(--on-dark-text-40)", fontWeight: ph.active ? 600 : 400 }}>
                {ph.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Estado: Upload ── */}
      {upload && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", paddingBlock: 22, paddingInline: 24 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-body)", margin: 0, marginBottom: 4 }}>
              Enviar DFD para Verificação
            </h3>
            <p style={{ margin: 0, marginBottom: 18, fontSize: 13, color: "var(--text-secondary)" }}>
              Anexe o Documento de Formalização de Demanda que será analisado pela IA. Caso já tenha enviado na criação do processo, o arquivo está disponível abaixo.
            </p>

            {dfdFile ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "var(--color-ice)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-xl)",
                    paddingBlock: 14,
                    paddingInline: 16,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      background: "var(--tint-royal-bg)",
                      borderRadius: "var(--radius-lg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "var(--color-royal)",
                    }}
                  >
                    <IconFile size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-body)" }}>{dfdFile}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>Pronto para análise</div>
                  </div>
                  <button
                    type="button"
                    aria-label="Remover DFD"
                    onClick={() => setDfdFile(null)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", padding: 4 }}
                  >
                    <IconX size={14} strokeWidth={2.5} />
                  </button>
                </div>
                <Button size="lg" icon={<IconSearch size={15} strokeWidth={2.5} />} onClick={handleAnalyze}>
                  Iniciar Análise do DFD pela IA
                </Button>
              </div>
            ) : (
              <label style={{ display: "block", cursor: "pointer" }}>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) setDfdFile(f.name)
                  }}
                />
                <div
                  style={{
                    border: "var(--border-dashed)",
                    borderRadius: "var(--radius-xl)",
                    paddingBlock: 32,
                    paddingInline: 24,
                    textAlign: "center",
                    background: "var(--surface-upload)",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: "var(--color-border-soft)",
                      borderRadius: "var(--radius-card)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      marginBottom: 12,
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <IconUpload size={22} strokeWidth={1.5} />
                  </div>
                  <p style={{ margin: 0, marginBottom: 4, fontSize: 14, color: "var(--text-label)", fontWeight: 600 }}>
                    Clique para selecionar o DFD
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-muted)" }}>PDF, DOCX ou DOC</p>
                </div>
              </label>
            )}
          </div>

          <button
            type="button"
            onClick={() => router.push(`/processos/${processoId}/etp`)}
            style={{
              alignSelf: "flex-start",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "var(--text-secondary)",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Pular esta fase e iniciar o ETP sem verificação
          </button>
        </div>
      )}

      {/* ── Estado: Analisando ── */}
      {analisando && (
        <div
          style={{
            background: "var(--surface-card)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-card)",
            paddingBlock: 36,
            paddingInline: 28,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "var(--radius-full)",
              background: "var(--tint-royal-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              marginBottom: 20,
              color: "var(--color-royal)",
            }}
          >
            <IconHelp size={28} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--text-body)", margin: 0, marginBottom: 8 }}>
            Analisando o DFD...
          </h3>
          <p style={{ margin: 0, marginBottom: 28, fontSize: 13, color: "var(--text-secondary)" }}>
            O modelo está verificando completude, conformidade e compatibilidade com o PCA vigente.
          </p>
          <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <ProgressBar percent={progress} label="Progresso da análise" height={8} transition="width 0.3s" />
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {etapasAnalise.map((etapa, i) => {
                const feito = progress > (i + 1) * 25
                const ativo = !feito && progress > i * 25
                return (
                  <div key={etapa} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "var(--radius-full)",
                        border: `2px solid ${feito ? "var(--color-success)" : ativo ? "var(--color-royal)" : "var(--color-border)"}`,
                        background: feito ? "var(--color-success)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: "var(--color-surface)",
                      }}
                    >
                      {feito && <IconCheck size={9} strokeWidth={3.5} />}
                      {ativo && !feito && <span style={{ width: 6, height: 6, borderRadius: "var(--radius-full)", background: "var(--color-royal)" }} />}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: feito ? "var(--tint-success-fg)" : ativo ? "var(--color-royal-hover)" : "var(--color-text-muted)",
                        fontWeight: ativo || feito ? 600 : 400,
                      }}
                    >
                      {etapa}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Estado: Parecer ── */}
      {done && parecer.data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", paddingBlock: 22, paddingInline: 24 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-body)", margin: 0, marginBottom: 4 }}>
                  Parecer da IA — DFD Analisado
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
                  {parecer.data.arquivo} · Analisado em 09/07/2025 às 14:38
                </p>
              </div>
              <div
                style={{
                  background: "var(--tint-warning-bg)",
                  border: "var(--border-tint-warning)",
                  borderRadius: "var(--radius-xl)",
                  paddingBlock: 10,
                  paddingInline: 18,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--tint-warning-fg)", fontFamily: "var(--font-display)", letterSpacing: "var(--tracking-stat)" }}>
                  {parecer.data.nota}
                </div>
                <div style={{ fontSize: 10, color: "var(--tint-warning-fg-strong)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)" }}>
                  / 100
                </div>
                <div style={{ fontSize: 10, color: "var(--tint-warning-fg)", marginTop: 2 }}>{parecer.data.classificacao}</div>
              </div>
            </div>

            {/* Resumo */}
            <div className="gd-grid-3" style={{ marginBottom: 20 }}>
              {[
                { count: okCount, label: "Conformes", bg: "var(--tint-success-bg)", fg: "var(--tint-success-fg)", sub: "var(--tint-success-fg-soft)", icon: <IconCheck size={18} strokeWidth={2.5} />, iconColor: "var(--color-success)" },
                { count: warnCount, label: "Recomendações", bg: "var(--tint-warning-bg)", fg: "var(--tint-warning-fg)", sub: "var(--tint-warning-fg-strong)", icon: <IconInfo size={18} strokeWidth={2.5} />, iconColor: "var(--color-warning)" },
                { count: errorCount, label: "Atenção necessária", bg: "var(--tint-danger-bg)", fg: "var(--tint-danger-fg)", sub: "var(--tint-danger-fg-strong)", icon: <IconXCircle size={18} strokeWidth={2.5} />, iconColor: "var(--color-danger)" },
              ].map((r) => (
                <div key={r.label} style={{ background: r.bg, borderRadius: "var(--radius-xl)", paddingBlock: 12, paddingInline: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ display: "flex", color: r.iconColor }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: r.fg, fontFamily: "var(--font-display)" }}>{r.count}</div>
                    <div style={{ fontSize: 11, color: r.sub }}>{r.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checklist de achados com fundamentação */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {parecer.data.achados.map((achado, i) => {
                const cfg = severidadeCfg(achado)
                return (
                  <div
                    key={i}
                    style={{
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      borderRadius: "var(--radius-md)",
                      paddingBlock: 10,
                      paddingInline: 14,
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: cfg.iconColor, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
                    <span style={{ fontSize: 13, color: cfg.textColor, lineHeight: 1.5 }}>
                      {achado.descricao}
                      {achado.fundamentacao && (
                        <>
                          {" "}
                          <span style={{ fontWeight: 700 }}>({achado.fundamentacao})</span>
                        </>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Ações */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "var(--border-default)",
              borderRadius: "var(--radius-card)",
              paddingBlock: 18,
              paddingInline: 22,
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flexGrow: 1, flexShrink: 1, flexBasis: 260 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-body)", fontFamily: "var(--font-display)", marginBottom: 4 }}>
                Como deseja prosseguir?
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
                O DFD foi aceito com ressalvas. Você pode corrigir os pontos apontados antes de continuar ou prosseguir para o ETP com as informações atuais.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setDfdFile(null)
                  setProgress(0)
                  analisar.reset()
                  setReenviando(true)
                }}
              >
                Enviar DFD Corrigido
              </Button>
              <Button onClick={() => router.push(`/processos/${processoId}/etp`)}>
                Prosseguir para o ETP
                <span style={{ display: "flex" }}>
                  <IconChevronRight size={14} strokeWidth={2.5} />
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
