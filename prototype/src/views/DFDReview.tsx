import { useState } from "react"
import type { View } from "../App"

interface Props {
  navigate: (view: View, id?: string) => void
  processId: string | null
}

type ReviewState = "upload" | "analyzing" | "done"

const feedbackItems = [
  { status: "ok", text: "Identificação do demandante completa e assinada pela autoridade competente." },
  { status: "ok", text: "Objeto descrito com clareza e especificidade suficiente para embasamento do ETP." },
  { status: "ok", text: "Justificativa da necessidade alinhada com o planejamento institucional (PCA 2025 — item 47)." },
  { status: "warn", text: "Estimativa de valor ausente. Recomenda-se incluir pesquisa prévia de preços para fortalecer a justificativa." },
  { status: "warn", text: "Prazo de entrega não especificado. Adicionar cronograma ou prazo estimado facilita o preenchimento do TR." },
  { status: "ok", text: "Critérios de sustentabilidade mencionados — compatível com o Art. 11 do Decreto 7.746/2012." },
  { status: "error", text: "Ausência de referência ao item do PCA vigente. O ETP pode ser questionado na fase de aprovação." },
]

export default function DFDReview({ navigate, processId }: Props) {
  const [dfdFile, setDfdFile] = useState<string | null>(null)
  const [reviewState, setReviewState] = useState<ReviewState>("upload")
  const [progress, setProgress] = useState(0)

  const handleAnalyze = () => {
    setReviewState("analyzing")
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 18 + 5
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => setReviewState("done"), 300)
      }
      setProgress(Math.min(p, 100))
    }, 280)
  }

  const okCount = feedbackItems.filter((f) => f.status === "ok").length
  const warnCount = feedbackItems.filter((f) => f.status === "warn").length
  const errorCount = feedbackItems.filter((f) => f.status === "error").length

  return (
    <div style={{ padding: "28px", maxWidth: 820 }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <button onClick={() => navigate("processes")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#64748B", padding: 0 }}>
          Processos
        </button>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#2563EB", fontWeight: 700 }}>{processId}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span style={{ fontSize: 13, color: "#071A3D", fontWeight: 600 }}>Verificação do DFD</span>
      </div>

      {/* Phase indicator */}
      <div style={{ background: "linear-gradient(135deg, #071A3D 0%, #0D3B66 100%)", borderRadius: 14, padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 44, height: 44, background: "rgba(56,189,248,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 16, fontWeight: 800, color: "#FFFFFF", marginBottom: 4 }}>
            Fase 1 — Verificação do DFD pela IA
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            O modelo analisará o DFD quanto à completude, conformidade legal e compatibilidade com o PCA antes de iniciar a elaboração do ETP e TR.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          {[
            { label: "Verificação DFD", active: true },
            { label: "ETP", active: false },
            { label: "TR", active: false },
          ].map((ph, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: ph.active ? "#38BDF8" : "rgba(255,255,255,0.2)" }} />
              <span style={{ fontSize: 11, color: ph.active ? "#FFFFFF" : "rgba(255,255,255,0.4)", fontWeight: ph.active ? 600 : 400 }}>{ph.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── State: Upload ── */}
      {reviewState === "upload" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "22px 24px" }}>
            <h3 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 15, fontWeight: 700, color: "#071A3D", margin: "0 0 4px" }}>
              Enviar DFD para Verificação
            </h3>
            <p style={{ margin: "0 0 18px", fontSize: 13, color: "#64748B" }}>
              Anexe o Documento de Formalização de Demanda que será analisado pela IA. Caso já tenha enviado na criação do processo, o arquivo está disponível abaixo.
            </p>

            {dfdFile ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, background: "#EFF6FF", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#071A3D" }}>{dfdFile}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>Pronto para análise</div>
                  </div>
                  <button onClick={() => setDfdFile(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", padding: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handleAnalyze}
                  style={{ padding: "11px 28px", background: "#2563EB", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Iniciar Análise do DFD pela IA
                </button>
              </div>
            ) : (
              <label style={{ display: "block", cursor: "pointer" }}>
                <input type="file" accept=".pdf,.docx,.doc" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) setDfdFile(f.name) }} />
                <div style={{ border: "2px dashed #CBD5E1", borderRadius: 10, padding: "32px 24px", textAlign: "center", background: "#FAFAFA" }}>
                  <div style={{ width: 48, height: 48, background: "#F1F5F9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: 14, color: "#374151", fontWeight: 600 }}>Clique para selecionar o DFD</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#94A3B8" }}>PDF, DOCX ou DOC</p>
                </div>
              </label>
            )}
          </div>

          <button
            onClick={() => navigate("etp-form", processId || undefined)}
            style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#64748B", textDecoration: "underline" }}
          >
            Pular esta fase e iniciar o ETP sem verificação
          </button>
        </div>
      )}

      {/* ── State: Analyzing ── */}
      {reviewState === "analyzing" && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "36px 28px", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 999, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 17, fontWeight: 700, color: "#071A3D", margin: "0 0 8px" }}>
            Analisando o DFD...
          </h3>
          <p style={{ margin: "0 0 28px", fontSize: 13, color: "#64748B" }}>
            O modelo está verificando completude, conformidade e compatibilidade com o PCA vigente.
          </p>
          <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Progresso da análise</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 8, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #2563EB, #38BDF8)", borderRadius: 999, transition: "width 0.3s" }} />
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {["Leitura e estruturação do documento", "Verificação de conformidade legal", "Cruzamento com PCA 2025", "Geração do parecer"].map((step, i) => {
                const done = progress > (i + 1) * 25
                const active = !done && progress > i * 25
                return (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 999, border: `2px solid ${done ? "#10B981" : active ? "#2563EB" : "#E2E8F0"}`, background: done ? "#10B981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      {active && !done && <div style={{ width: 6, height: 6, borderRadius: 999, background: "#2563EB" }} />}
                    </div>
                    <span style={{ fontSize: 12, color: done ? "#065F46" : active ? "#1D4ED8" : "#94A3B8", fontWeight: active || done ? 600 : 400 }}>{step}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── State: Done ── */}
      {reviewState === "done" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Score summary */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 15, fontWeight: 700, color: "#071A3D", margin: "0 0 4px" }}>
                  Parecer da IA — DFD Analisado
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                  {dfdFile || "DFD-PROC-2024-090.pdf"} · Analisado em 09/07/2025 às 14:38
                </p>
              </div>
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 18px", textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#92400E", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "-1px" }}>74</div>
                <div style={{ fontSize: 10, color: "#B45309", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>/ 100</div>
                <div style={{ fontSize: 10, color: "#92400E", marginTop: 2 }}>Adequado com ressalvas</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#ECFDF5", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#065F46", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{okCount}</div>
                  <div style={{ fontSize: 11, color: "#047857" }}>Conformes</div>
                </div>
              </div>
              <div style={{ background: "#FFFBEB", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#92400E", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{warnCount}</div>
                  <div style={{ fontSize: 11, color: "#B45309" }}>Recomendações</div>
                </div>
              </div>
              <div style={{ background: "#FEF2F2", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#991B1B", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{errorCount}</div>
                  <div style={{ fontSize: 11, color: "#B91C1C" }}>Atenção necessária</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {feedbackItems.map((item, i) => {
                const cfg = {
                  ok: { bg: "#F0FDF4", border: "#A7F3D0", icon: "✓", iconColor: "#10B981", textColor: "#065F46" },
                  warn: { bg: "#FFFBEB", border: "#FDE68A", icon: "!", iconColor: "#F59E0B", textColor: "#92400E" },
                  error: { bg: "#FEF2F2", border: "#FECACA", icon: "✕", iconColor: "#EF4444", textColor: "#991B1B" },
                }[item.status]
                return (
                  <div key={i} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: cfg.iconColor, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
                    <span style={{ fontSize: 13, color: cfg.textColor, lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#071A3D", fontFamily: "Plus Jakarta Sans, sans-serif", marginBottom: 4 }}>Como deseja prosseguir?</div>
              <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                O DFD foi aceito com ressalvas. Você pode corrigir os pontos apontados antes de continuar ou prosseguir para o ETP com as informações atuais.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <button
                onClick={() => setReviewState("upload")}
                style={{ padding: "10px 18px", border: "1px solid #E2E8F0", borderRadius: 8, background: "#FFFFFF", fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer" }}
              >
                Enviar DFD Corrigido
              </button>
              <button
                onClick={() => navigate("etp-form", processId || undefined)}
                style={{ padding: "10px 22px", border: "none", borderRadius: 8, background: "#2563EB", fontSize: 13, fontWeight: 600, color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}
              >
                Prosseguir para o ETP
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
