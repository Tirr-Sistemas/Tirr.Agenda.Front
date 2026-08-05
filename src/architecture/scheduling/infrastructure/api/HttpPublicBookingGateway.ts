import { BookingConflictError } from "@/scheduling/application/errors/BookingConflictError";
import type { AvailableTimeSlot, BookableService, CreatePublicBookingInput, PublicBusiness, ScheduledAppointment, ServiceProfessional } from "@/scheduling/application/dtos/PublicBookingDtos";
import type { PublicBookingGateway } from "@/scheduling/application/ports/PublicBookingGateway";
import type { AxiosInstance } from "axios";

/**
 * @description Converte uma resposta desconhecida da API em um objeto indexável seguro.
 *
 * @param value - Valor que será processado.
 * @returns Texto resultante da operação.
 * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
 */
function object(value: unknown): Record<string, unknown> { if (!value || typeof value !== "object") throw new Error("Resposta da API inválida."); return value as Record<string, unknown>; }
/**
 * @description Extrai uma coleção de uma resposta desconhecida, usando uma lista vazia quando necessário.
 *
 * @param value - Valor que será processado.
 * @returns Texto resultante da operação.
 * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
 */
function list(value: unknown): readonly Record<string, unknown>[] { if (!Array.isArray(value) || !value.every((item) => item && typeof item === "object")) throw new Error("Resposta da API inválida."); return value as Record<string, unknown>[]; }
/**
 * @description Extrai um texto de uma resposta desconhecida e aplica um valor padrão quando ausente.
 *
 * @param value - Valor que será processado.
 * @returns Texto resultante da operação.
 * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
 */
function text(value: unknown): string { if (typeof value !== "string") throw new Error("Resposta da API inválida."); return value; }
/**
 * @description Extrai um número de uma resposta desconhecida e aplica zero quando ausente.
 *
 * @param value - Valor que será processado.
 * @returns Resultado produzido pela operação.
 * @throws Repassa a falha quando a regra ou dependência necessária não puder concluir a operação.
 */
function number(value: unknown): number { if (typeof value !== "number") throw new Error("Resposta da API inválida."); return value; }
/**
 * @description Mapeia a resposta da API para o contrato público do estabelecimento.
 *
 * @param value - Valor que será processado.
 * @returns Resultado produzido pela operação.
 */
function publicBusiness(value: unknown): PublicBusiness { const item = object(value); return { businessId: text(item.businessId), name: text(item.name), slug: text(item.slug), timeZone: text(item.timeZone) }; }
/**
 * @description Mapeia a resposta da API para o contrato de serviço agendável.
 *
 * @param value - Valor que será processado.
 * @returns Resultado produzido pela operação.
 */
function service(value: Record<string, unknown>): BookableService { return { serviceId: text(value.serviceId), serviceCategoryId: text(value.serviceCategoryId), name: text(value.name), description: value.description === null ? null : text(value.description), durationInMinutes: number(value.durationInMinutes), price: number(value.price) }; }
/**
 * @description Mapeia a resposta da API para o contrato de profissional disponível.
 *
 * @param value - Valor que será processado.
 * @returns Resultado produzido pela operação.
 */
function professional(value: Record<string, unknown>): ServiceProfessional { return { professionalId: text(value.professionalId), displayName: text(value.displayName), durationInMinutes: number(value.durationInMinutes), price: number(value.price) }; }
/**
 * @description Mapeia a resposta da API para um horário disponível.
 *
 * @param value - Valor que será processado.
 * @returns Resultado produzido pela operação.
 */
function slot(value: Record<string, unknown>): AvailableTimeSlot { return { startsAtUtc: text(value.startsAtUtc), endsAtUtc: text(value.endsAtUtc) }; }
/**
 * @description Mapeia a resposta da API para o agendamento público criado.
 *
 * @param value - Valor que será processado.
 * @returns Resultado produzido pela operação.
 */
function appointment(value: unknown): ScheduledAppointment { const item = object(value); return { appointmentId: text(item.appointmentId), customerId: text(item.customerId), startsAtUtc: text(item.startsAtUtc), endsAtUtc: text(item.endsAtUtc), price: number(item.price), status: text(item.status) }; }

/**
 * @description Adaptador Axios que valida respostas externas antes de expor DTOs de agenda.
 */
export class HttpPublicBookingGateway implements PublicBookingGateway {
  /**
   * @description Cria o adaptador de agendamento público com o cliente HTTP configurado.
   *
   * @param http - Valor de http utilizado pela operação.
   */
  public constructor(private readonly http: AxiosInstance) { }
  /**
   * @description Consulta a disponibilidade do serviço público de agendamento.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async health(): Promise<void> { await this.http.get<unknown>("/public/health"); }
  /**
   * @description Obtém business necessário à operação atual.
   *
   * @param businessId - Identificador do estabelecimento no qual a operação será executada.
   * @returns Promessa resolvida com o resultado da operação.
   */
  public async getBusiness(businessId: string): Promise<PublicBusiness> { return publicBusiness((await this.http.get<unknown>(`/public/businesses/${businessId}`)).data); }
  /**
   * @description Obt?m business by slug necess?rio ? opera??o atual.
   *
   * @param slug - Valor de slug utilizado pela opera??o.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  public async getBusinessBySlug(slug: string): Promise<PublicBusiness> { return publicBusiness((await this.http.get<unknown>(`/public/businesses/by-slug/${slug}`)).data); }
  /**
   * @description Executa a responsabilidade de list services no contexto de http public booking gateway.
   *
   * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  public async listServices(businessId: string): Promise<BookableService[]> { return list(object((await this.http.get<unknown>(`/public/businesses/${businessId}/services`)).data).services).map(service); }
  /**
   * @description Executa a responsabilidade de list professionals no contexto de http public booking gateway.
   *
   * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
   *
   * @param serviceId - Identificador do servi?o selecionado.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  public async listProfessionals(businessId: string, serviceId: string): Promise<ServiceProfessional[]> { return list(object((await this.http.get<unknown>(`/public/businesses/${businessId}/services/${serviceId}/professionals`)).data).professionals).map(professional); }
  /**
   * @description Executa a responsabilidade de list available dates no contexto de http public booking gateway.
   *
   * @param input - Dados necess?rios para executar a opera??o.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   *
   * @throws Repassa a falha quando a regra ou depend?ncia necess?ria n?o puder concluir a opera??o.
   */
  public async listAvailableDates(input: { readonly businessId: string; readonly professionalId: string; readonly serviceId: string; readonly startsOn: string; readonly endsOn: string; }): Promise<string[]> { const response = await this.http.get<unknown>(`/public/businesses/${input.businessId}/professionals/${input.professionalId}/available-dates`, { params: { serviceId: input.serviceId, startsOn: input.startsOn, endsOn: input.endsOn } }); const dates = object(response.data).availableDates; if (!Array.isArray(dates) || !dates.every((date) => typeof date === "string")) throw new Error("Resposta da API inválida."); return dates; }
  /**
   * @description Executa a responsabilidade de list available slots no contexto de http public booking gateway.
   *
   * @param input - Dados necess?rios para executar a opera??o.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  public async listAvailableSlots(input: { readonly businessId: string; readonly professionalId: string; readonly serviceId: string; readonly date: string; }): Promise<AvailableTimeSlot[]> { const response = await this.http.get<unknown>(`/public/businesses/${input.businessId}/professionals/${input.professionalId}/available-time-slots`, { params: { serviceId: input.serviceId, date: input.date } }); return list(object(response.data).timeSlots).map(slot); }
  /**
   * @description Envia ? API a cria??o de um registro de registros.
   *
   * @param input - Dados necess?rios para executar a opera??o.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   *
   * @throws Repassa a falha quando a regra ou depend?ncia necess?ria n?o puder concluir a opera??o.
   */
  public async create(input: CreatePublicBookingInput): Promise<ScheduledAppointment> { try { return appointment((await this.http.post<unknown>(`/public/businesses/${input.businessId}/appointments`, input)).data); } catch (error: unknown) { if (typeof error === "object" && error && "status" in error && (error as { status?: unknown; }).status === 409) throw new BookingConflictError(); throw error; } }
}
