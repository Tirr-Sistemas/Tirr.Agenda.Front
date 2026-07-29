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

1. `/agenda-servico`
2. `/agenda-dia-e-hora`
3. `/agenda-perfil`
4. `/agenda-confirmacao`

`useScheduleNavigation` calcula a primeira etapa incompleta e redireciona apenas quando o usuario tenta acessar uma etapa posterior sem os dados necessarios. A guarda considera servico, data/hora e dados pessoais; janeiro e valido como mes `0`.

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
| Menu admin ativo | fundo primario ou superficie definida pelo layout responsivo |

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

## Inconsistencias ainda registradas

- Seletor legado `tirr__validaditon-page__*` contem erro de digitacao e nao e usado pelo fluxo novo.
- Seletor legado `tirr__calendar-time-page__*` nao e a fonte das telas de agenda atuais.
- Valores especificos de React Big Calendar continuam fora dos tokens globais.
- O componente compartilhado `Button` continua vazio, embora as variantes Bootstrap sejam consistentes visualmente.
