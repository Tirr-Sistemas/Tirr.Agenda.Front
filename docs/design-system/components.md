# Components

## Inventario ativo

| Componente | Arquivo | Uso e estados |
| --- | --- | --- |
| `SessionBootstrap` | `src/auth/SessionBootstrap.tsx` | Restaura sessao e contexto |
| `AccessPage` | `src/page/AccessPage.tsx` | Login e primeiro acesso |
| `PublicSchedulerPage` | `src/page/scheduler/PublicSchedulerPage.tsx` | Wizard publico de cinco etapas |
| `AdminNavigationV1` | `src/page/administrator/AdminNavigationV1.tsx` | Permissoes, colapso desktop e `Mais` mobile |
| `TopBarV1` | `src/page/administrator/TopBarV1.tsx` | Titulo, descricao, empresa e sessao |
| `BusinessSwitcher` | `src/page/administrator/TopBarV1.tsx` | Troca de empresa e JWT contextual |
| `AdminDrawer` | `src/shared/AdminUi.tsx` | Criacao e edicao com conteudo rolavel |
| `AdminTabs` | `src/shared/AdminUi.tsx` | Subrecursos do mesmo dominio |
| `PageFeedback` | `src/shared/AdminUi.tsx` | Loading, erro e retry |
| `StatusPill` | `src/shared/AdminUi.tsx` | Tons neutral, success, warning, danger e info |
| `Button` | `src/shared/Button/index.tsx` | Variantes primary, secondary, danger e ghost; loading, icone e disabled |
| `ThemeToggle` | `src/shared/ThemeToggle.tsx` | Alternancia acessivel entre temas claro e escuro |
| `ThemeProvider` | `src/theme/ThemeProvider.tsx` | Preferencia inicial, persistencia e aplicacao do tema |
| `AdminEmptyRow` | `src/shared/AdminUi.tsx` | Estado vazio em listas |
| `AsyncState` | `src/shared/AsyncState.tsx` | Loading, erro, vazio e sucesso |
| `FormField` | `src/shared/FormField.tsx` | Campo e erro associado |

Paginas ativas: `AgendaPageV2`, `CustomersPageV1`, `CatalogPage`, `TeamPageV2`, `AvailabilityPage` e `SettingsPageV2`.

## Inventario legado

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

## Shell da agenda publica legada

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

## Compatibilidade legada

Os icones SVG de `src/shared/icons.tsx` continuam disponiveis para telas antigas. O runtime ativo usa Bootstrap Icons e o componente `Button`.
# Componentes da aplicacao integrada

## BusinessSwitcher

Seletor contextual no topbar. Mostra a empresa ativa, lista apenas participacoes retornadas pela API e bloqueia interacoes durante a emissao do novo JWT contextual. No mobile, o seletor abre sobre a navegacao inferior.

## AdminDrawer

Painel lateral usado para criacao e edicao. Mantem cabecalho, conteudo rolavel e barra de acoes estaveis. Usa raio de 8px somente nos controles internos e nao cria cards aninhados.

Ao abrir, bloqueia o scroll da pagina, move o foco para o primeiro controle, mantem Tab dentro do painel, fecha com Escape e devolve o foco ao comando de origem.

## AdminTabs

Alterna subrecursos de uma mesma area, como servicos/categorias e regras/excecoes. O estado ativo usa a cor primaria existente e uma borda inferior.

## Estados de recurso

`PageFeedback`, `AsyncState` e `tirr__resource-skeleton` cobrem carregamento, erro, vazio e retry. Operacoes mutaveis tambem exibem loading no comando que iniciou a acao.

`AdminEmptyRow` aceita icone, titulo e descricao. Listas filtradas devem explicar como remover o filtro; listas sem cadastro devem indicar qual recurso aparecera ali. Agenda, operacoes do dia, equipe, configuracoes e disponibilidade publica usam estados vazios contextuais.

Em formularios com dependencias, o estado vazio deve nomear o recurso ausente e orientar onde cria-lo. `AdminDrawer.submitDisabled` bloqueia o envio nesses casos sem comunicar um falso estado de carregamento.

## Linhas operacionais

`tirr__admin__data-row` apresenta identificacao, metadados, status e acoes. No mobile, metadados secundarios sao recolhidos sem produzir scroll horizontal da pagina.

## Fluxo de agendamento

O wizard publico possui servico, profissional, data/horario, dados do cliente e revisao. O indicador de etapas e as barras de acao mantem dimensoes estaveis em desktop e mobile.
