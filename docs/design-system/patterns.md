# Patterns

## Padrao de nomenclatura

Padrao predominante encontrado:

- Classes especificas com prefixo `tirr__`.
- Utilitarios Bootstrap para composicao.
- Sobrescrita de Bootstrap em `src/styles/global.css`.

Exemplos:

- `.tirr__header`
- `.tirr__header__content-item`
- `.tirr__page__img`
- `.tirr__calendar-time-page__calendar-grid`
- `.tirr__validaditon-page__info-item`
- `.tirr__admin__header-menu__item`

Inconsistencia de escrita:

- `.tirr__validaditon-page__*` parece conter erro de digitacao em `validation`.
- `.tirr__calendar-time-page_btn-date-icons` usa um underscore antes de `btn`, diferente do padrao com `__`.

## Layout publico de agendamento

Arquivo: `src/routing.tsx`

Estrutura:

- `Header` fixo/sticky no topo.
- `main.container.py-4`.
- Cada etapa usa conteudo vertical com espacamento inferior para rodape.
- Acoes principais ficam em `fixed-bottom`.

Fluxo:

1. Escolha do servico.
2. Dia e horario.
3. Dados pessoais.
4. Confirmacao.

## Layout administrativo

Arquivo: `src/routing.tsx` e `src/page/administrator/Dashboard.tsx`

Estrutura:

- `AdminLayout` com `main`.
- Dashboard em `container-fluid bg-light min-vh-100 py-3`.
- Header administrativo absoluto.
- Calendario ocupando `calc(100vh - 210px)`.
- Menu mobile fixo inferior.

## Padrao de superficie

Superficies encontradas:

- Cards e paineis brancos: `bg-white`.
- Fundo geral: `bg-light`, `bg-default` ou `--bg-color`.
- Paineis de calendario: `bg-white rounded-3`.
- Formularios/cards principais: `bg-white rounded-4`.
- Itens de resumo: fundo branco, radius `1rem`, padding `1rem`.

## Padrao de selecao

Selecionado:

- Servico selecionado: `border-primary shadow-sm tirr__page__btn-outline-border`.
- Dia/horario selecionado: `btn-primary border-0`.
- Periodo selecionado: `btn-primary`.
- Header admin ativo: `.active` com `background: var(--color-primary)` e `color: #fff`.

Nao selecionado:

- Servico sem classes extras.
- Dia/horario com `bg-white`.
- Periodo com `btn-outline-primary`.
- Step futuro com `bg-white text-gray-light border`.

## Padrao de loading e vazio

Loading:

- Servicos: `alert alert-info` com texto `Carregando servicos...`.
- Dias: `text-center small text-muted py-2`.
- Horarios: `text-center small text-muted py-3`.
- Confirmacao: botao troca texto para `Agendando...`.

Vazio:

- Horarios: `Nenhum horario disponivel.`
- Confirmacao sem dados: `Nenhum agendamento encontrado.`

Problema:

- Feedback de loading usa padroes visuais diferentes entre paginas.

Sugestao:

- Criar um padrao unico de `InlineStatus` ou `EmptyState` baseado nas classes ja usadas.

## Padrao de formulario

Encontrado em `ProfilePage.tsx`:

- Formulario vertical.
- Labels com `font-size-15`.
- Inputs com borda inferior.
- Erros abaixo do campo em `small.text-danger`.
- Submit desabilitado enquanto formulario invalido.

Sugestao:

- Extrair campos para componente reutilizavel antes de adicionar novos formularios.

## Padrao de navegacao

Fluxo publico:

- Header mostra progresso por etapas.
- Botoes `Voltar` e `Proximo` no rodape.
- Confirmacao troca acao primaria para `Agendar`.

Admin:

- Header com abas `Hoje` e `Mes`.
- Mobile menu com Agenda, Clientes, Servicos e Perfil.
- Dashboard tem botoes de dia anterior/proximo.

Problemas:

- `MobileMenu` inicia `active` como `"home"`, mas nenhum item tem id `"home"`, entao nenhum item nasce ativo.

## Padrao de calendario

Fluxo publico:

- Calendario mensal customizado.
- Dias indisponiveis ficam `disabled`.
- Dias preview recebem `opacity-25`.
- Navegacao mensal por setas.

Admin:

- Usa React Big Calendar.
- Header nativo oculto com `.rbc-time-header { display: none; }`.
- Eventos amarelos com sombra e radius `12px`.
- Linha atual vermelha `#ff4d4f`.
- Scrollbar customizada.

## Componentes duplicados ou candidatos a extracao

| Candidato | Evidencia |
| --- | --- |
| `FixedActionBar` | Mesmo rodape fixo em quatro paginas |
| `ActionButton`/`Button` | Variantes de botao repetidas; arquivo compartilhado vazio |
| `ServiceCard` | Card de servico no inicio e resumo |
| `SummaryInfoItem` | Itens de resumo repetidos em confirmacao |
| `TextField` | Tres campos com estrutura quase identica no perfil |
| `CalendarDayButton` | Botao de dia com estado selected/disabled/preview |
| `PeriodSegmentedControl` | Botoes Dia/Noite com padrao de segmented control |
| `InlineStatus` | Loading/vazio repetidos com pequenas diferencas |

## Inconsistencias visuais

- Mistura de `bg-warning` e `bg-primary` para representar a cor primaria.
- Hover de `.btn-primary` declarado em azul, mas sistema visual e amarelo.
- Uso de `#fff` e `#ffffff` junto de `--color-white`.
- Uso de `#4A4A3D` hardcoded junto de `--default-text-color`.
- Duas faixas responsivas usam classes `font-size-sm-*`.
- Classes usadas sem definicao local: `cursor-pointer`, `transition`, `animate-fade-in`.
- Estados `active` e `hovered` do `MobileMenu` nao possuem estilo encontrado.
- Existem seletores CSS aparentemente sem uso.

## Sugestoes de padronizacao

- Tratar `--color-primary` como fonte unica da cor primaria e substituir `bg-warning` onde a intencao for identidade do produto.
- Consolidar estados de botao usando os tokens primario, hover e active ja declarados.
- Extrair os candidatos de componentes antes de expandir novas telas.
- Adotar um unico padrao para nomes `tirr__block__element` e corrigir variacoes.
- Remover classes sem definicao ou implementar seus estilos.
- Manter documentacao separando "tokens reais" de "valores encontrados".
