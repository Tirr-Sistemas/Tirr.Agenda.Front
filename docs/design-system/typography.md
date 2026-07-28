# Typography

## Fonte principal

Fonte encontrada:

- Familia: `Poppins`
- Token: `--default-font-family: Poppins`
- Bootstrap alias: `--bs-font-sans-serif: Poppins`

Os arquivos de fonte estao em `public/fonts` e sao registrados em `src/styles/font.css`.

## Pesos carregados

| Peso | Nome encontrado | Estilos |
| --- | --- | --- |
| 100 | Thin | normal, italic |
| 200 | ExtraLight | normal, italic |
| 300 | Light | normal, italic |
| 400 | Regular | normal, italic |
| 500 | Medium | normal, italic |
| 600 | SemiBold | normal, italic |
| 700 | Bold | normal, italic |
| 800 | ExtraBold | normal, italic |
| 900 | Black | normal, italic |

## Reset tipografico global

Em `src/styles/global.css`:

- `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `html`, `body` recebem `padding: 0`, `margin: 0` e `color: var(--default-text-color)`.
- `html` recebe `font-family: var(--default-font-family)`.

## Escala de fonte utilitaria

`src/styles/tokens.css` define classes de `12px` a `40px`.

Classes globais:

- `.font-size-12` ate `.font-size-40`

Classes responsivas encontradas:

- `.font-size-xm-12` ate `.font-size-xm-40` em `max-width: 399px`
- `.font-size-sm-12` ate `.font-size-sm-40` em `400px` a `575px`
- `.font-size-sm-12` ate `.font-size-sm-40` em `576px` a `767px`
- `.font-size-md-12` ate `.font-size-md-40` em `768px` a `991px`
- `.font-size-lg-12` ate `.font-size-lg-40` em `992px` a `1199px`
- `.font-size-xl-12` ate `.font-size-xl-40` em `1200px` a `1399px`
- `.font-size-xxl-12` ate `.font-size-xxl-40` em `min-width: 1400px`

Inconsistencia: o intervalo `400px` a `575px` esta comentado como `XM`, mas as classes usam prefixo `sm`, repetindo o mesmo prefixo do intervalo `576px` a `767px`.

## Tamanhos usados nas telas

| Classe/valor | Uso observado |
| --- | --- |
| `font-size-12` | Labels de dias, badge, label do menu mobile |
| `font-size-13` | Descricoes de servico e resumo |
| `font-size-14` | Header step item, botoes de horario, item do menu admin |
| `font-size-15` | Labels do formulario |
| `font-size-16` | Data no dashboard administrativo |
| `font-size-17` | Botoes principais, titulo de servico |
| `font-size-20` | Icone de notificacao admin |
| `fs-6` | Textos introdutorios das etapas de data/hora |
| `small` | Texto auxiliar e loading |

## Pesos usados nas telas

| Classe/valor | Uso observado |
| --- | --- |
| `fw-light` | Titulos secundarios e textos de apoio |
| `fw-medium` | Label da etapa atual no header |
| `fw-semibold` | Labels de resumo, dias da semana, titulos internos |
| `fw-bold` | Botoes, preco, stepper, titulo de servico |
| `font-weight: 500` | Item de menu admin |
| `font-weight: 600` | Labels e eventos do calendario |
| `font-weight: 700` | Badge e titulo do top bar do calendario |

## Hierarquia observada

- `h1` aparece na pagina interna `DesignSystemPage`.
- `h2` e `h5` aparecem na pagina interna `DesignSystemPage`.
- `h6` e `p` predominam no fluxo de agendamento.
- `strong` e usado no dashboard administrativo para a data atual.

## Problemas encontrados

- A escala `12px` a `40px` e ampla e nao indica papeis semanticos como body, caption, title ou action.
- O prefixo `xm` parece erro de nomenclatura ou variante nao padronizada.
- O prefixo `sm` aparece em dois intervalos diferentes.
- Parte da UI usa classes Bootstrap (`fs-6`, `small`) e parte usa classes proprietarias (`font-size-13`, `font-size-17`).
- A pagina `DesignSystemPage` usa exemplos de tipografia, mas nao define um contrato reutilizavel para os componentes reais.

## Sugestoes de padronizacao

- Definir quais tamanhos realmente fazem parte da escala operacional antes de remover classes.
- Priorizar os tamanhos ja usados: `12`, `13`, `14`, `15`, `16`, `17` e `20`.
- Corrigir a nomenclatura `xm`/`sm` ou documentar oficialmente o breakpoint customizado de `400px`.
- Usar uma estrategia unica para fonte responsiva: Bootstrap (`fs-*`) ou utilitarios proprietarios (`font-size-*`), evitando mistura desnecessaria.
- Documentar pesos por papel: texto de apoio, label, titulo interno, botao e preco.
