/**
 * @description Scheduling projection; intentionally independent from the administrative service entity.
 */
export interface SchedulingService { readonly serviceId: string; readonly businessId: string; readonly categoryId: string; readonly name: string; readonly durationInMinutes: number; readonly price: number; }
