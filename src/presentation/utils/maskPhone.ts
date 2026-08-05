export const phoneMask = (value: string) => {
  if (!value) return ""
  return value
    .replace(/\D/g, "") // Remove tudo que não é número
    .replace(/(\d{2})(\d)/, "($1) $2") // Coloca parênteses no DDD
    .replace(/(\d{5})(\d)/, "$1-$2") // Coloca o hífen no número (formato 9 dígitos)
    .replace(/(-\d{4})\d+?$/, "$1") // Limpa caracteres extras no final
}