"use client"

import { useState } from "react"

import { Button, FileUpload, FormField, InfoBanner, Input, SectionBlock, Select, Tag, Textarea, Toggle } from "@/components/ds"
import { IconCheck, IconFile, IconImage, IconPlus, IconTrash } from "@/components/ds/icons"
import { ErrorState, LoadingState } from "@/components/estados"
import { Th } from "@/components/tabela"
import { useToast } from "@/components/providers"
import { useAtualizarConfigTenant, useConfigTenant } from "@/lib/api/hooks"
import type { Secretaria } from "@/lib/types"

const tabs = [
  { key: "identidade", label: "Identidade Visual" },
  { key: "cabecalho", label: "Cabeçalho e Rodapé" },
  { key: "secretarias", label: "Secretarias" },
  { key: "pca", label: "PCA — Plano de Contratações" },
  { key: "usuarios", label: "Usuários e Permissões" },
]

export default function Configuracoes() {
  const showToast = useToast()
  const tenant = useConfigTenant()
  const atualizar = useAtualizarConfigTenant()

  const [activeTab, setActiveTab] = useState("identidade")

  // Estado local dos formulários, semeado quando o tenant carrega.
  const [logoFile, setLogoFile] = useState<string | null>(null)
  const [timbrado, setTimbrado] = useState(true)
  const [cabecalho, setCabecalho] = useState("")
  const [rodape, setRodape] = useState("")
  const [secretarias, setSecretarias] = useState<Secretaria[]>([])
  const [novaSecretaria, setNovaSecretaria] = useState("")
  const [pcaFile, setPcaFile] = useState<string | null>(null)
  const [pcaYear, setPcaYear] = useState("2025")
  const [seeded, setSeeded] = useState(false)

  // Semeia os formulários quando o tenant carrega (ajuste de estado durante o
  // render, guardado por `seeded` — evita efeito com setState síncrono).
  if (tenant.data && !seeded) {
    setSeeded(true)
    setLogoFile(tenant.data.logoArquivo)
    setTimbrado(tenant.data.timbrado)
    setCabecalho(tenant.data.cabecalho)
    setRodape(tenant.data.rodape)
    setSecretarias(tenant.data.secretarias)
    setPcaFile(tenant.data.pca.arquivo)
    setPcaYear(tenant.data.pca.ano)
  }

  if (tenant.isPending) {
    return (
      <div className="gd-page" style={{ maxWidth: "var(--content-max-settings)" }}>
        <LoadingState label="Carregando configurações..." />
      </div>
    )
  }
  if (tenant.isError) {
    return (
      <div className="gd-page" style={{ maxWidth: "var(--content-max-settings)" }}>
        <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)" }}>
          <ErrorState onRetry={() => void tenant.refetch()} />
        </div>
      </div>
    )
  }

  const salvarTenant = (patch: Parameters<typeof atualizar.mutate>[0], msg: string) => {
    atualizar.mutate(patch, {
      onSuccess: (tenantAtualizado) => {
        // Realinha o formulário com o estado canônico devolvido pela API — na
        // integração real o backend pode normalizar valores (trim, ids, contagens).
        setLogoFile(tenantAtualizado.logoArquivo)
        setTimbrado(tenantAtualizado.timbrado)
        setCabecalho(tenantAtualizado.cabecalho)
        setRodape(tenantAtualizado.rodape)
        setSecretarias(tenantAtualizado.secretarias)
        setPcaFile(tenantAtualizado.pca.arquivo)
        setPcaYear(tenantAtualizado.pca.ano)
        showToast(msg)
      },
    })
  }

  const addSecretaria = () => {
    const nome = novaSecretaria.trim()
    if (nome === "") return
    const nova: Secretaria = { id: `sec-${Date.now()}`, nome }
    const lista = [...secretarias, nova]
    setSecretarias(lista)
    setNovaSecretaria("")
    salvarTenant({ secretarias: lista }, "Secretaria adicionada.")
  }

  const removeSecretaria = (id: string) => {
    const lista = secretarias.filter((s) => s.id !== id)
    setSecretarias(lista)
    salvarTenant({ secretarias: lista }, "Secretaria removida.")
  }

  return (
    <div className="gd-page" style={{ maxWidth: "var(--content-max-settings)" }}>
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            fontWeight: 800,
            color: "var(--text-body)",
            margin: 0,
            marginBottom: 4,
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          Configurações da Prefeitura
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
          Personalize os documentos gerados e configure as informações institucionais do órgão.
        </p>
      </div>

      {/* Tabs — roláveis horizontalmente em telas estreitas */}
      <div className="gd-tabs" style={{ marginBottom: 28 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            style={{
              paddingBlock: 9,
              paddingInline: 18,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeTab === t.key ? 700 : 500,
              color: activeTab === t.key ? "var(--color-royal)" : "var(--text-secondary)",
              borderBottom: activeTab === t.key ? "var(--border-royal-2)" : "var(--border-transparent-2)",
              marginBottom: -1,
              transition: "var(--transition-fast)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Identidade Visual ── */}
      {activeTab === "identidade" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionBlock
            title="Logotipo / Brasão da Prefeitura"
            hint="O logotipo será inserido no cabeçalho dos documentos timbrados. Formatos aceitos: PNG, SVG, JPG (fundo transparente recomendado)."
          >
            {logoFile ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "var(--color-border-soft)",
                    borderRadius: "var(--radius-xl)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "var(--border-default)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <IconImage size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-body)" }}>{logoFile}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>PNG · 340 × 340 px · 48 KB</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <label style={{ cursor: "pointer" }}>
                      <input
                        type="file"
                        accept=".png,.svg,.jpg,.jpeg"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) setLogoFile(f.name)
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--color-royal)",
                          paddingBlock: 5,
                          paddingInline: 12,
                          border: "var(--border-tint-royal)",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--tint-royal-bg)",
                          cursor: "pointer",
                          display: "inline-block",
                        }}
                      >
                        Substituir
                      </span>
                    </label>
                    <Button variant="secondary" size="sm" onClick={() => setLogoFile(null)}>
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <FileUpload
                file={null}
                onChange={setLogoFile}
                placeholder="Clique para selecionar ou arraste o logotipo aqui"
                accept=".png,.svg,.jpg,.jpeg"
              />
            )}
          </SectionBlock>

          <SectionBlock
            title="Documentos Timbrados"
            hint="Quando ativado, todos os documentos gerados incluirão o brasão, o cabeçalho e o rodapé configurados. Caso desativado, os documentos serão gerados sem timbre."
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Toggle checked={timbrado} onChange={setTimbrado} label="Documentos timbrados" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-label)" }}>
                  {timbrado ? "Documentos timbrados ativados" : "Documentos sem timbre"}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                  {timbrado
                    ? "ETP, TR, Cotação e demais documentos incluirão o brasão e identificação do órgão."
                    : "Documentos serão gerados com cabeçalho e rodapé em branco."}
                </div>
              </div>
            </div>

            {timbrado && !logoFile && (
              <InfoBanner tone="warning" style={{ marginTop: 14 }}>
                Nenhum logotipo configurado. O cabeçalho será gerado apenas com o texto institucional.
              </InfoBanner>
            )}
          </SectionBlock>

          <div style={{ display: "flex", gap: 10 }}>
            <Button
              disabled={atualizar.isPending}
              onClick={() => salvarTenant({ logoArquivo: logoFile, timbrado }, "Configurações de identidade salvas com sucesso.")}
            >
              {atualizar.isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Cabeçalho e Rodapé ── */}
      {activeTab === "cabecalho" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionBlock
            title="Cabeçalho dos Documentos"
            hint="Texto exibido no topo de cada página dos documentos gerados. Use quebras de linha para organizar as informações. Variáveis disponíveis: {processo}, {data}, {secretaria}."
          >
            <Textarea value={cabecalho} onChange={(e) => setCabecalho(e.target.value)} rows={4} />
            <div
              style={{
                background: "var(--color-ice)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-xl)",
                paddingBlock: 16,
                paddingInline: 20,
                marginTop: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  fontWeight: 600,
                  letterSpacing: "var(--tracking-caps)",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Pré-visualização do Cabeçalho
              </div>
              <div style={{ borderBottom: "var(--border-navy-2)", paddingBottom: 10, display: "flex", alignItems: "flex-start", gap: 16 }}>
                {logoFile && <div style={{ width: 40, height: 40, background: "var(--color-border)", borderRadius: "var(--radius-sm)", flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  {cabecalho.split("\n").map((line, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: i === 0 ? 13 : 11,
                        fontWeight: i === 0 ? 700 : 500,
                        color: "var(--text-body)",
                        fontFamily: "var(--font-display)",
                        lineHeight: 1.5,
                      }}
                    >
                      {line || " "}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock
            title="Rodapé dos Documentos"
            hint="Texto exibido na parte inferior de cada página. Variáveis disponíveis: {processo}, {data}, {numero}, {pagina}."
          >
            <Textarea value={rodape} onChange={(e) => setRodape(e.target.value)} rows={3} />
            <div
              style={{
                background: "var(--color-ice)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-xl)",
                paddingBlock: 16,
                paddingInline: 20,
                marginTop: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  fontWeight: 600,
                  letterSpacing: "var(--tracking-caps)",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Pré-visualização do Rodapé
              </div>
              <div style={{ borderTop: "var(--border-faint)", paddingTop: 8 }}>
                <div style={{ fontSize: 10, color: "var(--color-text-muted)", textAlign: "center", fontFamily: "var(--font-body)" }}>
                  {rodape.replace("{data}", "09/07/2025").replace("{numero}", "PROC-2024-090").replace("{pagina}", "1")}
                </div>
              </div>
            </div>
          </SectionBlock>

          <div style={{ display: "flex", gap: 10 }}>
            <Button
              disabled={atualizar.isPending}
              onClick={() => salvarTenant({ cabecalho, rodape }, "Cabeçalho e rodapé salvos com sucesso.")}
            >
              {atualizar.isPending ? "Salvando..." : "Salvar Cabeçalho e Rodapé"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Secretarias (CRUD local) ── */}
      {activeTab === "secretarias" && (
        <SectionBlock
          title="Secretarias do Órgão"
          hint="As secretarias cadastradas aqui aparecem como opções de Secretaria Requisitante na criação de novos processos."
        >
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ flexGrow: 1, flexShrink: 1, flexBasis: 220 }}>
              <Input
                value={novaSecretaria}
                onChange={(e) => setNovaSecretaria(e.target.value)}
                placeholder="Ex: Secretaria de Cultura e Turismo"
              />
            </div>
            <Button icon={<IconPlus size={14} strokeWidth={2.5} />} disabled={novaSecretaria.trim() === ""} onClick={addSecretaria} style={{ height: "var(--input-height)" }}>
              Adicionar Secretaria
            </Button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {secretarias.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingBlock: 11,
                  borderBottom: i < secretarias.length - 1 ? "var(--border-soft)" : "none",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    background: "var(--tint-royal-bg)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "var(--color-royal)",
                  }}
                >
                  <IconFile size={14} />
                </span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "var(--text-body)" }}>{s.nome}</span>
                <button
                  type="button"
                  aria-label={`Remover ${s.nome}`}
                  onClick={() => removeSecretaria(s.id)}
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
                  <IconTrash size={13} />
                </button>
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {/* ── PCA ── */}
      {activeTab === "pca" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <InfoBanner tone="info">
            O <strong>Plano de Contratações Anual (PCA)</strong> é utilizado pelo modelo de IA para validar se o processo em elaboração está previsto no planejamento vigente, sugerindo o item correspondente e auxiliando no preenchimento do ETP.
          </InfoBanner>

          <SectionBlock
            title="PCA do Ano Vigente"
            hint="Anexe o PCA aprovado para o ano corrente. Formatos aceitos: PDF, XLSX, DOCX. O arquivo será utilizado como referência durante a geração dos documentos."
          >
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <FormField label="Ano de Referência">
                <Select value={pcaYear} onChange={(e) => setPcaYear(e.target.value)} style={{ width: 120 }}>
                  {["2023", "2024", "2025", "2026"].map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </Select>
              </FormField>
            </div>

            {pcaFile ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "var(--color-ice)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-xl)",
                    paddingBlock: 12,
                    paddingInline: 16,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      background: "var(--tint-royal-bg)",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "var(--color-royal)",
                    }}
                  >
                    <IconFile size={18} />
                  </span>
                  <span style={{ flex: 1, display: "block" }}>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-body)" }}>{pcaFile}</span>
                    <span style={{ display: "block", fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>
                      PCA {pcaYear} · Importado em 09/07/2025
                    </span>
                  </span>
                  <Tag tone="success">Ativo</Tag>
                </div>

                <InfoBanner tone="success" icon={<IconCheck size={14} strokeWidth={2.5} />}>
                  <strong>PCA carregado com sucesso.</strong> {tenant.data.pca.itensIndexados} itens de contratação indexados. O modelo utilizará este PCA como referência nos processos de {pcaYear}.
                </InfoBanner>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <label style={{ cursor: "pointer" }}>
                    <input
                      type="file"
                      accept=".pdf,.xlsx,.docx"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) setPcaFile(f.name)
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--color-royal)",
                        paddingBlock: 6,
                        paddingInline: 14,
                        border: "var(--border-tint-royal)",
                        borderRadius: 7,
                        background: "var(--tint-royal-bg)",
                        cursor: "pointer",
                        display: "inline-block",
                      }}
                    >
                      Substituir arquivo
                    </span>
                  </label>
                  <Button variant="secondary" size="sm" onClick={() => setPcaFile(null)}>
                    Remover PCA
                  </Button>
                </div>
              </div>
            ) : (
              <FileUpload
                file={null}
                onChange={setPcaFile}
                placeholder="Clique para selecionar o PCA ou arraste o arquivo aqui"
                accept=".pdf,.xlsx,.docx"
              />
            )}
          </SectionBlock>

          <div style={{ display: "flex", gap: 10 }}>
            <Button
              disabled={!pcaFile || atualizar.isPending}
              onClick={() =>
                salvarTenant(
                  { pca: { ano: pcaYear, arquivo: pcaFile, itensIndexados: tenant.data.pca.itensIndexados } },
                  "PCA salvo — o modelo o utilizará como referência."
                )
              }
            >
              {atualizar.isPending ? "Salvando..." : "Salvar PCA"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Usuários ── */}
      {activeTab === "usuarios" && (
        <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
          <div
            style={{
              paddingBlock: 16,
              paddingInline: 20,
              borderBottom: "var(--border-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-body)" }}>
              Servidores com Acesso
            </h3>
            <Button size="sm" icon={<IconPlus size={13} strokeWidth={2.5} />} onClick={() => showToast("Convite de servidores disponível na integração com o backend.")}>
              Convidar Servidor
            </Button>
          </div>
          <div className="gd-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ background: "var(--color-ice)", borderBottom: "var(--border-default)" }}>
                {["Servidor", "Cargo", "Perfil de Acesso", "Último Acesso", ""].map((h, i) => (
                  <Th key={h === "" ? `vazio-${i}` : h}>
                    {h}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tenant.data.usuarios.map((u, idx) => (
                <tr key={u.nome} style={{ borderBottom: "var(--border-row)" }}>
                  <td style={{ paddingBlock: 13, paddingInline: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "var(--radius-full)",
                          background: ["var(--color-royal)", "var(--color-teal)", "var(--color-violet)", "var(--doc-mapa)"][idx % 4],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--color-surface)",
                          flexShrink: 0,
                        }}
                      >
                        {u.iniciais}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-body)" }}>{u.nome}</span>
                    </div>
                  </td>
                  <td style={{ paddingBlock: 13, paddingInline: 16, fontSize: 12, color: "var(--text-secondary)" }}>{u.cargo}</td>
                  <td style={{ paddingBlock: 13, paddingInline: 16 }}>
                    <Tag tone={u.perfil === "Administrador" ? "warning" : u.perfil === "Aprovador" ? "success" : "neutral"}>
                      {u.perfil}
                    </Tag>
                  </td>
                  <td style={{ paddingBlock: 13, paddingInline: 16, fontSize: 12, color: "var(--color-text-muted)" }}>{u.ultimoAcesso}</td>
                  <td style={{ paddingBlock: 13, paddingInline: 16 }}>
                    <button
                      type="button"
                      onClick={() => showToast("Edição de permissões disponível na integração com o backend.")}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--text-secondary)" }}
                    >
                      Editar
                    </button>
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
