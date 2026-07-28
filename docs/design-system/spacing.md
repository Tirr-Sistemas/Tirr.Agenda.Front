# Spacing, Borders and Elevation

## Base encontrada

O projeto usa principalmente utilitarios Bootstrap para espacamento:

- `p-*`, `px-*`, `py-*`
- `m-*`, `mb-*`, `mt-*`, `my-*`
- `gap-*`
- `container`, `container-fluid`, `row`, `col-*`, `g-*`

Tambem ha medidas customizadas em CSS proprio e estilos inline.

## Espacamentos Bootstrap usados

| Classe | Uso observado |
| --- | --- |
| `p-1` | Segmented control Dia/Noite, wrapper de resumo |
| `p-2` | Header de data selecionada, exemplos da pagina de DS |
| `p-3` | Cards, rodapes fixos, paineis, botoes principais |
| `p-4` | Painel da pagina interna de DS |
| `p-5` | Exemplo da pagina interna de DS |
| `px-3` | Paginas do fluxo, admin, cards |
| `px-4` | Header do fluxo, painel de formulario |
| `py-2` | Paineis de calendario |
| `py-3` | Dashboard admin, mensagens de loading |
| `py-4` | Main publico |
| `py-5` | Paginas do fluxo |
| `mb-2` | Subtitulos de etapa |
| `mb-3` | Campos de formulario, admin date row |
| `mb-4` | Categorias e resumo |
| `mb-5` | Pagina interna de DS |
| `mt-4` | Rodape de ChoiceServicePage |
| `my-3` | Segmented control |
| `my-4` | Grid de horarios |
| `gap-1` | Periodos e descricao de servico |
| `gap-2` | Header, cards, footer actions, menus |
| `gap-3` | Formulario |
| `gap-4` | Resumo de confirmacao |
| `gap-5` | Layout de data/hora e formulario |
| `g-2` | Grid de servicos |
| `g-3` | Exemplos da pagina de DS |

## Espacamentos customizados

| Classe/valor | Valor | Uso |
| --- | --- | --- |
| `.mb-6` | `margin-bottom: 4rem !important` | Evitar sobreposicao com rodape fixo |
| `.tirr__calendar-time-page__calendar-grid` | `column-gap: 14px`, `row-gap: 6px`, `padding-inline: 12px` | Grid mensal |
| Media `max-width: 399px` | `column-gap: 6px`, `padding-inline: 8px` | Grid mensal mobile estreito |
| `.tirr__calendar-time-page__btn-hours` | `padding: 8px` | Botao de periodo/horario |
| `.tirr__calendar-time-page_btn-date-icons` | `padding: 0.45rem` | Botoes de navegacao do mes |
| `.tirr__validaditon-page__info-container` | `margin-bottom: 1rem`, `gap: 0.5rem` | Grupos do resumo |
| `.tirr__validaditon-page__info-item` | `padding: 1rem`, `gap: 1rem` | Itens do resumo |
| `.tirr__admin__header-menu__item` | `padding: 8px 16px` | Pills do menu admin |
| `.tirr__admin__header-menu__badge` | `padding: 0 5px` | Badge de notificacoes |
| `.rbc-event` | `padding: 8px 10px` | Evento do calendario |
| `.calendar-top-bar` | `padding: 12px 16px`, `margin-bottom: 12px` | Top bar do calendario, nao encontrada em TSX |

## Dimensoes encontradas

| Classe/valor | Valor | Uso |
| --- | --- | --- |
| `.tirr__header` | `height: 65px` | Header do fluxo |
| `.tirr__header__content-item` | `32px x 32px` | Stepper |
| `.tirr__page__img` | `60px x 60px` | Imagem de servico |
| `.tirr__calendar-time-page__calendar-container` | `max-width: 440px` | Nao encontrada em TSX |
| `.tirr__calendar-time-page__calendar-item` | `35px x 35px` | Dia no calendario |
| `.tirr__admin__dashboard-page` | `margin-top: 65px` | Compensacao do header admin |
| `.tirr__admin__mobile-menu` | `height: 80px` | Menu mobile admin |
| `.tirr__admin__header-menu` | `height: 64px` | Header admin |
| `.tirr__admin__header-menu__badge` | `min-width: 18px`, `height: 18px` | Badge admin |
| `ChoiceDataAndTimePage` | `minHeight: 330px` inline | Paineis de calendario e horarios |
| `Dashboard` | `height: calc(100vh - 210px)` inline | Area do calendario admin |
| `Header` | `height: 4px` inline | Barra de progresso |
| `Header` | `width: percentual` inline | Progresso do fluxo |

## Bordas e raios

Tokens e overrides:

- `--bs-border-width: 2px`
- `.btn { --bs-btn-border-radius: 8px; }`
- `.tirr__calendar-time-page__btn-hours { --bs-btn-border-radius: 13px !important; }`

Classes Bootstrap usadas:

- `border`
- `border-0`
- `border-bottom`
- `border-dark`
- `border-primary`
- `rounded`
- `rounded-0`
- `rounded-3`
- `rounded-4`
- `rounded-circle`
- `rounded-pill`

Valores customizados:

| Valor | Uso |
| --- | --- |
| `1rem` | Itens de resumo |
| `12px` | Eventos do React Big Calendar |
| `13px` | Botoes de horario |
| `16px` | `.calendar-top-bar` |
| `50%` | Botao do top bar do calendario |
| `999px` | Pills admin, badges e scrollbar |

## Sombras

Classes Bootstrap usadas:

- `shadow-sm`
- `shadow`
- `shadow-lg`

Valor customizado:

- `.rbc-event`: `0 2px 10px rgba(0, 0, 0, 0.08)`

## Layouts encontrados

- Fluxo publico: `Header` sticky, `main.container.py-4`, conteudo vertical e rodape fixo.
- Servicos: grid Bootstrap `row g-2`, `col-12 col-md-6 col-lg-4`.
- Data/hora: paineis brancos empilhados, grid CSS de 7 colunas para dias, grid auto-fit para horarios.
- Perfil: painel branco com formulario vertical.
- Confirmacao: lista vertical de grupos e itens de resumo.
- Admin: `container-fluid`, header absoluto, calendario ocupando altura calculada e menu mobile fixo.

## Problemas encontrados

- Rodapes fixos repetem classes e incluem duplicacoes como `d-flex` e `justify-content-end` no mesmo `className`.
- Ha dimensoes inline recorrentes (`minHeight: 330px`, `height: calc(...)`) que poderiam virar classes quando estabilizadas.
- `rounded-3`, `rounded-4`, `1rem`, `13px`, `16px` e `999px` coexistem sem regra clara de uso.
- `.tirr__calendar-time-page__calendar-container` e `.calendar-top-bar` parecem nao ser usados.
- `mb-6` existe para compensar rodapes fixos, mas nao esta conectado semanticamente a um componente de layout.

## Sugestoes de padronizacao

- Criar um componente de `FixedActionBar` usando o padrao atual de `fixed-bottom bg-light p-3 shadow-lg`.
- Documentar raios por familia: botoes, cards, calendario, pills e circulares.
- Substituir estilos inline recorrentes por classes quando o comportamento estiver validado.
- Remover ou implementar seletores CSS nao usados.
- Manter grid Bootstrap para responsividade geral e usar CSS Grid apenas onde o dominio exige grade fixa, como calendario.
