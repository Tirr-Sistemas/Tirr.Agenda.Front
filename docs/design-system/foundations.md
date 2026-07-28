# Design System Foundations

## Escopo da analise

Documentacao gerada a partir dos padroes encontrados no codigo existente. Nao foram criadas cores, componentes ou tokens novos.

Arquivos analisados:

- `src/styles/global.css`
- `src/styles/tokens.css`
- `src/styles/font.css`
- `src/styles/calendar.css`
- `src/shared/Header/index.tsx`
- `src/shared/Button/index.tsx`
- `src/shared/icons.tsx`
- `src/page/scheduler/ChoiceServicePage.tsx`
- `src/page/scheduler/ChoiceDataAndTimePage.tsx`
- `src/page/scheduler/ProfilePage.tsx`
- `src/page/scheduler/ValidationPage.tsx`
- `src/page/scheduler/DesignSystemPage.tsx`
- `src/page/administrator/Dashboard.tsx`
- `src/page/administrator/MobileMenu.tsx`
- `src/routing.tsx`
- `src/core.tsx`

Observacoes de estrutura:

- Nao existe diretorio `src/components`.
- Nao existem diretorios `src/app` ou `pages`.
- O projeto usa `src/page` para telas e `src/shared` para componentes compartilhados.
- `src/shared/Button/index.tsx` existe, mas esta vazio.

## Stack visual encontrada

- React com Vite.
- Bootstrap `5.3.8` como base de grid, utilitarios, botoes, formularios, sombras, textos e espacamentos.
- Bootstrap Icons para o modulo administrativo.
- Icones SVG internos em `src/shared/icons.tsx` para o fluxo de agendamento.
- React Big Calendar no dashboard administrativo.
- Fonte local Poppins carregada por `src/styles/font.css`.

## Arquitetura CSS observada

Os estilos globais sao importados em `src/core.tsx` nesta ordem:

1. `react-big-calendar/lib/css/react-big-calendar.css`
2. `src/styles/calendar.css`
3. `src/styles/font.css`
4. `src/styles/global.css`
5. `src/styles/tokens.css`

Padroes usados:

- Variaveis CSS globais em `:root`.
- Overrides de tokens Bootstrap em `src/styles/global.css`.
- Classes utilitarias proprietarias em `src/styles/tokens.css`.
- Classes especificas com prefixo `tirr__`.
- Utilitarios Bootstrap diretamente em `className`.

## Principios visuais encontrados

- Fundo geral cinza claro: `--bg-color`.
- Superficies principais brancas: `bg-white`, `#fff`, `var(--color-white)`.
- Cor primaria amarela: `--color-primary`.
- Texto principal verde/cinza escuro: `--default-text-color` e `--color-text-dark`.
- Cards e paineis com cantos arredondados (`rounded-3`, `rounded-4`, `1rem`, `16px`).
- Acoes principais no rodape fixo em telas do fluxo de agendamento.
- Fluxo publico orientado por stepper no topo.
- Administracao orientada por menu superior e menu mobile fixo.

## Tokens identificados

Tokens reais declarados em `src/styles/global.css`:

- `--default-font-family`
- `--default-text-color`
- `--bg-color`
- `--color-primary`
- `--color-primary-hover`
- `--color-primary-active`
- `--color-white`
- `--color-gray-light`
- `--color-gray-medium`
- `--color-gray-lighter`
- `--color-text-dark`

Aliases Bootstrap declarados:

- `--bs-font-sans-serif`
- `--bs-border-width`
- `--bs-primary`
- `--bs-body-color`
- `--bs-body-bg`
- `--bs-white`
- `--bs-gray-light`
- `--bs-secondary`
- `--bs-light`
- `--bs-dark`
- `--bs-dark-rgb`
- `--bs-border-color`
- `--bs-link-color`
- `--bs-link-hover-color`
- `--bs-btn-disabled-bg`

## Inventario de componentes

Componentes reutilizaveis existentes:

| Componente | Arquivo | Status |
| --- | --- | --- |
| Header do fluxo | `src/shared/Header/index.tsx` | Implementado |
| Icones SVG internos | `src/shared/icons.tsx` | Implementado |
| Button compartilhado | `src/shared/Button/index.tsx` | Arquivo vazio |
| Menu mobile administrativo | `src/page/administrator/MobileMenu.tsx` | Implementado localmente |

Componentes implicitos montados direto nas paginas:

| Padrao | Onde aparece |
| --- | --- |
| Card de servico | `ChoiceServicePage.tsx`, `ValidationPage.tsx` |
| Rodape fixo de acoes | `ChoiceServicePage.tsx`, `ChoiceDataAndTimePage.tsx`, `ProfilePage.tsx`, `ValidationPage.tsx` |
| Painel branco de formulario | `ProfilePage.tsx` |
| Campo com borda inferior | `ProfilePage.tsx` |
| Item de resumo com icone | `ValidationPage.tsx` |
| Painel de calendario | `ChoiceDataAndTimePage.tsx` |
| Grupo segmentado Dia/Noite | `ChoiceDataAndTimePage.tsx` |
| Grid de horarios | `ChoiceDataAndTimePage.tsx` |

## Problemas encontrados

- `src/components` nao existe, apesar de ser um local esperado para componentes reutilizaveis.
- O componente `Button` compartilhado esta vazio, enquanto botoes sao repetidos em varias paginas.
- O rodape fixo de acoes repete a mesma composicao com classes duplicadas.
- O card de servico existe como markup local, nao como componente.
- Ha valores hardcoded fora dos tokens, incluindo cinzas do admin/calendario e vermelho da linha atual do calendario.
- Classes `cursor-pointer`, `transition` e `animate-fade-in` sao usadas, mas nao foram encontradas definicoes locais.
- O menu mobile aplica classes `active` e `hovered`, mas nao ha CSS especifico encontrado para estes estados.
- Existem seletores aparentemente nao usados, como `.calendar-top-bar` e `.tirr__calendar-time-page__calendar-container`.

## Sugestoes de padronizacao

- Extrair `Button` compartilhado usando as variantes ja existentes: `btn-primary`, `btn-outline-primary`, `btn-light`.
- Extrair um componente de rodape fixo de acoes para o fluxo de agendamento.
- Extrair `ServiceCard`, `SummaryInfoItem`, `CalendarPanel` e `PeriodSegmentedControl` a partir dos markups existentes.
- Manter Bootstrap como base e reservar classes `tirr__` para padroes que o Bootstrap nao cobre.
- Consolidar valores hardcoded em tokens somente depois de validacao visual; ate la, documenta-los como valores encontrados, nao como tokens.
- Manter o hover e active de `.btn-primary` nos tokens `--color-primary-hover` e `--color-primary-active`, como aplicado na interface atual.
- Definir ou remover classes usadas sem implementacao local.
