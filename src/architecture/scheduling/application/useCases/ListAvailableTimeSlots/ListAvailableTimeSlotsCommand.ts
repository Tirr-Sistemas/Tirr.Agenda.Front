/**
 * @description Parâmetros para consultar horários de uma data específica.
 */
export interface ListAvailableTimeSlotsCommand { readonly businessId: string; readonly professionalId: string; readonly serviceId: string; readonly date: string; }
