# Accessibility

## Runtime atual

- Login e cadastro usam formularios nativos e feedback persistente.
- Agenda publica usa botoes reais para servico, profissional, data e horario.
- Menu administrativo preserva texto no desktop, colapso e navegacao inferior mobile.
- Topbar fixo mantem titulo e descricao durante o scroll.
- `PageFeedback`, `AsyncState` e a troca de empresa usam estados persistentes.
- Drawers separam titulo, conteudo rolavel e acoes.

Implementado: foco contido e Escape nos drawers, Escape nos menus, `aria-current` no wizard, `aria-pressed` nas selecoes publicas, foco na etapa ativa e texto escuro sobre o amarelo primario.

## Implementado na jornada publica legada

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

- Navegacao por teclado no React Big Calendar administrativo.
- Validacao visual em zoom de 200% no editor de expediente.
- Texto alternativo das imagens remotas de servico: no fluxo atual elas sao decorativas porque nome e descricao adjacentes identificam o item.

## Tema

- O primeiro acesso respeita `prefers-color-scheme` e a escolha posterior e persistida.
- O controle de tema possui nome acessivel que descreve a proxima acao.
- Controles nativos recebem `color-scheme` adequado no tema escuro.
- Animacoes sao reduzidas quando `prefers-reduced-motion` esta ativo.

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
# Requisitos dos novos fluxos

- O seletor de empresa informa `aria-expanded` e mantem nome acessivel durante o estado de troca.
- Navegacao, tabs, drawers e dialogs possuem rotulos semanticos.
- Loading nao remove silenciosamente o conteudo sem apresentar um estado com `role="status"`.
- Erros de operacao usam `role="alert"` e nao dependem somente de cor.
- Controles de status mantem texto visivel alem da variacao visual.
- A navegacao mobile preserva alvos de toque e move recursos secundarios para o menu Mais.
- Formularios associam labels e mensagens aos campos; comandos ficam desabilitados durante envio para evitar duplicidade.
