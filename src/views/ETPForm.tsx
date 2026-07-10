import { useState } from "react"
import type { View } from "../App"

interface Props {
  navigate: (view: View) => void
  processId: string | null
}

type ATAMode = "attach" | "delegate" | "both" | ""

const sections = [
  { id: "1", title: "Descrição da Necessidade", status: "completo", required: true },
  { id: "2", title: "Área Requisitante", status: "completo", required: true },
  { id: "3", title: "Descrição dos Requisitos", status: "completo", required: true },
  { id: "4", title: "Estimativa das Quantidades", status: "em_andamento", required: true },
  { id: "5", title: "Estimativa do Valor", status: "em_andamento", required: true },
  { id: "6", title: "Soluções Disponíveis no Mercado", status: "pendente", required: true },
  { id: "7", title: "Justificativa para Contratação", status: "pendente", required: true },
  { id: "8", title: "Análise da Viabilidade", status: "pendente", required: true },
  { id: "9", title: "Declaração de Viabilidade", status: "pendente", required: true },
  { id: "10", title: "Responsável Técnico", status: "pendente", required: true },
  { id: "11", title: "Sustentabilidade", status: "pendente", required: false },
  { id: "12", title: "Posicionamento Conclusivo", status: "pendente", required: false },
]

const statusMap = {
  completo: { label: "Completo", bg: "#ECFDF5", color: "#065F46", dot: "#10B981" },
  em_andamento: { label: "Em andamento", bg: "#EFF6FF", color: "#1D4ED8", dot: "#3B82F6" },
  pendente: { label: "Pendente", bg: "#F1F5F9", color: "#475569", dot: "#94A3B8" },
}

const completedCount = sections.filter((s) => s.status === "completo").length
const progress = Math.round((completedCount / sections.length) * 100)

export default function ETPForm({ navigate }: Props) {
  const [activeSection, setActiveSection] = useState("4")
  const [needDesc, setNeedDesc] = useState("Necessidade de aquisição de equipamentos de tecnologia da informação para modernização do parque tecnológico das unidades escolares da rede municipal de ensino, visando melhorar a qualidade do ensino e a infraestrutura pedagógica.")
  const [qty, setQty] = useState("150")
  const [valorUnit, setValorUnit] = useState("3.233,33")
  const [saved, setSaved] = useState(false)
  const [showATAPanel, setShowATAPanel] = useState(false)
  const [ataMode, setATAMode] = useState<ATAMode>("")
  const [ataFile, setATAFile] = useState<string | null>(null)
  const [ataReviewResult, setATAReviewResult] = useState<null | "loading" | "done">(null)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const active = sections.find((s) => s.id === activeSection)

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Sections sidebar */}
      <div
        style={{
          width: 280,
          minWidth: 280,
          background: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Process info */}
        <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#94A3B8" }}>PROC-2024-089</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#071A3D", marginTop: 2, lineHeight: 1.3 }}>Aquisição de Equip. de TI</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>Secretaria de Educação</div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Progresso do ETP</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #2563EB, #38BDF8)", borderRadius: 999, transition: "width 0.5s" }} />
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5 }}>
              {completedCount} de {sections.length} seções concluídas
            </div>
          </div>
        </div>

        {/* Section list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
          {sections.map((s) => {
            const sc = statusMap[s.status as keyof typeof statusMap]
            const isActive = activeSection === s.id
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 10px",
                  borderRadius: 8,
                  border: isActive ? "1px solid #BFDBFE" : "1px solid transparent",
                  background: isActive ? "#EFF6FF" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 2,
                  transition: "all 0.1s",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: s.status === "completo" ? "#ECFDF5" : s.status === "em_andamento" ? "#EFF6FF" : "#F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 10,
                    fontWeight: 700,
                    color: sc.color,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {s.status === "completo" ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={sc.dot} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : s.id}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: isActive ? 600 : 500, color: isActive ? "#1D4ED8" : "#374151", lineHeight: 1.3 }}>
                    {s.title}
                    {!s.required && <span style={{ fontSize: 10, color: "#94A3B8", marginLeft: 5 }}>Opt.</span>}
                  </div>
                </div>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: sc.dot, flexShrink: 0 }} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Main form area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F8FAFC" }}>
        {/* Form header */}
        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>Seção {active?.id} de {sections.length}</div>
            <h2 style={{ margin: 0, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 16, fontWeight: 700, color: "#071A3D" }}>
              {active?.title}
            </h2>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                padding: "8px 16px",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                background: "#FFFFFF",
                fontSize: 13,
                fontWeight: 600,
                color: "#64748B",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Orientações
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: 8,
                background: saved ? "#10B981" : "#2563EB",
                fontSize: 13,
                fontWeight: 600,
                color: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "background 0.2s",
              }}
            >
              {saved ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Salvo!
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Salvar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {activeSection === "1" && (
            <SectionBlock title="Descrição da Necessidade" hint="Descreva de forma clara e objetiva a necessidade que justifica a contratação, com base nos planos de trabalho e planejamento da unidade.">
              <FormLabel label="Descrição da Necessidade" required />
              <textarea
                value={needDesc}
                onChange={(e) => setNeedDesc(e.target.value)}
                rows={6}
                style={{ ...textareaStyle }}
              />
              <ValidationMsg type="ok" msg="Texto suficiente para fundamentar a necessidade." />
            </SectionBlock>
          )}

          {activeSection === "4" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <SectionBlock title="Estimativa das Quantidades" hint="Informe as quantidades estimadas com base no histórico de consumo, demanda projetada ou levantamentos realizados pela área técnica.">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div>
                    <FormLabel label="Quantidade Estimada" required />
                    <input value={qty} onChange={(e) => setQty(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <FormLabel label="Unidade de Medida" required />
                    <select style={inputStyle}>
                      <option>Unidade</option>
                      <option>Serviço</option>
                      <option>Metro Quadrado</option>
                      <option>Licença</option>
                    </select>
                  </div>
                  <div>
                    <FormLabel label="Período de Vigência" required />
                    <select style={inputStyle}>
                      <option>12 meses</option>
                      <option>24 meses</option>
                      <option>36 meses</option>
                      <option>48 meses</option>
                      <option>60 meses</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <FormLabel label="Memória de Cálculo" hint="Descreva a metodologia utilizada para estimar as quantidades" />
                  <textarea
                    rows={4}
                    placeholder="Ex: Quantidade estimada com base no levantamento realizado junto às 30 unidades escolares da rede municipal. Média de 5 equipamentos por unidade, considerando substituição de equipamentos com mais de 8 anos de uso..."
                    style={textareaStyle}
                  />
                </div>
              </SectionBlock>

              <SectionBlock title="Estimativa do Valor" hint="Baseie-se em pesquisas de mercado, contratos anteriores ou painel de preços do governo federal.">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <FormLabel label="Valor Unitário Estimado (R$)" required />
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#64748B", fontWeight: 600 }}>R$</span>
                      <input value={valorUnit} onChange={(e) => setValorUnit(e.target.value)} style={{ ...inputStyle, paddingLeft: 32 }} />
                    </div>
                  </div>
                  <div>
                    <FormLabel label="Valor Total Estimado (R$)" />
                    <div style={{ ...inputStyle, background: "#F8FAFC", display: "flex", alignItems: "center", color: "#0D3B66", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                      R$ 485.000,00
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <FormLabel label="Fonte de Pesquisa de Preços" required />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Painel de Preços do Governo Federal (paineldeprecos.economia.gov.br)", "Contratos similares celebrados por outros entes", "Cotações com fornecedores"].map((opt) => (
                      <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: "#374151" }}>
                        <input type="checkbox" defaultChecked={opt.includes("Painel")} style={{ width: 15, height: 15, accentColor: "#2563EB" }} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              </SectionBlock>
            </div>
          )}

          {activeSection !== "1" && activeSection !== "4" && (
            <SectionBlock title={active?.title || ""} hint="Preencha as informações desta seção conforme as orientações metodológicas do ETP.">
              {active?.status === "completo" ? (
                <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: "16px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#065F46" }}>Seção Concluída</div>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#047857" }}>Esta seção foi preenchida e validada. Clique para revisar o conteúdo.</p>
                  </div>
                </div>
              ) : (
                <textarea rows={6} placeholder="Preencha o conteúdo desta seção..." style={textareaStyle} />
              )}
            </SectionBlock>
          )}

          {/* ATA banner — shown when section 6 (Soluções) is active */}
          {activeSection === "6" && (
            <div style={{ marginTop: 20 }}>
              <div style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #0D3B66 100%)", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 36, height: 36, background: "rgba(56,189,248,0.15)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", fontFamily: "Plus Jakarta Sans, sans-serif", marginBottom: 4 }}>
                    A solução proposta é Adesão de ATA?
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                    Se o ETP concluir que a solução mais vantajosa é a Adesão de Ata de Registro de Preços, configure a ATA aqui para que o modelo possa validar ou encontrar opções adequadas.
                  </p>
                </div>
                <button
                  onClick={() => setShowATAPanel(!showATAPanel)}
                  style={{ padding: "8px 16px", background: "#2563EB", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#FFFFFF", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  {showATAPanel ? "Fechar" : "Configurar ATA"}
                </button>
              </div>

              {showATAPanel && (
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 22px", marginTop: 10 }}>
                  <h4 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 14, fontWeight: 700, color: "#071A3D", margin: "0 0 4px" }}>Gestão da Ata de Registro de Preços</h4>
                  <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748B" }}>Escolha como deseja proceder com a ATA para este processo.</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {[
                      { key: "attach" as ATAMode, label: "Anexar ATA para revisão pela IA", desc: "Envie a ATA que deseja utilizar. A IA verificará validade, compatibilidade e emitirá parecer." },
                      { key: "delegate" as ATAMode, label: "Delegar ao modelo a busca de ATAs válidas", desc: "A IA buscará ATAs compatíveis com o objeto. Você visualizará as origens e selecionará a desejada." },
                      { key: "both" as ATAMode, label: "Anexar ATA e buscar outras opções", desc: "A IA revisará sua ATA e também sugerirá alternativas encontradas para comparação." },
                    ].map((opt) => (
                      <button key={opt.key} onClick={() => setATAMode(opt.key)} style={{
                        display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px",
                        borderRadius: 10, border: ataMode === opt.key ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        background: ataMode === opt.key ? "#EFF6FF" : "#F8FAFC",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      }}>
                        <div style={{ width: 18, height: 18, borderRadius: 999, border: `2px solid ${ataMode === opt.key ? "#2563EB" : "#CBD5E1"}`, background: ataMode === opt.key ? "#2563EB" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                          {ataMode === opt.key && <div style={{ width: 6, height: 6, borderRadius: 999, background: "#FFFFFF" }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#071A3D", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{opt.label}</div>
                          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {(ataMode === "attach" || ataMode === "both") && (
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Anexar ATA <span style={{ color: "#EF4444" }}>*</span></label>
                      {ataFile ? (
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span style={{ flex: 1, fontSize: 13, color: "#374151", fontWeight: 500 }}>{ataFile}</span>
                            <button onClick={() => { setATAFile(null); setATAReviewResult(null) }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                          </div>
                          {ataReviewResult === null && (
                            <button
                              onClick={() => { setATAReviewResult("loading"); setTimeout(() => setATAReviewResult("done"), 2200) }}
                              style={{ padding: "8px 18px", background: "#2563EB", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}
                            >
                              Enviar para revisão pela IA
                            </button>
                          )}
                          {ataReviewResult === "loading" && (
                            <div style={{ background: "#EFF6FF", borderRadius: 8, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                              <div style={{ width: 16, height: 16, border: "2px solid #BFDBFE", borderTop: "2px solid #2563EB", borderRadius: 999, animation: "spin 1s linear infinite" }} />
                              <span style={{ fontSize: 13, color: "#1D4ED8" }}>Analisando ATA... aguarde.</span>
                            </div>
                          )}
                          {ataReviewResult === "done" && (
                            <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: "14px 16px" }}>
                              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>Parecer da IA — ATA Válida</span>
                              </div>
                              <p style={{ margin: 0, fontSize: 12, color: "#047857", lineHeight: 1.6 }}>
                                A ATA analisada está vigente, com objeto compatível ao ETP e dentro dos limites legais para adesão (Art. 86 da Lei 14.133/21). Prazo de vigência: 30/11/2025. Órgão gerenciador: Governo do Estado de São Paulo. Nenhuma irregularidade identificada.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <label style={{ display: "block", cursor: "pointer" }}>
                          <input type="file" accept=".pdf,.docx" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) setATAFile(f.name) }} />
                          <div style={{ border: "2px dashed #CBD5E1", borderRadius: 8, padding: "16px 20px", textAlign: "center", background: "#FAFAFA" }}>
                            <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>Clique para selecionar a ATA (PDF ou DOCX)</p>
                          </div>
                        </label>
                      )}
                    </div>
                  )}

                  {ataMode === "delegate" && (
                    <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "12px 14px" }}>
                      <p style={{ margin: 0, fontSize: 12, color: "#1D4ED8" }}>
                        ✓ O modelo realizará a busca de ATAs compatíveis após a confirmação. Os resultados — com origem, órgão gerenciador e validade — ficarão disponíveis neste processo para sua seleção.
                      </p>
                    </div>
                  )}

                  {ataMode !== "" && (
                    <button style={{ marginTop: 14, padding: "9px 20px", background: "#071A3D", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}>
                      Confirmar configuração da ATA
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <button
              onClick={() => {
                const idx = sections.findIndex((s) => s.id === activeSection)
                if (idx > 0) setActiveSection(sections[idx - 1].id)
              }}
              disabled={activeSection === "1"}
              style={{
                padding: "10px 20px",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                background: "#FFFFFF",
                fontSize: 13,
                fontWeight: 600,
                color: "#64748B",
                cursor: activeSection === "1" ? "not-allowed" : "pointer",
                opacity: activeSection === "1" ? 0.4 : 1,
              }}
            >
              ← Seção Anterior
            </button>
            <div style={{ display: "flex", gap: 10 }}>
              {activeSection === sections[sections.length - 1].id ? (
                <button
                  onClick={() => navigate("documents")}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 8,
                    background: "#10B981",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Finalizar e Gerar Documento
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleSave()
                    const idx = sections.findIndex((s) => s.id === activeSection)
                    if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id)
                  }}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 8,
                    background: "#2563EB",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  Salvar e Avançar →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  fontSize: 14,
  color: "#071A3D",
  background: "#FFFFFF",
  outline: "none",
  fontFamily: "Inter, sans-serif",
}

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  fontSize: 14,
  color: "#071A3D",
  background: "#FFFFFF",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  resize: "vertical",
  lineHeight: 1.6,
}

function FormLabel({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
        {label}
        {required && <span style={{ color: "#EF4444", marginLeft: 4 }}>*</span>}
      </label>
      {hint && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94A3B8" }}>{hint}</p>}
    </div>
  )
}

function SectionBlock({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 22px", marginBottom: 0 }}>
      <h3 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 15, fontWeight: 700, color: "#071A3D", margin: "0 0 6px" }}>{title}</h3>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{hint}</p>
      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>{children}</div>
    </div>
  )
}

function ValidationMsg({ type, msg }: { type: "ok" | "warn" | "error"; msg: string }) {
  const cfg = {
    ok: { bg: "#ECFDF5", color: "#065F46", icon: "✓" },
    warn: { bg: "#FFFBEB", color: "#92400E", icon: "!" },
    error: { bg: "#FEF2F2", color: "#991B1B", icon: "✕" },
  }
  const c = cfg[type]
  return (
    <div style={{ background: c.bg, borderRadius: 7, padding: "8px 12px", marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: c.color, fontWeight: 700, fontSize: 13 }}>{c.icon}</span>
      <span style={{ fontSize: 12, color: c.color, fontWeight: 500 }}>{msg}</span>
    </div>
  )
}
