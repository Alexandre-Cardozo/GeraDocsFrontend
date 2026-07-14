"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import * as api from "@/lib/api/client"
import type { ListaProcessosParams } from "@/lib/api/client"
import type { TipoDocumento, Tenant } from "@/lib/types"

/**
 * Hooks de dados — única porta de entrada das views para a camada de API.
 * Nenhuma página importa mocks diretamente.
 */

export const chaves = {
  usuario: ["usuario"] as const,
  estatisticas: ["estatisticas"] as const,
  processos: (params: ListaProcessosParams) => ["processos", params] as const,
  processo: (id: string) => ["processo", id] as const,
  proximoNumero: ["processos", "proximo-numero"] as const,
  parecerDFD: (id: string) => ["parecer-dfd", id] as const,
  secoes: (id: string, tipo: TipoDocumento) => ["secoes", id, tipo] as const,
  aprovacoes: ["aprovacoes"] as const,
  documentos: ["documentos"] as const,
  resumoDocumentos: ["documentos", "resumo"] as const,
  tenant: ["tenant"] as const,
}

export function useUsuarioAtual() {
  return useQuery({ queryKey: chaves.usuario, queryFn: api.getUsuarioAtual, staleTime: Infinity })
}

export function useAtualizarAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (avatarDataUrl: string | null) => api.atualizarAvatar(avatarDataUrl),
    onSuccess: (usuario) => {
      queryClient.setQueryData(chaves.usuario, usuario)
    },
  })
}

export function useEstatisticas() {
  return useQuery({ queryKey: chaves.estatisticas, queryFn: api.getEstatisticas })
}

export function useProcessos(params: ListaProcessosParams = {}) {
  return useQuery({
    queryKey: chaves.processos(params),
    queryFn: () => api.getProcessos(params),
    placeholderData: (anterior) => anterior,
  })
}

export function useProcesso(id: string) {
  return useQuery({
    queryKey: chaves.processo(id),
    queryFn: () => api.getProcesso(id),
    enabled: id !== "",
  })
}

export function useProximoNumeroProcesso() {
  return useQuery({ queryKey: chaves.proximoNumero, queryFn: api.getProximoNumeroProcesso })
}

export function useCriarProcesso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.criarProcesso,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["processos"] })
      void queryClient.invalidateQueries({ queryKey: chaves.estatisticas })
    },
  })
}

export function useAtualizarProcesso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: api.AtualizarProcessoInput) => api.atualizarProcesso(input),
    onSuccess: (processo) => {
      queryClient.setQueryData(chaves.processo(processo.id), processo)
      void queryClient.invalidateQueries({ queryKey: ["processos"] })
    },
  })
}

export function useParecerDFD(processoId: string) {
  return useQuery({
    queryKey: chaves.parecerDFD(processoId),
    queryFn: () => api.getParecerDFD(processoId),
    enabled: processoId !== "",
  })
}

export function useAnalisarDFD(processoId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (arquivo: string) => api.analisarDFD(processoId, arquivo),
    onSuccess: (parecer) => {
      queryClient.setQueryData(chaves.parecerDFD(processoId), parecer)
    },
  })
}

export function useSecoes(processoId: string, tipo: TipoDocumento) {
  return useQuery({
    queryKey: chaves.secoes(processoId, tipo),
    queryFn: () => api.getSecoes(processoId, tipo),
    enabled: processoId !== "",
  })
}

export function useAtualizarSecao(processoId: string, tipo: TipoDocumento) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { secaoId: string; conteudo: string; status?: import("@/lib/types").StatusDocumento }) =>
      api.atualizarSecao({ processoId, tipo, ...input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chaves.secoes(processoId, tipo) })
    },
  })
}

export function useGerarSecao(processoId: string, tipo: TipoDocumento) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (secaoId: string) => api.gerarSecao(processoId, tipo, secaoId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chaves.secoes(processoId, tipo) })
    },
  })
}

export function useFilaAprovacoes() {
  return useQuery({ queryKey: chaves.aprovacoes, queryFn: api.getFilaAprovacoes })
}

export function useDecidirAprovacao() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.decidirAprovacao,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chaves.aprovacoes })
      void queryClient.invalidateQueries({ queryKey: ["processos"] })
    },
  })
}

export function useDocumentos() {
  return useQuery({ queryKey: chaves.documentos, queryFn: api.getDocumentos })
}

export function useResumoDocumentos() {
  return useQuery({ queryKey: chaves.resumoDocumentos, queryFn: api.getResumoDocumentos })
}

export function useGerarDocumento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: api.GerarDocumentoInput) => api.gerarDocumento(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chaves.documentos })
      void queryClient.invalidateQueries({ queryKey: chaves.resumoDocumentos })
      void queryClient.invalidateQueries({ queryKey: chaves.estatisticas })
      void queryClient.invalidateQueries({ queryKey: ["processos"] })
    },
  })
}

export function useConfigTenant() {
  return useQuery({ queryKey: chaves.tenant, queryFn: api.getConfigTenant })
}

export function useAtualizarConfigTenant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<Tenant>) => api.atualizarConfigTenant(patch),
    onSuccess: (tenant) => {
      queryClient.setQueryData(chaves.tenant, tenant)
    },
  })
}
