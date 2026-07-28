# Accessibility

## Pontos positivos encontrados

- Botoes usam elemento `button` real na maior parte dos casos.
- Estados `disabled` sao aplicados em acoes indisponiveis.
- Inputs possuem `type` apropriado para `email` e `tel`.
- Imagens de servico possuem `alt` com o nome do servico.
- Botao de notificacoes do admin possui `aria-label`.
- A rota administrativa possui protecao de sessao e redireciona para `/login` sem token valido.
- A tela de login possui `label` associado, `autocomplete`, mensagem de erro com `role="alert"` e controle nomeado para exibir ou ocultar senha.
- `react-hook-form` bloqueia submit invalido no formulario de perfil.

## Riscos encontrados

## Interacoes clicaveis sem semantica de botao

Em `ChoiceServicePage.tsx`, o card de servico e um `div` com `onClick`.

Risco:

- Pode nao ser acessivel por teclado.
- Pode nao anunciar estado selecionado para leitores de tela.

Sugestao:

- Transformar o card em `button` ou adicionar semantica adequada (`role`, `tabIndex`, teclado e `aria-pressed`/`aria-selected`) quando for extraido como componente.

## Icon buttons sem nome acessivel

Em `ChoiceDataAndTimePage.tsx`, botoes de mes anterior/proximo usam somente icones.

Risco:

- Leitores de tela podem nao anunciar a funcao do botao.

Sugestao:

- Adicionar `aria-label` para "Mes anterior" e "Proximo mes".

## Icones decorativos

Icones SVG internos sao usados junto de texto em cards e resumo.

Risco:

- Se forem decorativos, podem gerar ruido para tecnologia assistiva.

Sugestao:

- Quando o icone nao transmitir informacao adicional, marcar como `aria-hidden="true"` no uso ou no componente.

## Contraste e estados

Padroes de cor que exigem validacao:

- Texto branco sobre `--color-primary` (`#f2b705`) em botoes, badges e header ativo.
- Texto cinza claro `--color-gray-light` (`#c9c8c8`) sobre branco em estados futuros do stepper.
- `opacity-25` para dias preview.
- Disabled de botoes com fundo primario ainda amarelo.

Sugestao:

- Validar contraste WCAG para texto branco sobre amarelo e cinzas claros.
- Diferenciar disabled tambem por cursor, texto e/ou borda, nao apenas opacidade herdada.

## Foco visivel

O codigo usa Bootstrap, que fornece estilos de foco para varios controles. Contudo, ha elementos customizados que podem precisar de foco explicito:

- Card de servico clicavel.
- Botoes de icone de calendario.
- Menu mobile administrativo.
- Itens de menu customizados do admin.

O menu administrativo agora possui `aria-label="Menu administrativo"`.

Sugestao:

- Garantir `:focus-visible` consistente para componentes `tirr__`.

## Formularios

Encontrado:

- Labels visuais associados aos inputs por proximidade, mas sem `htmlFor`/`id`.
- Mensagens de erro renderizadas em `small.text-danger`.

Riscos:

- Associacao label/input pode nao ser explicita para leitores de tela.
- Erros podem nao ser anunciados automaticamente.

Sugestoes:

- Adicionar `id` nos inputs e `htmlFor` nos labels.
- Usar `aria-invalid` quando houver erro.
- Associar erro com `aria-describedby`.

## Navegacao e landmark

Encontrado:

- `main` em layouts publico e administrativo.
- `nav` em menus administrativos.

Sugestoes:

- Nomear navs administrativos com `aria-label`, por exemplo "Menu administrativo" e "Menu principal mobile".
- Evitar multiplos controles sem nome quando houver apenas icone.

## Feedback de status

Encontrado:

- Textos de loading e vazio renderizados visualmente.
- `alert()` para sucesso/erro de agendamento.

Riscos:

- Mensagens de loading podem nao ser anunciadas por leitores de tela.
- `alert()` funciona, mas cria experiencia brusca e pouco padronizada.

Sugestoes:

- Usar `role="status"` ou `aria-live="polite"` para loading e mensagens de vazio relevantes.
- Criar um componente de feedback visual para sucesso/erro antes de substituir `alert()`.

## Checklist recomendado

- Transformar card selecionavel em controle acessivel por teclado.
- Adicionar nomes acessiveis aos botoes so com icone.
- Associar labels e erros aos inputs.
- Validar contraste de `--color-primary` com texto branco.
- Garantir foco visivel para classes `tirr__`.
- Definir estilos para `active`, `hovered`, `disabled` e `focus-visible` nos componentes customizados.
