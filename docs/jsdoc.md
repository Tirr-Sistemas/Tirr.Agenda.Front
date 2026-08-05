# Padrão JSDoc

Todo módulo TypeScript de produção possui documentação JSDoc. Declarações exportadas devem explicar o contrato público; componentes e funções internas relevantes devem registrar sua responsabilidade quando isso ajuda a compreender o fluxo.

## Formato

```ts
/**
 * Calcula o valor total de um pedido aplicando desconto.
 *
 * @param {number} subtotal - Valor antes do desconto.
 * @param {number} discount - Percentual de desconto entre 0 e 100.
 * @returns {number} Valor final após o desconto.
 * @throws {Error} Quando o percentual estiver fora do intervalo aceito.
 */
```

## Regras

- A primeira frase descreve a intenção, não repete apenas o nome do símbolo.
- `@param` explica unidade, formato, nulabilidade ou origem quando relevante.
- `@returns` descreve o significado da resposta, especialmente em funções públicas.
- `@throws` registra erros esperados de validação ou infraestrutura.
- Tipos, DTOs e interfaces descrevem seu papel arquitetural e não cada propriedade óbvia.
- Componentes React descrevem responsabilidade, foco, acessibilidade ou efeitos relevantes.
- Comentários de implementação são usados somente para decisões que não ficam claras pelo código.

## Cobertura automática

`src/architecture/documentation.test.ts` garante que:

1. todo arquivo TypeScript de produção tenha ao menos um bloco JSDoc;
2. toda declaração nomeada exportada tenha JSDoc imediatamente associado.

Arquivos de teste são especificações executáveis e não entram nessa exigência.
