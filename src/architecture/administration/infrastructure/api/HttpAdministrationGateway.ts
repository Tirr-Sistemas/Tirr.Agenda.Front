import type {
  Appointment, AppointmentStatus, AvailabilityException, AvailabilityExceptionType,
  AvailabilityRule, BusinessProfile, Customer, CustomerSummary, OperatingHoursDay,
  Professional, ProfessionalService, ScheduleAppointmentInput, Service, ServiceCategory,
  ServiceSummary,
} from "@/administration/application/dtos";
import type { AdministrationGateway } from "@/administration/application/ports/AdministrationGateway";
import type { AxiosInstance } from "axios";

/**
 * @description Monta o caminho da API para o estabelecimento informado.
 *
 * @param businessId - Identificador do estabelecimento no qual a operação será executada.
 * @returns Texto resultante da operação.
 */
const business = (businessId: string): string => `/businesses/${businessId}`;
/**
 * @description Normaliza um hor?rio para o formato temporal aceito pela API, preservando valores ausentes.
 *
 * @param value - Valor que ser? processado.
 *
 * @returns Texto resultante da opera??o.
 */
const asTimeOnly = (value: string | null): string | null => {
  if (!value) return null;
  const [hours = "00", minutes = "00", seconds = "00"] = value.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.slice(0, 2).padStart(2, "0")}`;
};
/**
 * @description Normaliza os limites de hor?rio de um comando sem alterar seus demais campos.
 *
 * @param input - Dados necess?rios para executar a opera??o.
 *
 * @returns Resultado produzido pela opera??o.
 */
const withTimeOnlyRange = <T extends { startTime: string | null; endTime: string | null; }>(input: T): T => ({
  ...input,
  startTime: asTimeOnly(input.startTime),
  endTime: asTimeOnly(input.endTime),
});

/**
 * @description Adaptador Axios que implementa todas as portas do contexto administrativo.
 *
 * Centraliza rotas por empresa e normaliza horários antes de enviar comandos.
 */
export class HttpAdministrationGateway implements AdministrationGateway {
  /**
   * @description Cria o adaptador administrativo com o cliente HTTP configurado.
   *
   * @param http - Valor de http utilizado pela opera??o.
   */
  public constructor(private readonly http: AxiosInstance) { }

  public readonly appointments: AdministrationGateway["appointments"] = {
    /**
     * @description Consulta os agendamentos do per?odo di?rio do estabelecimento.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param date - Data usada como refer?ncia pela opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    day: async (businessId, date) => (await this.http.get<{ appointments: Appointment[]; }>(`${business(businessId)}/appointments/day`, { params: { date } })).data.appointments,
    /**
     * @description Consulta os agendamentos do per?odo semanal do estabelecimento.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param weekStartsOn - Data que delimita o in?cio da semana consultada.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    week: async (businessId, weekStartsOn) => (await this.http.get<{ appointments: Appointment[]; }>(`${business(businessId)}/appointments/week`, { params: { weekStartsOn } })).data.appointments,
    /**
     * @description Consulta os agendamentos do per?odo mensal do estabelecimento.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param year - Ano do per?odo consultado.
     *
     * @param month - M?s do per?odo consultado.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    month: async (businessId, year, month) => (await this.http.get<{ appointments: Appointment[]; }>(`${business(businessId)}/appointments/month`, { params: { year, month } })).data.appointments,
    /**
     * @description Envia ? API a cria??o de um registro de agendamentos.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    create: async (businessId, input: ScheduleAppointmentInput) => (await this.http.post(`${business(businessId)}/appointments`, input)).data,
    /**
     * @description Envia ? API a atualiza??o de um registro de agendamentos.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param appointmentId - Identificador do agendamento alvo.
     *
     * @param status - Novo status solicitado para o agendamento.
     *
     * @param reason - Motivo associado ? altera??o solicitada.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    updateStatus: async (businessId, appointmentId, status: AppointmentStatus, reason) => (await this.http.patch(`${business(businessId)}/appointments/${appointmentId}/status`, { status, cancellationReason: reason })).data,
    /**
     * @description Solicita uma nova data para o agendamento e atualiza os dados exibidos.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param appointmentId - Identificador do agendamento alvo.
     *
     * @param startsAtUtc - Data e hora inicial do agendamento em UTC.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    reschedule: async (businessId, appointmentId, startsAtUtc) => (await this.http.put(`${business(businessId)}/appointments/${appointmentId}/schedule`, { startsAtUtc })).data,
  };

  public readonly overview: AdministrationGateway["overview"] = {
    /**
     * @description Consulta o perfil do estabelecimento ativo.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    profile: async (businessId) => (await this.http.get<BusinessProfile>(`${business(businessId)}/profile`)).data,
    /**
     * @description Consulta os hor?rios de funcionamento do estabelecimento ativo.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    operatingHours: async (businessId) => (await this.http.get<{ days: OperatingHoursDay[]; }>(`${business(businessId)}/operating-hours`)).data.days,
    /**
     * @description Consulta o resumo de clientes do estabelecimento ativo.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param includeInactive - Indica se registros inativos devem integrar a resposta.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    customers: async (businessId, includeInactive = true) => (await this.http.get<{ customers: CustomerSummary[]; }>(`${business(businessId)}/customers`, { params: { includeInactive } })).data.customers,
    /**
     * @description Consulta os servi?os dispon?veis no contexto atual.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param includeInactive - Indica se registros inativos devem integrar a resposta.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    services: async (businessId, includeInactive = true) => (await this.http.get<{ services: ServiceSummary[]; }>(`${business(businessId)}/services`, { params: { includeInactive } })).data.services,
    /**
     * @description Envia ? API a atualiza??o de um registro de vis?o geral administrativa.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    updateProfile: async (businessId, input) => (await this.http.put<BusinessProfile>(`${business(businessId)}/profile`, input)).data,
    /**
     * @description Executa a responsabilidade de replace operating hours no contexto de http administration gateway.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param days - Valor de days utilizado pela opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    replaceOperatingHours: async (businessId, days) => (await this.http.put(`${business(businessId)}/operating-hours`, {
      days: days.map((day) => ({
        ...day,
        opensAt: day.isOperating ? asTimeOnly(day.opensAt) : null,
        closesAt: day.isOperating ? asTimeOnly(day.closesAt) : null,
      })),
    })).data,
  };

  public readonly customers: AdministrationGateway["customers"] = {
    /**
     * @description Consulta um registro de clientes pelo identificador.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    get: async (businessId, id) => (await this.http.get<Customer>(`${business(businessId)}/customers/${id}`)).data,
    /**
     * @description Envia ? API a cria??o de um registro de clientes.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    create: async (businessId, input) => (await this.http.post<Customer>(`${business(businessId)}/customers`, input)).data,
    /**
     * @description Envia ? API a atualiza??o de um registro de clientes.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    update: async (businessId, id, input) => (await this.http.put<Customer>(`${business(businessId)}/customers/${id}`, input)).data,
    /**
     * @description Confirma e remove o registro selecionado por meio do caso de uso correspondente.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    remove: async (businessId, id) => (await this.http.delete(`${business(businessId)}/customers/${id}`)).data,
  };

  public readonly categories: AdministrationGateway["categories"] = {
    /**
     * @description Extrai uma cole??o de uma resposta desconhecida, usando uma lista vazia quando necess?rio.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param includeInactive - Indica se registros inativos devem integrar a resposta.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    list: async (businessId, includeInactive = true) => (await this.http.get<{ categories: ServiceCategory[]; }>(`${business(businessId)}/service-categories`, { params: { includeInactive } })).data.categories,
    /**
     * @description Consulta um registro de categorias de servi?o pelo identificador.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    get: async (businessId, id) => (await this.http.get<ServiceCategory>(`${business(businessId)}/service-categories/${id}`)).data,
    /**
     * @description Envia ? API a cria??o de um registro de categorias de servi?o.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    create: async (businessId, input) => (await this.http.post<ServiceCategory>(`${business(businessId)}/service-categories`, input)).data,
    /**
     * @description Envia ? API a atualiza??o de um registro de categorias de servi?o.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    update: async (businessId, id, input) => (await this.http.put<ServiceCategory>(`${business(businessId)}/service-categories/${id}`, input)).data,
    /**
     * @description Confirma e remove o registro selecionado por meio do caso de uso correspondente.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    remove: async (businessId, id) => (await this.http.delete(`${business(businessId)}/service-categories/${id}`)).data,
  };

  public readonly services: AdministrationGateway["services"] = {
    /**
     * @description Consulta um registro de servi?os pelo identificador.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    get: async (businessId, id) => (await this.http.get<Service>(`${business(businessId)}/services/${id}`)).data,
    /**
     * @description Envia ? API a cria??o de um registro de servi?os.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    create: async (businessId, input) => (await this.http.post<Service>(`${business(businessId)}/services`, input)).data,
    /**
     * @description Envia ? API a atualiza??o de um registro de servi?os.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    update: async (businessId, id, input) => (await this.http.put<Service>(`${business(businessId)}/services/${id}`, input)).data,
    /**
     * @description Confirma e remove o registro selecionado por meio do caso de uso correspondente.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    remove: async (businessId, id) => (await this.http.delete(`${business(businessId)}/services/${id}`)).data,
  };

  public readonly professionals: AdministrationGateway["professionals"] = {
    /**
     * @description Extrai uma cole??o de uma resposta desconhecida, usando uma lista vazia quando necess?rio.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param includeInactive - Indica se registros inativos devem integrar a resposta.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    list: async (businessId, includeInactive = true) => (await this.http.get<{ professionals: Professional[]; }>(`${business(businessId)}/professionals`, { params: { includeInactive } })).data.professionals,
    /**
     * @description Consulta um registro de profissionais pelo identificador.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    get: async (businessId, id) => (await this.http.get<Professional>(`${business(businessId)}/professionals/${id}`)).data,
    /**
     * @description Envia ? API a cria??o de um registro de profissionais.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    create: async (businessId, input) => (await this.http.post<Professional>(`${business(businessId)}/professionals`, input)).data,
    /**
     * @description Envia ? API a atualiza??o de um registro de profissionais.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    update: async (businessId, id, input) => (await this.http.put<Professional>(`${business(businessId)}/professionals/${id}`, input)).data,
    /**
     * @description Confirma e remove o registro selecionado por meio do caso de uso correspondente.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    remove: async (businessId, id) => (await this.http.delete(`${business(businessId)}/professionals/${id}`)).data,
    /**
     * @description Consulta os servi?os dispon?veis no contexto atual.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param professionalId - Identificador do profissional selecionado.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    services: async (businessId, professionalId) => (await this.http.get<{ services: ProfessionalService[]; }>(`${business(businessId)}/professionals/${professionalId}/services`)).data.services,
    /**
     * @description Executa a responsabilidade de upsert service no contexto de http administration gateway.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param professionalId - Identificador do profissional selecionado.
     *
     * @param serviceId - Identificador do servi?o selecionado.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    upsertService: async (businessId, professionalId, serviceId, input) => (await this.http.put<ProfessionalService>(`${business(businessId)}/professionals/${professionalId}/services/${serviceId}`, input)).data,
    /**
     * @description Confirma e remove o servi?o selecionado.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param professionalId - Identificador do profissional selecionado.
     *
     * @param serviceId - Identificador do servi?o selecionado.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    removeService: async (businessId, professionalId, serviceId) => (await this.http.delete(`${business(businessId)}/professionals/${professionalId}/services/${serviceId}`)).data,
  };

  public readonly availability: AdministrationGateway["availability"] = {
    /**
     * @description Consulta as regras de disponibilidade do profissional selecionado.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param professionalId - Identificador do profissional selecionado.
     *
     * @param includeInactive - Indica se registros inativos devem integrar a resposta.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    rules: async (businessId, professionalId, includeInactive = true) => (await this.http.get<{ rules: AvailabilityRule[]; }>(`${business(businessId)}/availability-rules`, { params: { professionalId, includeInactive } })).data.rules,
    /**
     * @description Consulta uma regra de disponibilidade pelo identificador.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    rule: async (businessId, id) => (await this.http.get<AvailabilityRule>(`${business(businessId)}/availability-rules/${id}`)).data,
    /**
     * @description Envia ? API a cria??o de um registro de disponibilidade.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    createRule: async (businessId, input) => (await this.http.post<AvailabilityRule>(`${business(businessId)}/availability-rules`, withTimeOnlyRange(input))).data,
    /**
     * @description Envia ? API a atualiza??o de um registro de disponibilidade.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    updateRule: async (businessId, id, input) => (await this.http.put<AvailabilityRule>(`${business(businessId)}/availability-rules/${id}`, withTimeOnlyRange(input))).data,
    /**
     * @description Confirma e remove a regra de disponibilidade selecionada.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    removeRule: async (businessId, id) => (await this.http.delete(`${business(businessId)}/availability-rules/${id}`)).data,
    /**
     * @description Consulta as exce??es de disponibilidade do profissional selecionado.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param professionalId - Identificador do profissional selecionado.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    exceptions: async (businessId, professionalId) => (await this.http.get<{ exceptions: AvailabilityException[]; }>(`${business(businessId)}/availability-exceptions`, { params: { professionalId } })).data.exceptions,
    /**
     * @description Consulta uma exce??o de disponibilidade pelo identificador.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    exception: async (businessId, id) => (await this.http.get<AvailabilityException>(`${business(businessId)}/availability-exceptions/${id}`)).data,
    /**
     * @description Envia ? API a cria??o de um registro de disponibilidade.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    createException: async (businessId, input: { professionalId: string; date: string; type: AvailabilityExceptionType; startTime: string | null; endTime: string | null; reason: string | null; }) => (await this.http.post<AvailabilityException>(`${business(businessId)}/availability-exceptions`, withTimeOnlyRange(input))).data,
    /**
     * @description Envia ? API a atualiza??o de um registro de disponibilidade.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @param input - Dados necess?rios para executar a opera??o.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    updateException: async (businessId, id, input) => (await this.http.put<AvailabilityException>(`${business(businessId)}/availability-exceptions/${id}`, withTimeOnlyRange(input))).data,
    /**
     * @description Confirma e remove a exce??o de disponibilidade selecionada.
     *
     * @param businessId - Identificador do estabelecimento no qual a opera??o ser? executada.
     *
     * @param id - Identificador do registro alvo.
     *
     * @returns Promessa resolvida com o resultado da opera??o.
     */
    removeException: async (businessId, id) => (await this.http.delete(`${business(businessId)}/availability-exceptions/${id}`)).data,
  };
}
