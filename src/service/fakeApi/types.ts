
/**
 * DTO: Representa a categoria que agrupa os serviços.
 * Representa o nó principal da resposta da API.
 * Agrupa serviços por categorias (ex: Corte, Coloração).
 */
export interface GetCategoryResponseDto {
  title: string;
  services: {
    /**
     * Identificador único do serviço.
     * Normalmente um UUID gerado pelo backend.
     */
    id: string

    /**
     * Imagem representando o serviço
     */
    image:string,

    /**
     * Nome do serviço.
     * Ex: "Full Hair Dye", "Root Touch-up"
     */
    name: string

    /**
     * Descrição detalhada do serviço.
     * Ex: "coloring + hydration", "cut + styling"
     */
    description: string

    /**
     * Preço do serviço.
     * Valor numérico representando o custo do serviço.
     * Ex: 45, 120, 250
     */
    price: number
  }[];
}

/**
 * =========================================================
 * PostToScheduleDto
 * =========================================================
 * @description
 * Data Transfer Object responsável por representar os dados
 * necessários para criação de um agendamento.
 *
 * Este DTO é utilizado na camada de entrada (Use Case / Service),
 * servindo como contrato entre UI e domínio.
 *
 * RESPONSABILIDADES:
 * - Definir estrutura de dados de entrada
 * - Garantir tipagem forte
 * - Evitar dependência de implementação interna do model
 *
 * OBS:
 * DTO não contém regras de negócio, apenas tipagem.
 */
export interface PostToScheduleDto {
  /**
   * Serviço selecionado pelo usuário.
   *
   * REGRA:
   * Deve ser uma instância válida de ServiceModel.
   */
  chosenServiceId: string;

  /**
   * Dia selecionado para o agendamento.
   *
   * REGRA:
   * Não pode ser uma data no passado.
   */
  chosenDay: Date;

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

export interface GetAppointmentResponseDto {
  id: string;
  chosenServiceId: string;
  chosenDay: string;
  chosenHour: string;
  name: string;
  email: string;
  phone: string;
}
