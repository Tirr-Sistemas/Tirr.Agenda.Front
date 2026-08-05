# Typography

## Familia e pesos

- Familia global: `Poppins`.
- Token: `--default-font-family`.
- Alias Bootstrap: `--bs-font-sans-serif`.
- Arquivo de fonte: `src/styles/font.css`, com pesos de `100` a `900`.

## Hierarquia atual

| Papel | Tamanho encontrado | Peso encontrado | Onde aparece |
| --- | --- | --- | --- |
| Titulo de pagina publica | `28px`, `23px` mobile | `700` | `SchedulerPageHeader` |
| Titulo de painel | `16px`, `17px` | `700` | calendario, formulario e confirmacao |
| Titulo de item | `13px` a `15px` | `700` | servico, resumo e menu |
| Texto de apoio | `11px` a `14px` | `400` a `600` | descricao, label e status |
| Acao | `12px` a `13px` | `700` | botoes, horarios e periodos |
| Metadado | `10px` a `12px` | `600` a `700` | stepper, resumo e menu |

## Escala ativa

| Token | Valor | Papel |
| --- | --- | --- |
| `--font-size-caption` | `10px` | Status, overline e metadado compacto |
| `--font-size-meta` | `11px` | Texto auxiliar e descricao curta |
| `--font-size-small` | `12px` | Navegacao, labels e dados secundarios |
| `--font-size-body` | `13px` | Controles, botoes e texto operacional |
| `--font-size-card-title` | `14px` | Titulos de itens e cards |
| `--font-size-section-title` | `15px` | Titulos internos de paineis |
| `--font-size-page-title` | `18px` | Titulo fixo do topbar |
| `--font-size-flow-title` | `20px` | Titulo das etapas publicas |
| `--font-size-display` | `28px` | Mensagem principal do login |

Os tamanhos dos controles foram desacoplados do padrao `16px` do Bootstrap. A altura e a area de toque permanecem inalteradas.

## Utilitarios existentes

As telas ativas usam tamanhos locais nos componentes e utilitarios Bootstrap pontuais. `tokens.css` deixou de ser carregado pelo runtime para remover utilitarios responsivos duplicados.

## Observacoes

- Nao ha escala semantica global formal para heading, body e caption.
- Ha mistura de utilitarios Bootstrap e `font-size-*` proprietario nas telas legadas.
- Novas telas devem reutilizar os papeis tipograficos encontrados antes de adicionar outro tamanho.
- Texto secundario deve usar `--text-secondary`; `--color-gray-medium` nao deve ser aplicado diretamente a novos metadados.
