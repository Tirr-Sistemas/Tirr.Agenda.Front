# Spacing, Borders and Elevation

## Espacamento

O sistema combina os utilitarios Bootstrap com medidas locais nos componentes `tirr__`.

Escala semantica ativa: `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 20px` e `--space-6: 24px`.

| Contexto | Medidas encontradas |
| --- | --- |
| Shell publico | `24px` lateral desktop, `16px` mobile, `112px` abaixo da top bar e acima da action bar |
| Top bar | `80px` desktop e `72px` mobile |
| Action bar | `72px` desktop e `68px` mobile |
| Paineis | `20px` desktop e `16px` mobile |
| Grids de servico | `12px` |
| Grid de data/hora | `16px` desktop e `12px` mobile |
| Formulario | `18px` entre campos |
| Resumo de reserva | `18px` de padding e `16px` antes da data |

## Bordas e raios

| Elemento | Regra atual |
| --- | --- |
| Paineis, cards, imagens e controles | `8px` |
| Controles internos e calendario | `6px` |
| Etapas do stepper | `50%` |
| Botoes Bootstrap | `--bs-btn-border-radius: 8px` |
| Bordas de superficie | `1px solid --color-gray-lighter` |
| Bordas de entrada e selecao | `--color-gray-light`, `--color-primary-active` |

## Elevacao

O shell publico usa separacao por borda em vez de sombra. As sombras continuam concentradas em componentes Bootstrap e no calendario administrativo existentes.

## Layout responsivo

| Faixa | Comportamento |
| --- | --- |
| Acima de `991px` | Conteudo publico em duas colunas: trabalho e resumo lateral sticky |
| Ate `991px` | Resumo passa para baixo do conteudo; a agenda continua sem scroll horizontal |
| Ate `767px` | Stepper reduz para contador textual; grids de servico e data/hora empilham; botoes dividem a barra inferior |
| Ate `399px` | Margens laterais reduzem e horarios usam duas colunas |

## Problemas ainda encontrados

- O shell administrativo empilha a barra lateral da agenda entre `992px` e `1199px`, preservando largura operacional do calendario.
- Scroll horizontal deve existir apenas em componentes largos, nunca no `body` ou no workspace.
