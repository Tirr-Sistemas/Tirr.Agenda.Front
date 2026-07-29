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

## Utilitarios existentes

`src/styles/tokens.css` declara utilitarios `font-size-12` ate `font-size-40` e variantes por breakpoint. A jornada nova usa tamanhos locais em CSS para preservar dimensoes estaveis de cards, grids e barras.

## Observacoes

- Nao ha escala semantica global formal para heading, body e caption.
- Ha mistura de utilitarios Bootstrap e `font-size-*` proprietario nas telas legadas.
- O prefixo `font-size-sm-*` aparece em dois intervalos de breakpoint em `tokens.css`; esta inconsistencia continua documentada e nao foi alterada nesta entrega.
