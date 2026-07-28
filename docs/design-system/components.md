# Components

## Inventario

Componentes compartilhados existentes:

| Componente | Arquivo | Descricao | Variacoes/estados encontrados |
| --- | --- | --- | --- |
| `Header` | `src/shared/Header/index.tsx` | Header sticky do fluxo de agendamento com stepper e barra de progresso | Etapa atual, etapa concluida, etapa futura |
| Icones SVG | `src/shared/icons.tsx` | Icones internos para agendamento | Mail, Calendar, Moon, Sun, CarretLeft, CarretRight, Check, Phone, User |
| `Button` | `src/shared/Button/index.tsx` | Arquivo reservado para botao compartilhado | Vazio |
Item ativo, notificacao com badge |
| `MobileMenu` | `src/page/administrator/MobileMenu.tsx` | Navegacao administrativa responsiva: barra inferior mobile e barra lateral desktop | Item ativo, hover, foco e identificacao da conta |
| `TopBar` | `src/page/administrator/TopBar.tsx` | Contexto da tela administrativa e acoes globais | Titulo e descricao por rota, notificacoes e logout |
| `Dashboard` | `src/page/administrator/Dashboard.tsx` | Agenda administrativa com resumo e calendario | Dia/semana, navegacao por data e retorno para hoje |

Paginas do fluxo publico:

| Pagina | Arquivo | Componentes implicitos |
| --- | --- | --- |
| Escolha de servico | `ChoiceServicePage.tsx` | Categoria, card de servico, footer de acao |
| Escolha de data/hora | `ChoiceDataAndTimePage.tsx` | Painel de calendario, botao circular de dia, segmented control, grid de horarios, footer de acoes |
| Perfil | `ProfilePage.tsx` | Formulario, campo com borda inferior, footer de acoes |
| Confirmacao | `ValidationPage.tsx` | Grupo de resumo, item de resumo com icone, card de servico resumido, footer de acoes |
| Design system interno | `DesignSystemPage.tsx` | Showcase estatico de cores, icones, grid, breakpoints, spacing, shadows e radius |

## Header do fluxo

Arquivo: `src/shared/Header/index.tsx`

Estrutura:

- Container principal: `.tirr__header shadow-sm`
- Itens do stepper: `.tirr__header__content-item rounded-circle`
- Barra de progresso: Bootstrap `.progress` e `.progress-bar bg-warning`

Estados:

- Concluido: `bg-warning text-white border-0` com `CheckIcon`
- Atual: `bg-warning text-white border-0` e label visivel
- Futuro: `bg-white text-gray-light border tirr__header__border-color`

Tokens e classes usados:

- `height: 65px`
- Item de stepper `32px x 32px`
- Progresso inline com `height: 4px`
- `steps` de `src/constants/steps.ts`

Problemas:

- Usa `bg-warning` em vez de `bg-primary`, mesmo com token primario proprio.
- Usa `animate-fade-in`, mas esta classe nao foi encontrada no CSS local.

## Icones internos

Arquivo: `src/shared/icons.tsx`

Icones:

- `MailIcon`
- `CalendarIcon`
- `MoonIcon`
- `SunIcon`
- `CarretLeftIcon`
- `CarretRightIcon`
- `CheckIcon`
- `PhoneIcon`
- `UserIcon`

Padroes:

- Tamanhos pequenos: `9`, `10`, `16`, `23`, `25`.
- Alguns usam `currentColor`.
- Outros usam `#4A4A3D` hardcoded.

Problemas:

- Cor hardcoded duplica `--default-text-color`.
- `CarretRightIcon` e obtido por rotacao inline de `CarretLeftIcon`.

Sugestao:

- Padronizar icon color via `currentColor` quando possivel.

## Botoes

Nao ha componente de botao implementado em `src/shared/Button/index.tsx`.

Padroes reais usados:

| Padrao | Classes |
| --- | --- |
| Primario cheio | `btn btn-primary w-100 p-3 font-size-17 fw-bold` |
| Outline primario | `btn btn-outline-primary w-100 p-3 font-size-17 fw-bold` |
| Dia de calendario | `btn fw-bold btn-sm rounded-circle border-dark tirr__calendar-time-page__calendar-item` |
| Periodo/Horario | `btn tirr__calendar-time-page__btn-hours` |
| Admin anterior/proximo | `btn btn-light border` |
| Icone de mes | `tirr__calendar-time-page_btn-date-icons` |

Estados:

- `disabled` em botoes de continuar, voltar, dias, periodos e horarios.
- `isSelected` alterna entre `btn-primary border-0` e `bg-white`.
- `active` no menu admin.
- `hover` global definido em `.btn:hover`.

Problemas:

- Botoes de fluxo sao duplicados em quatro paginas.
- `.btn-primary` tem tokens de hover/active conflitantes com a regra `.btn:hover`.
- `Button` compartilhado vazio.

Sugestao:

- Implementar `Button` compartilhado a partir das variantes ja usadas: primary, outline-primary, light, icon.

## Card de servico

Arquivos:

- `src/page/scheduler/ChoiceServicePage.tsx`
- `src/page/scheduler/ValidationPage.tsx`

Padrao visual:

- Superficie branca.
- Imagem circular `60px x 60px`.
- Titulo `font-size-17 fw-bold`.
- Descricao `font-size-13 fw-light text-muted`.
- Preco `fw-bold text-primary`.

Estado selecionado em `ChoiceServicePage`:

- `border-primary`
- `shadow-sm`
- `.tirr__page__btn-outline-border`

Problemas:

- Markup repetido sem componente.
- Usa `cursor-pointer` e `transition`, mas estas classes nao foram encontradas no CSS local.

Sugestao:

- Extrair `ServiceCard` com props para `selected`, `onSelect` e modo `summary`.

## Formulario de perfil

Arquivo: `src/page/scheduler/ProfilePage.tsx`

Padroes:

- Container `bg-white border-0 rounded-4 px-4 py-4`.
- Labels `form-label font-size-15`.
- Inputs `form-control rounded-0 border-0 border-bottom bg-white`.
- Borda inferior customizada `.tirr__profile-page__border-color`.
- Erros com `small.text-danger`.

Estados:

- Validacao por `react-hook-form`.
- Botao submit disabled quando `!isValid`.

Problemas:

- Campo com borda inferior poderia ser componente.
- Mensagens de erro dependem de texto local por campo.

Sugestao:

- Extrair `TextField` seguindo o padrao atual de label, input e erro.

## Calendario do fluxo

Arquivo: `src/page/scheduler/ChoiceDataAndTimePage.tsx`

Partes:

- Painel branco `bg-white rounded-3 py-2`.
- Header mensal com botoes de seta.
- Grid de 7 colunas em `.tirr__calendar-time-page__calendar-grid`.
- Dia como botao circular `35px x 35px`.
- Estado selecionado com `btn-primary border-0`.
- Estado indisponivel via `disabled`.
- Estado preview com `opacity-25`.

Problemas:

- `minHeight: 330px` inline repetido.
- Cores de setas hardcoded.
- Classe `.tirr__calendar-time-page__calendar-container` existe no CSS, mas nao foi encontrada em uso.

Sugestao:

- Extrair `CalendarPanel` e `CalendarDayButton`.

## Segmented control Dia/Noite

Arquivo: `src/page/scheduler/ChoiceDataAndTimePage.tsx`

Padrao:

- Container `d-flex flex-inline w-100 p-1 bg-light rounded-4 gap-1 my-3`.
- Opcoes com `btn w-50 border-0 d-flex gap-1 align-items-center justify-content-center`.
- Estado ativo `btn-primary`.
- Estado inativo `btn-outline-primary`, com `text-dark` na opcao Noite.
- Icones `SunIcon` e `MoonIcon`.

Sugestao:

- Extrair componente de segmented control usando as classes atuais.

## Rodape fixo de acoes

Arquivos:

- `ChoiceServicePage.tsx`
- `ChoiceDataAndTimePage.tsx`
- `ProfilePage.tsx`
- `ValidationPage.tsx`

Padrao:

- `fixed-bottom`
- `bg-light`
- `p-3`
- `shadow-lg`
- Botoes `w-100`
- Gap `gap-2` quando ha duas acoes.

Problemas:

- Classes duplicadas (`d-flex`, `justify-content-end`, `w-100`) aparecem no mesmo elemento em algumas paginas.
- Necessidade de `mb-6` no conteudo para evitar sobreposicao.

Sugestao:

- Extrair `FixedActionBar`.

## Navegacao administrativa

### MobileMenu

Arquivo: `src/page/administrator/MobileMenu.tsx`

Padrao atual:

- Mobile: nav fixo inferior com altura de `80px`.
- Desktop: a mesma navegacao torna-se uma barra lateral fixa de `232px`.
- Itens usam icones Bootstrap, label e estado `.active` com fundo `--color-gray-lighter`.
- A barra lateral apresenta marca e identificacao da conta.

## Superficies administrativas

Componentes implicitos em `src/page/administrator`:

- `tirr__admin__stat-card`: resumo compacto com icone, contexto e valor.
- `tirr__admin__panel`: superficie principal com borda discreta e raio de `8px`.
- `tirr__admin__status`: badge de estado; `is-active` usa a cor primaria.
- `tirr__admin__icon-button`: acao apenas com icone, nomeada por `aria-label`.
- `tirr__admin__search`: campo de busca para listas operacionais.
