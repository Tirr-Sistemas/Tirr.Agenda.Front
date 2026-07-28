import { ScheduleModel } from "@/model/ScheduleModel";
import type { ServiceModel } from "@/model/ServiceModel";
import { API_AGENDA } from "@/service/AgendaApi";

export interface ToScheduleUseCaseArgs {

  /**
    * Serviço selecionado pelo usuário.
    *
    * REGRA:
    * Deve ser uma instância válida de ServiceModel.
    */
  chosenService: ServiceModel;

  /**
   * Ano selecionado para o agendamento.
   *
   * REGRA:
   * Não pode ser uma data no passado.
   */
  chosenYear: number;

  /**
   * Dia selecionado para o agendamento.
   *
   * REGRA:
   * Não pode ser uma data no passado.
   */
  chosenDay: number;

  /**
   * Mês selecionado para o agendamento.
   */
  chosenMonth: number;

  /**
   * Hora selecionada para o agendamento.
   *
   * FORMATO:
   * "HH:mm" (ex: "14:30")
   *
   * OBS:
   * Validação de formato deve ocorrer no Use Case ou Model.
   */
  chosenHour: string;

  /**
   * Nome do cliente.
   *
   * REGRA:
   * String não vazia.
   */
  name: string;

  /**
   * Email do cliente.
   *
   * REGRA:
   * Deve ser um email válido.
   */
  email: string;

  /**
   * Telefone do cliente.
   *
   * REGRA:
   * Deve conter no mínimo 10 dígitos numéricos.
   */
  phone: string;

}

/**
 * =========================================================
 * Use Case: toScheduleUseCase
 * =========================================================
 * @description
 * Responsável por:
 * - Receber dados brutos do formulário (DTO)
 * - Converter para ScheduleModel (camada de domínio)
 * - Validar regras de negócio automaticamente via Model
 * - Persistir o agendamento via API
 *
 * Fluxo:
 * DTO → Model (validação forte) → API
 *
 * Retorno:
 * true em caso de sucesso
 */
const toScheduleUseCase = async (input: ToScheduleUseCaseArgs): Promise<boolean> => {
  try {
    /**
     * =====================================================
     * 1. Conversão DTO → Domain Model
     * =====================================================
     * O Model já executa validações no constructor
     */
    const schedule = new ScheduleModel({
      chosenService: input.chosenService,
      chosenDay: input.chosenDay,
      chosenHour: input.chosenHour,
      chosenMonth: input.chosenMonth,
      chosenYear: input.chosenYear,
      name: input.name,
      email: input.email,
      phone: input.phone,
    });

    /**
     * =====================================================
     * 2. Validação explícita (defesa adicional)
     * =====================================================
     */
    schedule.assertValid();

    /**
     * =====================================================
     * 3. Persistência via Service Layer
     * =====================================================
     */
    const [hours, minutes] = schedule.chosenHour.split(":")

    const dataAgendamento = new Date(
      Date.UTC(
        schedule.chosenYear,
        schedule.chosenMonth,
        schedule.chosenDay,
        Number(hours),
        Number(minutes)
      )
    ).toISOString()  
    await API_AGENDA.criarAgendamento({
      servico: parseInt(schedule.chosenService.id),
      funcionario: 1,
      nomeCliente: schedule.name,
      contato: schedule.phone,
      dataAgendamento
    })

    return true;
    
  } catch (error) {
    console.error("Erro no use case de agendamento:", error);
    return false;
  }
};

export default toScheduleUseCase;