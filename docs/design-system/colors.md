# Colors

## Fonte da verdade

As cores abaixo foram encontradas em `src/styles/global.css`, `src/styles/tokens.css`, `src/styles/calendar.css`, `src/shared/icons.tsx` e paginas TSX. Somente as cores declaradas em `:root` sao tratadas como tokens.

## Tokens de cor existentes

| Token | Valor | Uso observado |
| --- | --- | --- |
| `--default-text-color` | `#4A4A3D` | Texto global, `html`, headings, body, menu mobile |
| `--bg-color` | `#f4f4f4` | Fundo do app e `#root` |
| `--color-primary` | `#f2b705` | Primaria, `btn-primary`, `text-primary`, `border-primary`, eventos do calendario |
| `--color-primary-hover` | `#d99f04` | Link hover via `--bs-link-hover-color`; nao aparece aplicado diretamente em botao |
| `--color-primary-active` | `#c48f03` | Declarado; nao foi encontrado uso direto |
| `--color-white` | `#ffffff` | Superficies brancas e texto branco |
| `--color-gray-light` | `#c9c8c8` | Borda Bootstrap, texto/bgs utilitarios, imagens placeholder |
| `--color-gray-medium` | `#aaaaaa` | Utilitarios `bg-gray-medium` e `text-gray-medium` |
| `--color-gray-lighter` | `#ebebeb` | Fundo claro via `--bs-light` e utilitarios |
| `--color-text-dark` | `#4a4a3d` | Texto escuro, `--bs-dark` |

## Aliases Bootstrap configurados

| Token Bootstrap | Valor |
| --- | --- |
| `--bs-primary` | `var(--color-primary)` |
| `--bs-body-color` | `var(--default-text-color)` |
| `--bs-body-bg` | `var(--bg-color)` |
| `--bs-white` | `#ffffff` |
| `--bs-gray-light` | `#f8f8f8` |
| `--bs-secondary` | `var(--color-gray-light)` |
| `--bs-light` | `var(--color-gray-lighter)` |
| `--bs-dark` | `var(--color-text-dark)` |
| `--bs-dark-rgb` | `74, 74, 61` |
| `--bs-border-color` | `var(--color-gray-light)` |
| `--bs-link-color` | `var(--color-primary)` |
| `--bs-link-hover-color` | `var(--color-primary-hover)` |

## Classes utilitarias de cor

Backgrounds em `src/styles/tokens.css`:

- `.bg-primary`
- `.bg-white`
- `.bg-gray-light`
- `.bg-gray-lighter`
- `.bg-default`
- `.bg-gray-medium`

Textos em `src/styles/tokens.css`:

- `.text-primary`
- `.text-white`
- `.text-gray-light`
- `.text-gray-lighter`
- `.text-dark`
- `.text-gray-medium`
- `.text-default`
- `.text-4a4a3d`

## Valores hardcoded encontrados

Estes valores existem no codigo, mas nao sao tokens documentados em `:root`.

| Valor | Onde aparece | Observacao |
| --- | --- | --- |
| `#fff` | Botoes, admin, calendario | Mesmo valor de `--color-white`, usado diretamente |
| `#0b5ed7` | `.btn-primary` hover bg | Azul Bootstrap em conflito com a identidade primaria amarela |
| `#0a58ca` | `.btn-primary` hover border | Azul Bootstrap em conflito com a identidade primaria amarela |
| `#0a53be` | `.btn-primary` active border | Azul Bootstrap em conflito com a identidade primaria amarela |
| `#ecb306` | `.btn-primary` active bg | Proximo da primaria, mas nao usa `--color-primary-active` |
| `#E2E4E5` | `.tirr__profile-page__border-color` | Borda de inputs do perfil |
| `#6c757d` | `.tirr__admin__header-menu__item` | Cinza textual administrativo |
| `#343a40` | `.tirr__admin__header-menu__notification` | Cinza escuro administrativo |
| `#fafafa` | `.rbc-time-gutter` | Fundo do gutter do calendario |
| `#f1f3f5` | Bordas do calendario | Linhas de grade do calendario |
| `#868e96` | `.rbc-label` | Texto de horarios do calendario |
| `#ff4d4f` | `.rbc-current-time-indicator` | Linha de horario atual |
| `#fafcff` | `.rbc-today` | Fundo do dia atual |
| `#ced4da` | Scrollbar do calendario | Thumb de scroll |
| `#e9ecef` | `.calendar-top-bar`, hover | Borda/fundo do top bar |
| `#f8f9fa` | `.calendar-top-bar__button` | Fundo do botao do top bar |
| `#cccccc` | `ChoiceDataAndTimePage.tsx` | Icone de seta desabilitado |
| `#4A4A3D` | Icones SVG e `ChoiceDataAndTimePage.tsx` | Mesmo valor de texto, usado diretamente |

## Estados de cor

### Botoes primarios

Encontrado em `.btn-primary`:

- Texto: `#fff`
- Fundo: `var(--color-primary)`
- Borda: `var(--color-primary)`
- Hover declarado: azul Bootstrap (`#0b5ed7`, `#0a58ca`)
- Active declarado: `#ecb306` com borda azul `#0a53be`
- Disabled: `var(--color-primary)`

Regra global encontrada:

- `.btn:hover` forca `background-color` e `border-color` para `var(--color-primary)`.

Inconsistencia: o hover declarado em `.btn-primary` nao corresponde a regra global `.btn:hover` nem aos tokens `--color-primary-hover` e `--color-primary-active`.

### Botoes outline

Encontrado em `.btn-outline-primary`:

- Texto: `var(--color-primary)`
- Borda: `var(--color-primary)`
- Hover: fundo/borda `var(--color-primary)`, texto `#fff`
- Active: fundo/borda `var(--color-primary)`, texto `#fff`
- Disabled: texto/borda `var(--color-primary)`, fundo transparente

### Estados administrativos

- `.tirr__admin__header-menu__item.active`: fundo `var(--color-primary)`, texto `#fff`.
- `MobileMenu` aplica classes `active` e `hovered`, mas nao ha regras CSS encontradas para esses estados.

## Sugestoes de padronizacao

- Usar `--color-primary-hover` e `--color-primary-active` nos estados de `.btn-primary`.
- Substituir usos diretos de `#fff` por `var(--color-white)` onde houver CSS proprio.
- Substituir `#4A4A3D` hardcoded em icones por `currentColor` ou `var(--color-text-dark)`, quando o componente permitir heranca de cor.
- Criar tokens para cinzas do calendario e admin apenas apos validacao visual; hoje eles devem ser tratados como valores hardcoded encontrados.
- Remover ou alinhar o valor `.text-4a4a3d`, pois duplica `--default-text-color` e `--color-text-dark`.
