# Cobertura da API

## Escopo

O frontend usa `VITE_API_BASE_URL` e clientes HTTP implementados nas infraestruturas de `administration`, `scheduling` e `identity`, com configuração transversal em `src/architecture/shared/http`. As operações do backend são acessadas pela UI exclusivamente por casos de uso.

| Dominio | Operacoes | Experiencia |
| --- | ---: | --- |
| Sistema e contexto publico | 3 | Health do agendamento e identificacao da empresa por ID/slug |
| Autenticacao e perfil global | 9 | Cadastro, login, refresh, logout, troca de empresa, perfil e senha |
| Empresas e membros | 9 | Empresas participantes, membros, papeis, status, perfil e expediente |
| Agenda | 7 | Dia, semana, mes, criacao, status, cancelamento e reagendamento |
| Agendamento publico | 5 | Servicos, profissionais, datas, horarios e reserva |
| Clientes | 5 | Resumo e CRUD |
| Servicos e categorias | 9 | Resumo e CRUD de catalogo |
| Profissionais e servicos | 8 | CRUD de profissionais e vinculos com servicos |
| Disponibilidade | 10 | CRUD de regras e excecoes |
| Chaves de API | 4 | Listagem, criacao, rotacao e revogacao |
| Usuarios globais | 2 | Busca e criacao para associacao |

## Regras de integracao

- Toda consulta administrativa inclui o `businessId` da empresa ativa.
- A troca de empresa substitui o JWT contextual antes de carregar novos dados.
- `401` tenta uma renovacao de sessao e repete a requisicao uma unica vez.
- `403`, `404`, `409` e `429` sao normalizados por `ApiError`.
- Conflito `409` no agendamento publico atualiza os horarios antes de permitir nova tentativa.
- Chaves de API nao sao usadas como credencial do navegador; apenas sao administradas pela tela de integracoes.

## Dependencia externa

Recuperacao de senha por e-mail permanece fora do contrato porque o projeto nao possui provedor de e-mail ou canal de entrega seguro. A implementacao exige definir esse provedor antes de expor tokens de redefinicao.
