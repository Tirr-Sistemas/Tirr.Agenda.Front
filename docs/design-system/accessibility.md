# Accessibility

## Implementado na jornada publica

| Tema | Tratamento no codigo |
| --- | --- |
| Marcos de pagina | `SchedulerLayout` usa `main`; `Header` usa `header` |
| Mudanca de etapa | O `main` recebe foco apos troca de rota |
| Progresso | Stepper semantico em `ol`, com `aria-label` de etapa atual |
| Servicos | `ServiceOption` usa `button` e `aria-pressed` |
| Calendario | Dias usam `button`, `disabled`, `aria-pressed` e label de data |
| Setas do mes | Possuem `aria-label` para mes anterior e proximo mes |
| Horarios e periodo | Botoes reais com `aria-pressed` |
| Formulario | `label` associado, `aria-invalid`, `aria-describedby` e erro com `role="alert"` |
| Feedback | `AsyncState` usa `role="status"`; erros usam `role="alert"` |
| Icones decorativos | Icones Bootstrap do fluxo recebem `aria-hidden="true"` quando acompanham texto |
| Foco | Controles customizados possuem `:focus-visible` com outline primario |

## Estados operacionais

- Dias indisponiveis nao recebem interacao porque usam `disabled`.
- Botoes de continuidade so habilitam quando ha a selecao exigida nas etapas de servico e horario.
- Durante o envio, os controles de voltar e confirmar ficam desabilitados.
- Falhas de rede deixam uma mensagem persistente na tela com acao de tentativa quando aplicavel.

## Pontos que ainda exigem validacao manual

- Contraste de texto branco sobre a cor primaria amarela em todas as variantes Bootstrap.
- Contraste do texto `--color-gray-medium` em fundo branco, especialmente em metadados pequenos.
- Navegacao por teclado no React Big Calendar administrativo.
- Texto alternativo das imagens remotas de servico: no fluxo atual elas sao decorativas porque nome e descricao adjacentes identificam o item.

## Riscos legados

- `src/shared/icons.tsx` contem icones SVG com cores diretas e deve ser revisado quando voltar a ser usado em telas novas.
- Algumas classes e telas legadas ainda usam estruturas antigas de resumo e calendario; elas nao participam do fluxo publico modernizado.

## Checklist para novas telas

- Usar elementos nativos antes de adicionar roles ARIA.
- Nomear todo botao apenas com icone usando `aria-label`.
- Expor selecao com `aria-pressed` ou estado equivalente.
- Associar cada input a label e mensagem de erro.
- Garantir `:focus-visible`, hover, active e disabled em controles customizados.
- Usar `AsyncState` para carregamento, erro, vazio ou sucesso relevantes.
