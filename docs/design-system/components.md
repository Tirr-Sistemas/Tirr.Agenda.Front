# Components

## Inventario

| Componente | Arquivo | Uso e estados |
| --- | --- | --- |
| `SchedulerLayout` | `src/shared/SchedulerLayout.tsx` | Shell publico, reposiciona o foco no `main` a cada rota |
| `Header` | `src/shared/Header/index.tsx` | Top bar fixa, marca, progresso de quatro etapas e servico selecionado |
| `SchedulerPageHeader` | `src/shared/SchedulerPageHeader.tsx` | Eyebrow, titulo e descricao da etapa |
| `FixedActionBar` | `src/shared/FixedActionBar.tsx` | Barra fixa inferior para uma ou duas acoes |
| `ServiceOption` | `src/shared/ServiceOption.tsx` | Botao de servico, default, hover, foco e `is-selected` |
| `BookingSummary` | `src/shared/BookingSummary.tsx` | Resumo da reserva; vazio sem servico, completo com data/hora |
| `CalendarPanel` | `src/shared/CalendarPanel.tsx` | Navegacao mensal, dias disponiveis, selecionados, desabilitados, loading e erro |
| `TimeSlot` | `src/shared/TimeSlot.tsx` | Botao de horario, default, hover, foco e `is-selected` |
| `FormField` | `src/shared/FormField.tsx` | Label associado, input e mensagem de erro nomeada |
| `AsyncState` | `src/shared/AsyncState.tsx` | `loading`, `error`, `empty` e `success`; pode receber acao de retry |
| `AdminNavigation` | `src/page/administrator/AdminNavigation.tsx` | Barra inferior mobile, lateral desktop, colapso, hover, foco e ativo |
| `TopBar` | `src/page/administrator/TopBar.tsx` | Titulo e descricao por rota, notificacoes e logout |
| `RequireAuth` | `src/shared/RequireAuth.tsx` | Guarda de sessao das rotas administrativas |

## Shell da agenda publica

`SchedulerLayout` e o ponto de composicao das rotas publicas. A estrutura encontrada e:

1. `Header` fixa.
2. `main` com foco programatico apos mudanca de rota.
3. Conteudo da etapa.
4. `FixedActionBar` fixa, quando a etapa tem acao.

O index `/` redireciona para `/agenda-servico`; assim, a primeira etapa sempre tem uma rota explicita.

## Escolha de servico

`ServiceOption` e um `button`, nao um card clicavel generico.

- Imagem decorativa com `alt` vazio; nome e descricao sao texto adjacente.
- `aria-pressed` representa a selecao.
- O resumo lateral reutiliza o mesmo `ServiceModel` atraves de `BookingSummary`.
- `ChoiceServicePage` mostra skeletons, erro com retry e estado vazio antes da lista.

## Data e horario

`CalendarPanel` concentra a navegacao do mes e a grade de dias:

- Botoes de mes possuem `aria-label`.
- Dias indisponiveis usam `disabled`.
- Dia selecionado usa `aria-pressed` e classe `is-selected`.
- A disponibilidade mensal usa loading, erro e retry no proprio painel.

`TimeSlot` e usado no grid de horarios. O periodo Dia/Noite e um controle segmentado local da pagina, com `aria-pressed` em cada opcao.

## Perfil e confirmacao

`FormField` padroniza nome, email e telefone com `id`, `htmlFor`, `aria-invalid`, `aria-describedby` e `role="alert"` na mensagem de erro.

`ValidationPage` usa uma lista de definicoes para a revisao e mantem o retorno de sucesso no proprio fluxo. A confirmacao nao usa mais `alert()`; erro e sucesso sao renderizados por `AsyncState`.

## Componentes administrativos

O admin ainda possui componentes locais de pagina, por exemplo:

- `tirr__admin__panel`
- `tirr__admin__stat-card`
- `tirr__admin__status`
- `tirr__admin__icon-button`
- `tirr__admin__search`
- `tirr__admin__service-card`

Esses blocos compartilham fundo branco, borda discreta e raio de `8px`, mas ainda nao foram extraidos para `src/shared`.

## Pendencias

- `src/shared/Button/index.tsx` esta vazio. As variantes ativas continuam sendo `btn-primary` e `btn-outline-primary` do Bootstrap configurado.
- Os icones SVG de `src/shared/icons.tsx` continuam disponiveis para o codigo legado, mas o fluxo modernizado usa Bootstrap Icons.
