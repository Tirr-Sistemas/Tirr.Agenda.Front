# Patterns

## Nomenclatura

O codigo usa classes proprietarias com prefixo `tirr__`, em conjunto com utilitarios Bootstrap.

Exemplos atuais:

- `tirr__scheduler-topbar`
- `tirr__scheduler-content-grid`
- `tirr__scheduler-panel`
- `tirr__booking-summary`
- `tirr__admin__navigation`
- `tirr__admin__panel`

O padrao predominante e bloco e elemento com `__`. Classes de estado usam `is-*`, como `is-selected`, `is-current`, `is-complete` e `is-navigation-collapsed`.

## Jornada publica

Fluxo real:

1. Servico em `/agendar/:businessId`.
2. Profissional.
3. Data e horario.
4. Dados do cliente.
5. Revisao e confirmacao.

`PublicSchedulerPage` mantem o passo e as selecoes no mesmo fluxo. `/agendar/empresa/:slug` resolve o estabelecimento e redireciona para a rota por identificador. Em conflito `409`, o horario e limpo, os slots sao atualizados e o usuario retorna a etapa de horario.

## Contexto de empresa

1. `BusinessSwitcher` lista `/me/businesses`.
2. A selecao chama `/auth/business-context`.
3. O JWT contextual e a rota recebem o novo `businessId`.
4. Um overlay bloqueia interacoes durante a troca.
5. As paginas recarregam os dados pela empresa ativa.

## Padrao de pagina publica

- `SchedulerPageHeader` abre cada etapa com contexto e titulo.
- O desktop organiza conteudo e `BookingSummary` em duas colunas.
- O resumo passa para baixo do conteudo em telas menores.
- `FixedActionBar` reserva a mesma area para avancar, voltar e confirmar.
- A top bar permanece fixa e o conteudo recebe foco apos navegacao.

## Padrao de selecao

| Controle | Estado selecionado |
| --- | --- |
| Servico | `is-selected`, borda de destaque, `aria-pressed=true` |
| Dia | fundo primario, `aria-pressed=true` |
| Horario | fundo primario, `aria-pressed=true` |
| Periodo | botao segmentado com fundo branco no item selecionado |
| Etapa concluida | circulo escuro com check |
| Etapa atual | circulo com fundo primario |
| Menu admin ativo | superficie `--color-gray-lighter`, texto escuro e indicador primario |

## Padrao de estados assincronos

`AsyncState` e a superficie comum para:

| Estado | Contexto atual |
| --- | --- |
| `loading` | Horarios e skeletons de servico |
| `error` | Servicos, dias, horarios e envio de agendamento |
| `empty` | Servicos ou horarios indisponiveis; data ainda nao selecionada |
| `success` | Envio concluido |

Operacoes de disponibilidade e servicos propagam resposta indisponivel como erro para que a interface diferencie falha de lista vazia. O use case final retorna `false` quando a API nao confirma o agendamento; a tela traduz isso em estado de erro sem modal do navegador.

## Padrao de formularios

- `react-hook-form` gerencia validacao do perfil.
- `FormField` associa label, input e erro por `id`.
- Email usa `type="email"` e validacao de formato.
- Telefone recebe mascara e valida entre 10 e 11 digitos.
- Dados sao normalizados com `trim()` antes de avancar.

## Layout administrativo

- Desktop a partir de `992px`: `AdminNavigation` fixa lateral com largura `232px`; modo recolhido usa `76px`.
- A top bar administrativa acompanha a largura da navegacao e permanece fixa.
- Mobile: a navegacao torna-se barra inferior com `80px`.
- Paineis administrativos mantem raio de `8px`, borda clara e alta densidade de informacao.

## Tema e superficies

- O tema e aplicado por `data-theme` no elemento raiz.
- Componentes usam `--surface-*`, `--text-*` e `--border-*`; tokens de paleta permanecem como base.
- A escolha e persistida e pode ser alterada em todas as entradas do produto.
- O React Big Calendar recebe os mesmos tokens semanticos do restante do painel.

## Politica responsiva

- `1200px+`: agenda em calendario e sidebar.
- `992px-1199px`: calendario e detalhes empilhados; navegacao lateral permanece ativa.
- `768px-991px`: navegacao inferior, agenda semanal com scroll local apenas quando necessario.
- Ate `767px`: agenda abre em Dia, controles fluidos e detalhes em uma coluna.
# Padroes de produto integrados

## Contexto multiempresa

As rotas administrativas usam `/administrador/:businessId`. Toda mudanca de empresa deve emitir um novo token contextual, cancelar a apresentacao dos dados anteriores e recalcular navegacao e comandos pelas permissoes recebidas.

## Permissoes

Itens de navegacao e comandos mutaveis sao exibidos somente quando a permissao correspondente existe. A rota tambem possui guarda propria, evitando que ocultar o menu seja a unica barreira.

## Mutacoes

Criacao e edicao usam drawer. Exclusao, revogacao, rotacao e cancelamento exigem confirmacao. O segredo de uma API Key e mostrado em dialogo modal uma unica vez.

## Datas e horarios

Datas de disponibilidade sao datas locais do estabelecimento. Instantes retornados em UTC devem ser formatados segundo o fuso do estabelecimento quando esse contexto estiver disponivel.

## Erros

Erros de campo usam `ProblemDetails.errors`. Conflitos de agenda retornam o usuario para uma escolha valida; falta de permissao produz uma pagina contextual e limite de requisicoes deve preservar os dados preenchidos.
