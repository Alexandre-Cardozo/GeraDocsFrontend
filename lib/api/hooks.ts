"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import * as api from "@/lib/api/client"
import type { ListaProcessosParams } from "@/lib/api/client"
import type { Tenant } from "@/lib/types"

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
  secoesETP: (id: string) => ["secoes-etp", id] as const,
  aprovacoes: ["aprovacoes"] as const,
  documentos: ["documentos"] as const,
  tenant: ["tenant"] as const,
}

export function useUsuarioAtual() {
  return useQuery({ queryKey: chaves.usuario, queryFn: api.getUsuarioAtual, staleTime: Infinity })
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

export function useSecoesETP(processoId: string) {
  return useQuery({
    queryKey: chaves.secoesETP(processoId),
    queryFn: () => api.getSecoesETP(processoId),
    enabled: processoId !== "",
  })
}

export function useAtualizarSecaoETP(processoId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { secaoId: string; conteudo: string }) =>
      api.atualizarSecaoETP({ processoId, ...input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chaves.secoesETP(processoId) })
    },
  })
}

export function useGerarSecaoETP(processoId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (secaoId: string) => api.gerarSecaoETP(processoId, secaoId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chaves.secoesETP(processoId) })
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
