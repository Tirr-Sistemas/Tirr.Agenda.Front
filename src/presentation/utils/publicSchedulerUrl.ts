/** Padrão de rota canônico da agenda pública. */
export const PUBLIC_SCHEDULER_ROUTE = "/agendar/:businessId";

/**
 * Cria o caminho relativo seguro para a agenda de um estabelecimento.
 *
 * @param {string} businessId - Identificador do estabelecimento.
 * @returns {string} Caminho relativo com o identificador codificado.
 */
export const publicSchedulerPath = (businessId: string) => `/agendar/${encodeURIComponent(businessId.trim())}`;

/**
 * Cria a URL absoluta compartilhável da agenda pública.
 *
 * @param {string} businessId - Identificador do estabelecimento.
 * @param {string} origin - Origem usada como base; por padrão, a origem atual.
 * @returns {string} URL absoluta do fluxo público.
 */
export const publicSchedulerUrl = (businessId: string, origin = window.location.origin) =>
  new URL(publicSchedulerPath(businessId), origin).toString();
