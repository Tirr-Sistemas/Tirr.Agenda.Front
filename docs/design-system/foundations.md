# Fundamentos do design system

## Stack visual

- React, TypeScript e Vite.
- Bootstrap 5 apenas como base de grid e controles.
- Ícones SVG locais, tipados e independentes de fonte.
- React Big Calendar na agenda administrativa.
- Poppins como família global, com fallbacks de sistema.

## Arquivos canônicos

| Arquivo | Responsabilidade |
| --- | --- |
| `src/presentation/styles/foundations.css` | cores, superfícies, tipografia, espaçamento, raios, sombras e movimento |
| `src/presentation/styles/modern.css` | componentes, shell, login, agendamento e responsividade |
| `src/presentation/styles/themes.css` | compatibilidade de tema das telas existentes |
| `src/presentation/styles/calendar.css` | adaptação isolada do calendário de terceiros |

Novos estilos devem consumir os tokens semânticos de `foundations.css`. Cores literais ficam restritas à declaração da paleta; componentes usam `--surface-*`, `--text-*`, `--border-*` e tokens de estado.

## Princípios

- Amarelo identifica ação primária, seleção e foco; texto sobre amarelo permanece escuro.
- Superfícies usam hierarquia por borda, espaçamento e sombra leve.
- Raios seguem três níveis: controles, superfícies e diálogos.
- Alvos interativos têm no mínimo 42 px no desktop e 44 px no mobile.
- Navegação lateral recolhível no desktop e inferior no mobile.
- O tema escuro altera tokens, sem duplicar regras de componente.
- Movimento é curto e respeita `prefers-reduced-motion`.

## Escalas principais

- Espaçamento: `--space-1` a `--space-9` (4 a 48 px).
- Raios: `--radius-control`, `--radius-surface`, `--radius-large` e `--radius-pill`.
- Elevação: `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-popover` e `--shadow-drawer`.
- Tipografia: caption, meta, small, body, card title, section title, page title, flow title e display.
- Estados: success, warning, danger e info, cada um com cor forte e superfície suave.

## Temas

`ThemeProvider` aplica `data-theme="light|dark"` ao elemento `html`. A preferência é persistida e, no primeiro acesso, respeita `prefers-color-scheme`. Login, agenda pública e área administrativa expõem o mesmo controle de tema.
