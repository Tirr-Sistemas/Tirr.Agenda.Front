# Colors

## Fonte da verdade

Os tokens abaixo sao os valores declarados em `src/presentation/styles/global.css`. As telas novas da agenda usam apenas esses tokens ou aliases Bootstrap configurados no mesmo arquivo.

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

O indicador do horario atual usa o token de perigo do Bootstrap. Bordas e scrollbar do calendario usam `--border-subtle` e `--border-strong`.

## Recomendacao

Novos componentes devem consumir tokens semanticos e nao depender de `--color-white` para representar superficie.

## Tokens semanticos de tema

| Papel | Tema claro | Tema escuro |
| --- | --- | --- |
| Pagina | `--surface-page` | `#171813` |
| Painel | `--surface-panel` | `#23241d` |
| Superficie sutil | `--surface-muted` | `#303229` |
| Texto principal | `--text-primary` | `#f3f3ea` |
| Texto secundario | `--text-secondary` | `#b7b9aa` |
| Borda sutil | `--border-subtle` | `#383a31` |

O amarelo permanece como identidade nos dois temas. Texto sobre amarelo usa `--color-on-primary`, evitando branco sobre a cor primaria.
