 /**
 * =========================================================
 * Formatador de moeda (BRL)
 * =========================================================
 * @description
 * Responsável por formatar valores numéricos para o padrão
 * monetário brasileiro (Real - R$).
 *
 * UTILIZA:
 * Intl.NumberFormat (API nativa do JavaScript)
 *
 * BENEFÍCIOS:
 * - Compatível com internacionalização
 * - Alta precisão e performance
 * - Evita concatenação manual de strings
 *
 * EXEMPLOS:
 * formatToBRL(10)      -> "R$ 10,00"
 * formatToBRL(1500.5)  -> "R$ 1.500,50"
 * formatToBRL(0)       -> "R$ 0,00"
 */
export const formatToBRL = (value: number): string => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};