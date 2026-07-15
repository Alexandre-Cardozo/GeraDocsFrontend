# Autenticação, multi-prefeitura e perfis de acesso

Referência do controle de acesso do GeraDocs: quem entra, o que cada um vê e como os dados são isolados por prefeitura. Quem for mexer em login, navegação ou nas telas de administração lê isto antes.

Tudo aqui é **mockado** (Fase 1, sem backend). A auth valida credenciais contra usuários mockados e a sessão é persistida no navegador; as assinaturas em `lib/api/client.ts` já têm o formato do backend futuro.

## Os três perfis de acesso

`PerfilAcesso` (`lib/types.ts`) — distinto de `PapelUsuario` (papel no fluxo de aprovação). Um usuário tem **um** perfil de acesso e atua com papéis de workflow conforme a etapa.

| Perfil | Escopo | Pode |
|---|---|---|
| **Administrador Geral** (`admin_geral`) | Sistema todo (LAHHM) | CRUD de prefeituras; criar servidores e vinculá-los a qualquer prefeitura; visão agregada. Não opera o fluxo de processos. |
| **Coordenador** (`coordenador`) | Uma prefeitura | Tudo de servidor **+** gerir a sua prefeitura: secretarias, PCA, identidade visual, cabeçalho/rodapé, e cadastrar/ver servidores (com último acesso). |
| **Servidor** (`servidor`) | Uma prefeitura | Editar o próprio perfil; criar processos e gerar documentos; consultar o fluxo de contratação. |

## Matriz de rotas × perfil (RBAC)

Fonte única: `lib/auth/acesso.ts` (`rotaPermitida`, `navPrincipal`, `navSistema`). A guarda `components/layout/GuardaSessao.tsx` aplica no shell.

| Rota | admin_geral | coordenador | servidor |
|---|:---:|:---:|:---:|
| `/` (dashboard / painel do sistema) | ✅ (painel admin) | ✅ | ✅ |
| `/processos`, `/aprovacoes`, `/documentos` | ❌ | ✅ | ✅ |
| `/configuracoes` (prefeitura) | ❌ | ✅ | ❌ |
| `/admin/prefeituras`, `/admin/servidores` | ✅ | ❌ | ❌ |
| `/perfil` (Meu Perfil) | ❌¹ | ✅ | ✅ |

¹ O admin geral não tem prefeitura nem perfil editável de servidor; gerencia-se pela área de Administração.

Rota não permitida → redireciona para `/`. Sem sessão → redireciona para `/login`.

## Modelo multi-prefeitura

- Cada **prefeitura é um `Tenant`** (com `id`), com identidade/PCA/secretarias próprias. Fixtures: São Paulo (`PREF-001`) e Ecoporanga (`PREF-002`).
- `Processo` e `DocumentoGerado` carregam `prefeituraId`. As consultas (`getProcessos`, `getDocumentos`, `getEstatisticas`, `getFilaAprovacoes`) filtram pela prefeitura da sessão; o **admin geral vê tudo**.
- `criarProcesso` carimba o `prefeituraId` e o `responsavel` do usuário logado.

## Login e sessão

- Tela `app/(auth)/login` — fora do `AppShell`, no route group `(auth)`. Login por **CPF + senha**.
- `validaCPF` (`lib/auth/cpf.ts`) confere os dígitos verificadores. Erro de login é **genérico** ("CPF ou senha inválidos") — não revela se o CPF existe.
- A sessão (id do usuário logado) é persistida em `localStorage` (`geradocs.sessao`) e restaurada na inicialização do mock. `useSessao()` entrega `{ usuario, prefeitura }`; `usePerfil()` o perfil de acesso.
- Recuperação de senha: mock com resposta genérica.

## Acessos de demonstração

Todos com senha **`geradocs123`**. Listados no painel de demonstração da tela de login.

| CPF | Perfil | Prefeitura |
|---|---|---|
| `111.111.111-11` | Administrador Geral | — (LAHHM) |
| `222.222.222-22` | Coordenador | Ecoporanga |
| `333.333.333-33` | Servidor | Ecoporanga |
| `444.444.444-44` | Coordenadora | São Paulo |
| `555.555.555-55` | Servidor | São Paulo |

Esses CPFs são sequências repetidas que a validação real reprova; são liberados por uma **lista de exceção `CPFS_DEMO`** só nesta fase mockada. Qualquer outro CPF passa pela validação de dígitos.

## Lacunas conhecidas (fase de backend)

- **Auth real**: o mock é `client-only` e não faz autenticação de servidor. A integração troca `login/logout/getSessao` por chamadas ao backend (Spring Boot) + sessão via cookie/JWT, e move o RBAC para o servidor/middleware.
- **Usuário único de demonstração**: nesta fase, cada CPF loga isoladamente; não há hashing de senha nem recuperação real por e-mail.
- **Edição/desativação de servidores** e reatribuição entre prefeituras existem no client (`atualizarUsuario`, `removerUsuario`) e podem ganhar UI adicional conforme a necessidade.
