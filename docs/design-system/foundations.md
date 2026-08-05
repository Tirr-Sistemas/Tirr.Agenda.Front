# Design System Foundations

## Escopo analisado

Esta documentacao registra somente padroes presentes no codigo. Foram analisados `src/shared`, `src/page`, `src/styles`, `src/auth`, `src/service/api` e `src/routingV1.tsx`.

O projeto nao possui `src/components`, `src/app` ou `pages`. O runtime carregado por `src/core.tsx` usa `routingV1.tsx`; arquivos de agenda e admin anteriores continuam no repositorio como legado.

## Stack visual

- React, TypeScript e Vite.
- Bootstrap 5 e Bootstrap Icons.
- React Big Calendar e Moment na agenda administrativa.
- Zustand para sessao, permissoes e empresa ativa.
- Poppins como familia global.

## Principios encontrados

- Superficies claras sobre `--bg-color`.
- Paineis brancos com borda discreta e raio maximo de `8px`.
- Amarelo primario reservado para acao, foco, selecao e destaque.
- Navegacao lateral recolhivel no desktop e inferior no mobile.
- Titulo e descricao da rota permanecem no topbar fixo.
- Admin denso e operacional; agenda publica guiada em cinco etapas.
- Empresa ativa faz parte da rota, do JWT e de toda requisicao administrativa.

## Tokens identificados

As foundations ficam em `src/styles/global.css`; os aliases semanticos e temas ficam em `src/styles/themes.css`:

- Cores: `--default-text-color`, `--bg-color`, `--color-primary`, `--color-primary-hover`, `--color-primary-active`, `--color-white`, `--color-gray-light`, `--color-gray-medium`, `--color-gray-lighter`, `--color-text-dark`.
- Tipografia: `--default-font-family`.
- Aliases Bootstrap: `--bs-primary`, `--bs-body-color`, `--bs-body-bg`, `--bs-border-color`, `--bs-light`, `--bs-dark`.
- Espacamento: `--space-1` a `--space-6`.
- Forma: `--radius-control`, `--radius-surface` e `--radius-pill`.
- Elevacao e movimento: `--shadow-popover`, `--shadow-drawer` e `--motion-fast`.
- Superficies semanticas: `--surface-page`, `--surface-panel`, `--surface-muted` e `--surface-elevated`.

Espacamentos, sombras e raios ainda sao valores locais de componente e estao mapeados em `spacing.md`.

## Inventario por dominio

| Dominio | Recursos ativos |
| --- | --- |
| Acesso | Login e cadastro de primeiro acesso |
| Agenda publica | Servico, profissional, data/horario, cliente, revisao e sucesso |
| Agenda administrativa | Dia, semana, mes, criacao, status e reagendamento |
| Clientes | Lista, criacao, edicao, ativacao e exclusao |
| Catalogo | Servicos e categorias |
| Equipe | Profissionais, membros, papeis, status e servicos atendidos |
| Disponibilidade | Regras semanais e excecoes |
| Configuracoes | Empresa, expediente, perfil, seguranca e chaves de API |

## Inconsistencias encontradas

- Duas geracoes de paginas e componentes coexistem; o runtime usa as paginas `V1`/`V2`.
- Componentes antigos continuam no repositorio, mas nao participam de `routingV1.tsx`.
- Parte dos estilos de pagina ainda permanece em `global.css` e `app-v1.css`; `themes.css` funciona como camada semantica final.
- Alguns arquivos legados apresentam texto com codificacao incorreta e namespaces TypeScript antigos.
- Icones SVG legados coexistem com Bootstrap Icons; as telas ativas usam Bootstrap Icons.

## Padronizacoes sugeridas

- Migrar gradualmente regras de pagina ainda presentes em `global.css` para modulos por dominio.
- Remover a geracao legada somente apos migrar seus testes e imports.
- Reutilizar `Button`, `AdminDrawer`, `AdminTabs`, `PageFeedback` e `AdminEmptyRow` em novos CRUDs.

## Temas

`ThemeProvider` aplica `data-theme="light|dark"` no elemento `html`. A escolha e persistida em `localStorage` e, no primeiro acesso, parte de `prefers-color-scheme`. O seletor esta disponivel no login, no agendamento publico e no topbar administrativo.
