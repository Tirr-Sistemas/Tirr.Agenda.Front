# Componentes de apresentação

Toda a interface fica em `src/presentation`:

```text
presentation/
  app/          # rotas, bootstrap de sessão e error boundary
  pages/        # acesso, agenda pública e administração
  components/   # componentes reutilizáveis
  icons/        # biblioteca SVG local e tipada
  hooks/        # adaptação entre React e casos de uso
  providers/    # aplicação, tema e confirmação
  stores/       # estado de sessão e empresa ativa
  styles/       # foundations, componentes, temas e calendário
  utils/        # formatação e URLs da interface
```

## Primitivos e padrões

| Componente | Uso |
| --- | --- |
| `Icon` | ícones SVG modernos; decorativo por padrão e nomeável com `label` |
| `Button` | variantes, ícone inicial/final, loading e encaminhamento de ref |
| `IconButton` | ação compacta com nome acessível obrigatório |
| `PageHeader` | título, descrição, eyebrow e ações de página |
| `FormField` | label, controle, ajuda e erro associado |
| `AsyncState` / `PageFeedback` | loading, vazio, erro, retry e sucesso |
| `AdminTabs` | abas com setas, `aria-selected` e roving tab index |
| `AdminDrawer` | formulário lateral com foco contido, Escape e retorno de foco |
| `ConfirmProvider` | substitui confirmações nativas por `alertdialog` consistente |
| `SensitiveValueDialog` | exibição única e cópia segura de credencial |
| `ThemeToggle` | alternância acessível de tema |

## Regras de integração

- Páginas recebem regras de negócio exclusivamente por `useApplication`.
- Apresentação não importa Axios, gateways ou implementações de infraestrutura.
- Operações mutáveis exibem estado ocupado no comando de origem e feedback persistente.
- Ações destrutivas usam `useConfirm`; não se usa `window.confirm`.
- Botões somente com ícone usam `IconButton` ou fornecem `aria-label`.
- Novos CRUDs reutilizam drawer, tabs, feedback, status e estados vazios existentes.
