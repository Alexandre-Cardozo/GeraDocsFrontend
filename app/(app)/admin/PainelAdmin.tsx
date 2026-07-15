"use client"

import Link from "next/link"

import { StatCard } from "@/components/ui"
import { IconArrowRight, IconBuilding, IconUser } from "@/components/ui/icons"
import { SkeletonRows } from "@/components/shared/estados"
import { usePrefeituras, useSessao, useUsuarios } from "@/lib/api/hooks"
import { PERFIL_ACESSO_LABEL } from "@/lib/types"

/** Painel do administrador geral — visão de sistema (prefeituras e servidores). */
export default function PainelAdmin() {
  const { data: sessao } = useSessao()
  const prefeituras = usePrefeituras()
  const usuarios = useUsuarios()

  const totalPref = prefeituras.data?.length ?? 0
  const lista = usuarios.data ?? []
  // Usuários operacionais das prefeituras — o admin geral (LAHHM) não entra na contagem.
  const usuariosPrefeitura = lista.filter((u) => u.perfilAcesso !== "admin_geral")
  const totalServidores = usuariosPrefeitura.length
  const coordenadores = lista.filter((u) => u.perfilAcesso === "coordenador").length
  const prefeiturasOrdenadas = [...(prefeituras.data ?? [])].sort((a, b) => a.id.localeCompare(b.id))

  return (
    <div className="max-w-content p-4 sm:p-5 lg:p-7">
      <div className="mb-6">
        <p className="m-0 mb-1 text-base text-text-3">Administração do Sistema · LAHHM</p>
        <h2 className="m-0 font-display text-3xl font-extrabold tracking-tight text-text-1">
          Bem-vindo, {sessao?.usuario.primeiroNome ?? "Administrador"}
        </h2>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 xs:grid-cols-3">
        <StatCard label="Prefeituras" value={String(totalPref)} icon={IconBuilding} tone="royal" />
        <StatCard label="Servidores" value={String(totalServidores)} icon={IconUser} tone="success" />
        <StatCard label="Coordenadores" value={String(coordenadores)} icon={IconUser} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link href="/admin/prefeituras" className="flex items-center gap-4 rounded-card border border-border bg-surface p-5 no-underline transition-colors hover:bg-ice">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-tint-royal-bg text-royal">
            <IconBuilding size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-md font-bold text-text-1">Prefeituras</span>
            <span className="block text-sm text-text-3">Cadastrar, editar e configurar prefeituras.</span>
          </span>
          <IconArrowRight size={16} strokeWidth={2.5} />
        </Link>
        <Link href="/admin/servidores" className="flex items-center gap-4 rounded-card border border-border bg-surface p-5 no-underline transition-colors hover:bg-ice">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-tint-success-bg text-success">
            <IconUser size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-md font-bold text-text-1">Servidores</span>
            <span className="block text-sm text-text-3">Criar servidores e vinculá-los às prefeituras.</span>
          </span>
          <IconArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </div>

      {/* Prefeituras */}
      <div className="mt-6 overflow-hidden rounded-card border border-border bg-surface">
        <div className="border-b border-border-soft px-5 py-4">
          <h3 className="m-0 font-display text-lg font-bold text-text-1">Prefeituras</h3>
        </div>
        {prefeituras.isPending ? (
          <SkeletonRows rows={3} />
        ) : (
          <div className="divide-y divide-ice">
            {prefeiturasOrdenadas.map((p) => {
              const servidores = lista.filter((u) => u.prefeituraId === p.id).length
              return (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ice text-text-3">
                    <IconBuilding size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-semibold text-text-1">{p.orgao}</div>
                    <div className="font-mono text-xs text-text-muted">{p.id} · {p.unidade}</div>
                  </div>
                  <div className="text-sm text-text-3">{servidores} servidor(es)</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-text-muted">
        {totalServidores} usuário(s) nas prefeituras · {coordenadores} {PERFIL_ACESSO_LABEL.coordenador.toLowerCase()}(es) e{" "}
        {totalServidores - coordenadores} {PERFIL_ACESSO_LABEL.servidor.toLowerCase()}(es).
      </p>
    </div>
  )
}
