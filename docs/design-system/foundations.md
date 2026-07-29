# Design System Foundations

## Escopo

Esta documentacao registra os padroes encontrados e implementados no codigo. Nenhuma cor, token ou componente foi inventado para este documento.

Fontes principais analisadas:

- `src/styles/global.css`, `src/styles/tokens.css`, `src/styles/calendar.css` e `src/styles/font.css`
- `src/shared/*`
- `src/page/scheduler/*`
- `src/page/administrator/*`
- `src/routing.tsx`

O repositorio usa `src/page` para telas e `src/shared` para componentes. Nao existem os diretorios `src/components`, `src/app` ou `pages`.

## Stack visual

- React, Vite e TypeScript.
- Bootstrap 5 para base de formulario, grid e botoes.
- Bootstrap Icons no admin e no fluxo de agendamento.
- React Big Calendar na agenda administrativa.
- Poppins como familia visual global.

## Principios observados

- Fundo geral: `--bg-color`.
- Superficies operacionais: `--color-white` com borda `--color-gray-lighter` e raio de `8px`.
- Cor primaria: `--color-primary`, reservada para acao principal e selecao.
- Texto principal: `--default-text-color` e `--color-text-dark`.
- Navegacao administrativa responsiva: barra inferior no mobile e lateral fixa no desktop.
- Jornada publica em quatro etapas, com top bar fixa, progresso e rodape de acoes fixo.

## Tokens identificados

Tokens declarados em `src/styles/global.css`:

| Grupo | Tokens |
| --- | --- |
| Fonte | `--default-font-family` |
| Texto e fundo | `--default-text-color`, `--bg-color`, `--color-text-dark`, `--color-white` |
| Primaria | `--color-primary`, `--color-primary-hover`, `--color-primary-active` |
| Neutros | `--color-gray-light`, `--color-gray-medium`, `--color-gray-lighter` |
| Bootstrap | `--bs-font-sans-serif`, `--bs-primary`, `--bs-body-color`, `--bs-body-bg`, `--bs-border-color`, `--bs-light`, `--bs-dark` |

## Inventario de componentes

| Area | Componentes reais |
| --- | --- |
| Shell publico | `SchedulerLayout`, `Header`, `SchedulerPageHeader`, `FixedActionBar` |
| Escolha e resumo | `ServiceOption`, `BookingSummary`, `TimeSlot`, `CalendarPanel` |
| Formulario e feedback | `FormField`, `AsyncState` |
| Administracao | `AdminNavigation`, `TopBar`, paineis e cards locais das paginas administrativas |
| Infraestrutura | `RequireAuth`, icones SVG legados e `Button` vazio |

## Padronizacoes aplicadas

- O fluxo publico usa um unico shell em `SchedulerLayout`.
- As quatro etapas passaram a compartilhar rodape de acoes, resumo de reserva e hierarquia de pagina.
- Servicos, dias e horarios usam `button` semantico com estados de selecao.
- Carregamento, vazio, erro e sucesso usam `AsyncState`.
- O calendario de disponibilidade e os campos de perfil deixaram de depender de markup duplicado.

## Pendencias conhecidas

- `src/shared/Button/index.tsx` permanece vazio; os botoes usam as variantes Bootstrap ja configuradas.
- `src/shared/icons.tsx` ainda e legado do fluxo antigo; o novo fluxo usa Bootstrap Icons.
- Existem valores hardcoded no calendario administrativo. Eles nao foram elevados a tokens por falta de padronizacao previa.
