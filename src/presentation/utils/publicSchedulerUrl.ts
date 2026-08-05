/**
 * @description Padrão de rota canônico da agenda pública.
 */
export const PUBLIC_SCHEDULER_ROUTE = "/agendar/:businessId";

/**
 * @description Cria o caminho relativo seguro para a agenda de um estabelecimento.
 *
 * @param businessId - Identificador do estabelecimento.
 * @returns Caminho relativo com o identificador codificado.
 */
export const publicSchedulerPath = (businessId: string) => `/agendar/${encodeURIComponent(businessId.trim())}`;

/**
 * @description Cria a URL absoluta compartilhável da agenda pública.
 *
 * @param businessId - Identificador do estabelecimento.
 * @param origin - Origem usada como base; por padrão, a origem atual.
 * @returns URL absoluta do fluxo público.
 */
export const publicSchedulerUrl = (businessId: string, origin = window.location.origin) =>
  new URL(publicSchedulerPath(businessId), origin).toString();
