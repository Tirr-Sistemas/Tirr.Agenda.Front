# Acessibilidade

## Implementado

- Foco visível consistente em links, botões e campos.
- Alvos de toque de 44 px no mobile.
- Ícones SVG decorativos fora da árvore de acessibilidade e ícones informativos nomeáveis.
- Estados de seleção com `aria-pressed`; etapa atual com `aria-current="step"`.
- Tabs com setas direcionais, `aria-selected` e apenas uma tab na ordem de foco.
- Drawers e diálogos com nome acessível, foco contido, Escape, bloqueio de scroll e retorno ao acionador.
- Confirmações destrutivas em `alertdialog`, sem depender do diálogo nativo do navegador.
- Erros com `role="alert"`; progresso e mensagens operacionais com `role="status"`.
- Tema baseado em `prefers-color-scheme` e movimento reduzido por `prefers-reduced-motion`.

## Jornada pública

O agendamento é uma lista ordenada de cinco etapas. Serviço, profissional, data e horário usam botões reais, estado pressionado e foco na seção após cada avanço. Um resumo persistente apresenta as escolhas anteriores. Formulários usam label associada, autocomplete e validação antes de avançar.

## Administração

A navegação preserva texto no desktop, oferece modo recolhido e vira barra inferior no mobile. O seletor de empresa informa expansão e estado de troca. CRUDs mantêm ação principal visível, estados vazios explicativos e confirmação antes de remoções ou rotações de credencial.

## Checklist para novas telas

- Preferir elementos HTML nativos antes de roles ARIA.
- Nomear toda ação apenas com ícone.
- Associar input, label, ajuda e erro.
- Não comunicar estado apenas por cor.
- Manter conteúdo utilizável a 200% de zoom e em 320 px de largura.
- Validar teclado, foco, Escape, loading, vazio, erro e sucesso.
- Respeitar tokens de contraste, tamanho de alvo e movimento.

O React Big Calendar continua como integração de terceiro e deve ser revalidado manualmente a cada atualização relevante da biblioteca.
