/** Parâmetros para consultar dias com ao menos um horário disponível. */
export interface ListAvailableDatesCommand { readonly businessId: string; readonly professionalId: string; readonly serviceId: string; readonly startsOn: string; readonly endsOn: string; }
