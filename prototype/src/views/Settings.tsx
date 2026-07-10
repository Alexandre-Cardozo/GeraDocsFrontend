import { useState } from "react"
import type { View } from "../App"

interface Props {
  navigate: (view: View) => void
}

const tabs = [
  { key: "identidade", label: "Identidade Visual" },
  { key: "cabecalho", label: "Cabeçalho e Rodapé" },
  { key: "pca", label: "PCA — Plano de Contratações" },
  { key: "usuarios", label: "Usuários e Permissões" },
]

export default function Settings({ navigate: _navigate }: Props) {
  const [activeTab, setActiveTab] = useState("identidade")
  const [logoFile, setLogoFile] = useState<string | null>("brasao-sao-paulo.png")
  const [timbrado, setTimbrado] = useState(true)
  const [cabecalhoText, setCabecalhoText] = useState("PREFEITURA MUNICIPAL DE SÃO PAULO\nSecretaria Municipal de Compras e Contratações")
  const [rodapeText, setRodapeText] = useState("Documento gerado eletronicamente pela plataforma ContrataDoc · São Paulo, {data} · Processo nº {numero}")
  const [savedMsg, setSavedMsg] = useState(false)
  const [pcaFile, setPcaFile] = useState<string | null>(null)
  const [pcaYear, setPcaYear] = useState("2025")
  const [pcaSavedMsg, setPcaSavedMsg] = useState(false)

  const handleSave = () => {
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2500)
  }

  const handlePCASave = () => {
    setPcaSavedMsg(true)
    setTimeout(() => setPcaSavedMsg(false), 2500)
  }

  return (
    <div style={{ padding: "28px", maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 20, fontWeight: 800, color: "#071A3D", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
          Configurações da Prefeitura
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: "#64748B" }}>
          Personalize os documentos gerados e configure as informações institucionais do órgão.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 28, borderBottom: "1px solid #E2E8F0", paddingBottom: 0 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "9px 18px", border: "none", background: "transparent", cursor: "pointer",
              fontSize: 13, fontWeight: activeTab === t.key ? 700 : 500,
              color: activeTab === t.key ? "#2563EB" : "#64748B",
              borderBottom: activeTab === t.key ? "2px solid #2563EB" : "2px solid transparent",
              marginBottom: -1, transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Identidade Visual ── */}
      {activeTab === "identidade" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SettingsCard
            title="Logotipo / Brasão da Prefeitura"
            desc="O logotipo será inserido no cabeçalho dos documentos timbrados. Formatos aceitos: PNG, SVG, JPG (fundo transparente recomendado)."
          >
            {logoFile ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 80, height: 80, background: "#F1F5F9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E2E8F0" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#071A3D" }}>{logoFile}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>PNG · 340 × 340 px · 48 KB</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <label style={{ cursor: "pointer" }}>
                      <input type="file" accept=".png,.svg,.jpg,.jpeg" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) setLogoFile(f.name) }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", padding: "5px 12px", border: "1px solid #BFDBFE", borderRadius: 6, background: "#EFF6FF", cursor: "pointer" }}>
                        Substituir
                      </span>
                    </label>
                    <button onClick={() => setLogoFile(null)} style={{ fontSize: 12, fontWeight: 600, color: "#64748B", padding: "5px 12px", border: "1px solid #E2E8F0", borderRadius: 6, background: "#F8FAFC", cursor: "pointer" }}>
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <FileUploadArea
                placeholder="Clique para selecionar ou arraste o logotipo aqui"
                accept=".png,.svg,.jpg,.jpeg"
                onFile={setLogoFile}
              />
            )}
          </SettingsCard>

          <SettingsCard
            title="Documentos Timbrados"
            desc="Quando ativado, todos os documentos gerados incluirão o brasão, o cabeçalho e o rodapé configurados. Caso desativado, os documentos serão gerados sem timbre."
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Toggle checked={timbrado} onChange={setTimbrado} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                  {timbrado ? "Documentos timbrados ativados" : "Documentos sem timbre"}
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                  {timbrado ? "ETP, TR, Cotação e demais documentos incluirão o brasão e identificação do órgão." : "Documentos serão gerados com cabeçalho e rodapé em branco."}
                </div>
              </div>
            </div>

            {timbrado && !logoFile && (
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 14px", marginTop: 14, display: "flex", gap: 8, alignItems: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span style={{ fontSize: 12, color: "#92400E" }}>Nenhum logotipo configurado. O cabeçalho será gerado apenas com o texto institucional.</span>
              </div>
            )}
          </SettingsCard>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSave} style={btnPrimary}>
              {savedMsg ? "✓ Salvo com sucesso" : "Salvar Configurações"}
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Cabeçalho e Rodapé ── */}
      {activeTab === "cabecalho" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SettingsCard
            title="Cabeçalho dos Documentos"
            desc="Texto exibido no topo de cada página dos documentos gerados. Use quebras de linha para organizar as informações. Variáveis disponíveis: {processo}, {data}, {secretaria}."
          >
            <textarea
              value={cabecalhoText}
              onChange={(e) => setCabecalhoText(e.target.value)}
              rows={4}
              style={textareaStyle}
              placeholder="Ex: PREFEITURA MUNICIPAL DE SÃO PAULO&#10;Secretaria de Compras e Contratações"
            />
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 20px", marginTop: 14 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 10 }}>Pré-visualização do Cabeçalho</div>
              <div style={{ borderBottom: "2px solid #071A3D", paddingBottom: 10, display: "flex", alignItems: "flex-start", gap: 16 }}>
                {logoFile && (
                  <div style={{ width: 40, height: 40, background: "#E2E8F0", borderRadius: 6, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  {cabecalhoText.split("\n").map((line, i) => (
                    <div key={i} style={{ fontSize: i === 0 ? 13 : 11, fontWeight: i === 0 ? 700 : 500, color: "#071A3D", fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: 1.5 }}>
                      {line || " "}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Rodapé dos Documentos"
            desc="Texto exibido na parte inferior de cada página. Variáveis disponíveis: {processo}, {data}, {numero}, {pagina}."
          >
            <textarea
              value={rodapeText}
              onChange={(e) => setRodapeText(e.target.value)}
              rows={3}
              style={textareaStyle}
              placeholder="Ex: Documento gerado em {data} · Processo {numero}"
            />
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 20px", marginTop: 14 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 10 }}>Pré-visualização do Rodapé</div>
              <div style={{ borderTop: "1px solid #CBD5E1", paddingTop: 8 }}>
                <div style={{ fontSize: 10, color: "#94A3B8", textAlign: "center", fontFamily: "Inter, sans-serif" }}>
                  {rodapeText.replace("{data}", "09/07/2025").replace("{numero}", "PROC-2024-090").replace("{pagina}", "1")}
                </div>
              </div>
            </div>
          </SettingsCard>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSave} style={btnPrimary}>
              {savedMsg ? "✓ Salvo com sucesso" : "Salvar Cabeçalho e Rodapé"}
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: PCA ── */}
      {activeTab === "pca" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ margin: 0, fontSize: 13, color: "#1D4ED8", lineHeight: 1.6 }}>
              O <strong>Plano de Contratações Anual (PCA)</strong> é utilizado pelo modelo de IA para validar se o processo em elaboração está previsto no planejamento vigente, sugerindo o item correspondente e auxiliando no preenchimento do ETP.
            </p>
          </div>

          <SettingsCard
            title="PCA do Ano Vigente"
            desc="Anexe o PCA aprovado para o ano corrente. Formatos aceitos: PDF, XLSX, DOCX. O arquivo será utilizado como referência durante a geração dos documentos."
          >
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Ano de Referência</label>
                <select value={pcaYear} onChange={(e) => setPcaYear(e.target.value)} style={{ ...inputStyle, width: 120, marginTop: 6 }}>
                  {["2023", "2024", "2025", "2026"].map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {pcaFile ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, background: "#EFF6FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#071A3D" }}>{pcaFile}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>PCA {pcaYear} · Importado em 09/07/2025</div>
                  </div>
                  <span style={{ fontSize: 11, background: "#ECFDF5", color: "#065F46", borderRadius: 6, padding: "3px 9px", fontWeight: 700 }}>Ativo</span>
                </div>

                <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#065F46" }}>PCA carregado com sucesso</div>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#047857" }}>247 itens de contratação indexados. O modelo utilizará este PCA como referência nos processos de {pcaYear}.</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <label style={{ cursor: "pointer" }}>
                    <input type="file" accept=".pdf,.xlsx,.docx" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) setPcaFile(f.name) }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", padding: "6px 14px", border: "1px solid #BFDBFE", borderRadius: 7, background: "#EFF6FF", cursor: "pointer", display: "inline-block" }}>
                      Substituir arquivo
                    </span>
                  </label>
                  <button onClick={() => setPcaFile(null)} style={{ fontSize: 12, fontWeight: 600, color: "#64748B", padding: "6px 14px", border: "1px solid #E2E8F0", borderRadius: 7, background: "#F8FAFC", cursor: "pointer" }}>
                    Remover PCA
                  </button>
                </div>
              </div>
            ) : (
              <FileUploadArea
                placeholder="Clique para selecionar o PCA ou arraste o arquivo aqui"
                accept=".pdf,.xlsx,.docx"
                onFile={setPcaFile}
              />
            )}
          </SettingsCard>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handlePCASave} style={btnPrimary} disabled={!pcaFile}>
              {pcaSavedMsg ? "✓ Configuração salva" : "Salvar PCA"}
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Usuários ── */}
      {activeTab === "usuarios" && (
        <div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 15, fontWeight: 700, color: "#071A3D" }}>Servidores com Acesso</h3>
              <button style={btnPrimary}>+ Convidar Servidor</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  {["Servidor", "Cargo", "Perfil de Acesso", "Último Acesso", ""].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Maria Costa", role: "Chefe de Compras", profile: "Administrador", last: "Hoje, 14:22", initials: "MC", color: "#2563EB" },
                  { name: "José Alves", role: "Analista de Compras", profile: "Elaborador", last: "Hoje, 11:05", initials: "JA", color: "#0D9488" },
                  { name: "Ana Ribeiro", role: "Técnica de Licitações", profile: "Elaborador", last: "08/07/2025", initials: "AR", color: "#7C3AED" },
                  { name: "Carlos Lima", role: "Gestor de Contratos", profile: "Aprovador", last: "07/07/2025", initials: "CL", color: "#B45309" },
                ].map((u) => (
                  <tr key={u.name} style={{ borderBottom: "1px solid #F8FAFC" }}>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 999, background: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>{u.initials}</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#071A3D" }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748B" }}>{u.role}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 11, background: u.profile === "Administrador" ? "#FEF3C7" : u.profile === "Aprovador" ? "#ECFDF5" : "#F1F5F9", color: u.profile === "Administrador" ? "#92400E" : u.profile === "Aprovador" ? "#065F46" : "#475569", borderRadius: 6, padding: "2px 9px", fontWeight: 700 }}>
                        {u.profile}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: "#94A3B8" }}>{u.last}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#64748B" }}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shared ───────────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#374151" }
const inputStyle: React.CSSProperties = {
  padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8,
  fontSize: 13, color: "#071A3D", background: "#FFFFFF", outline: "none", fontFamily: "Inter, sans-serif",
}
const textareaStyle: React.CSSProperties = {
  width: "100%", padding: "10px 13px", border: "1px solid #E2E8F0", borderRadius: 8,
  fontSize: 13, color: "#071A3D", background: "#FFFFFF", outline: "none", fontFamily: "Inter, sans-serif",
  resize: "vertical", lineHeight: 1.6, boxSizing: "border-box",
}
const btnPrimary: React.CSSProperties = {
  padding: "9px 22px", border: "none", borderRadius: 8,
  background: "#2563EB", fontSize: 13, fontWeight: 600, color: "#FFFFFF", cursor: "pointer",
}

function SettingsCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 22px" }}>
      <h3 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 15, fontWeight: 700, color: "#071A3D", margin: "0 0 4px" }}>{title}</h3>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{desc}</p>
      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>{children}</div>
    </div>
  )
}

function FileUploadArea({ placeholder, accept, onFile }: { placeholder: string; accept: string; onFile: (name: string) => void }) {
  return (
    <label style={{ display: "block", cursor: "pointer" }}>
      <input type="file" accept={accept} style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f.name) }} />
      <div style={{ border: "2px dashed #CBD5E1", borderRadius: 10, padding: "28px 20px", textAlign: "center", background: "#FAFAFA", transition: "border-color 0.15s" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 10px", display: "block" }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>{placeholder}</p>
        <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94A3B8" }}>{accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")}</p>
      </div>
    </label>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", padding: 0,
        background: checked ? "#2563EB" : "#CBD5E1", transition: "background 0.2s", position: "relative", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 4, left: checked ? 23 : 4,
        width: 16, height: 16, borderRadius: 999, background: "#FFFFFF", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  )
}
