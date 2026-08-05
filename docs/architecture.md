# Arquitetura da aplicação

O front é organizado por contexto de negócio:

```text
src/architecture/
  administration/{domain,application,infrastructure}
  scheduling/{domain,application,infrastructure}
  identity/{domain,application,infrastructure}
  shared/{domain,http,result}
```

`administration` configura e opera o estabelecimento. `scheduling` possui projeções próprias de serviço e profissional e coordena disponibilidade e reservas. `identity` concentra autenticação, sessão, membros, papéis, permissões e API keys. Tipos compartilhados sem regra contextual ficam em `shared`.

A UI fica integralmente em `src/presentation`, organizada em `app`, `pages`, `components`, `hooks`, `providers`, `stores`, `styles`, `assets` e `utils`. Ela recebe somente casos de uso pelo `ApplicationProvider`; Axios fica em infraestrutura. `src/core.tsx` e `src/core/createApplication.ts` formam o Composition Root.

Todo caso de uso segue `context/application/useCases/UseCaseName/` com `UseCaseNameCommand.ts`, `UseCaseNameUseCase.ts` e `UseCaseNameResult.ts`, sendo invocado por `execute(command)`.

Datas de agendamento usam UTC (`startsAtUtc` e `endsAtUtc`). Regras recorrentes e exceções usam data e horário local da empresa.

Não existe camada de compatibilidade ou adaptador legado. Cada contexto implementa diretamente suas portas HTTP em `infrastructure`, e a UI acessa o backend exclusivamente pelos casos de uso expostos no Composition Root.
