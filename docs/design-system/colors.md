# Colors

## Fonte da verdade

Os tokens abaixo sao os valores declarados em `src/styles/global.css`. As telas novas da agenda usam apenas esses tokens ou aliases Bootstrap configurados no mesmo arquivo.

| Token | Valor | Uso atual |
| --- | --- | --- |
| `--default-text-color` | `#4A4A3D` | Texto global e conteudo operacional |
| `--bg-color` | `#f4f4f4` | Fundo do app e da jornada publica |
| `--color-primary` | `#f2b705` | Acao primaria, selecao e etapa atual |
| `--color-primary-hover` | `#d99f04` | Hover de botao/link primario |
| `--color-primary-active` | `#c48f03` | Texto de destaque, foco e borda de selecao |
| `--color-white` | `#ffffff` | Superficies e texto sobre fundo escuro |
| `--color-gray-light` | `#c9c8c8` | Bordas, dias e controles indisponiveis |
| `--color-gray-medium` | `#aaaaaa` | Texto auxiliar |
| `--color-gray-lighter` | `#ebebeb` | Divisores, superfices sutis e estado hover |
| `--color-text-dark` | `#4a4a3d` | Titulos e texto de alto destaque |

## Aliases Bootstrap

| Alias | Origem |
| --- | --- |
| `--bs-primary` | `--color-primary` |
| `--bs-body-color` | `--default-text-color` |
| `--bs-body-bg` | `--bg-color` |
| `--bs-border-color` | `--color-gray-light` |
| `--bs-light` | `--color-gray-lighter` |
| `--bs-dark` | `--color-text-dark` |

## Estados observados

| Estado | Tratamento encontrado |
| --- | --- |
| Primario | Fundo e borda `--color-primary` |
| Hover | `--color-primary-hover` nos botoes configurados; superficies de selecao usam `--color-gray-lighter` |
| Ativo | `--color-primary-active` ou fundo `--color-primary` |
| Selecionado | Borda `--color-primary-active` ou fundo `--color-primary` |
| Desabilitado | Cor `--color-gray-light`, cursor indisponivel e ausencia de interacao |
| Erro no fluxo | Icone com fundo `--color-primary`; texto permanece nos tokens escuros existentes |
| Sucesso no fluxo | Icone com fundo `--color-text-dark` e texto branco |

## Valores fora dos tokens

O calendario administrativo contem valores diretos para a linha de horario atual, bordas e scrollbar em `src/styles/calendar.css`. Eles permanecem como valores encontrados, nao como tokens do sistema.

## Recomendacao

Antes de criar novos tokens, consolidar os valores do React Big Calendar que realmente precisem se tornar parte do contrato visual.
