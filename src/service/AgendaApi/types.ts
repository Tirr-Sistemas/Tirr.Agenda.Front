/**
 * =========================================================
 * DTO - Funcionário
 * =========================================================
 * @description
 * Representa um funcionário disponível para agendamento.
 */
export interface GetFuncionariosResponseDto {
    statusCode: number
    resultString: unknown
    result: {
        id: number
        estabelecimentoId: number
        nome: string
        cpf: string
        tipo: number
        createdAt: string
        updatedAt: string | null
        deletedAt: string | null
    }[]
    message: string
}

/**
 * =========================================================
 * DTO - Serviço
 * =========================================================
 * @description
 * Representa um serviço disponível para agendamento.
 */
export interface GetServicoResponseDto {
    statusCode: number
    resultString: unknown
    message: string
    result: GetServicoResponseDto__Result[]
}

export interface GetServicoResponseDto__Result {
    id: number
    estabelecimento: number
    nomeCategoria: string
    codigoCategoria: number
    nome: string
    descricao: string
    valor: number
    tempoExecucao: number
    deletedAt: string | null
    createdAt: string
    updatedAt: string | null
}

/**
 * =========================================================
 * DTO - Disponibilidade
 * =========================================================
 * @description
 * Representa um horário disponível para agendamento.
 */
export interface DisponibilidadeResponseDto {

    /**
     * @description
     * Data da disponibilidade.
     * Formato ISO 8601.
     */
    data: string;

    /**
     * @description
     * Horário inicial disponível.
     * Formato ISO 8601.
     */
    horarioInicio: string;

    /**
     * @description
     * Horário final disponível.
     * Formato ISO 8601.
     */
    horarioFim: string;

    /**
     * @description
     * Indica se o horário está disponível.
     */
    disponivel?: boolean;

}

/**
 * =========================================================
 * DTO - Disponibilidade Mensal
 * =========================================================
 * @description
 * Representa a resposta da API responsável por retornar
 * os dias disponíveis para agendamento em um determinado mês.
 *
 * Estrutura da resposta:
 * - statusCode: código HTTP/processamento da operação
 * - resultString: conteúdo bruto retornado pela API
 * - result: lista contendo os dias disponíveis
 * - message: mensagem de retorno da API
 *
 * Exemplo:
 * {
 *   statusCode: 200,
 *   result: [
 *     { dias: 5 },
 *     { dias: 12 },
 *     { dias: 18 }
 *   ],
 *   message: "Sucesso"
 * }
 */
export interface GetDisponibilidadeMesResponse {

    /**
     * =====================================================
     * STATUS CODE
     * =====================================================
     * @description
     * Código de status retornado pela API.
     */
    statusCode: number;

    /**
     * =====================================================
     * RESULT STRING
     * =====================================================
     * @description
     * Conteúdo bruto retornado pela API.
     *
     * Pode conter informações serializadas ou dados
     * auxiliares dependendo da implementação do backend.
     */
    resultString: unknown;

    /**
     * =====================================================
     * RESULT
     * =====================================================
     * @description
     * Lista de dias disponíveis para agendamento.
     */
    result: {

        /**
         * =================================================
         * DIA DISPONÍVEL
         * =================================================
         * @description
         * Dia do mês disponível para agendamento.
         *
         * Exemplo:
         * - 1
         * - 15
         * - 28
         */
        dias: number;

    }[];

    /**
     * =====================================================
     * MESSAGE
     * =====================================================
     * @description
     * Mensagem retornada pela API informando o resultado
     * da operação.
     */
    message: string;

}

/**
 * =========================================================
 * DTO - Disponibilidade de Horários
 * =========================================================
 * @description
 * Representa a resposta da API responsável por retornar
 * os horários disponíveis para agendamento em uma data.
 *
 * Estrutura da resposta:
 * - statusCode: código de status da operação
 * - resultString: conteúdo bruto retornado pela API
 * - result: lista de horários disponíveis
 * - message: mensagem descritiva da operação
 *
 * Exemplo:
 * {
 *   statusCode: 200,
 *   result: [
 *     { horarios: "09:00" },
 *     { horarios: "10:30" },
 *     { horarios: "14:00" }
 *   ],
 *   message: "Sucesso"
 * }
 */
export interface GetDisponibilidadeHorarioResponse {

    /**
     * =====================================================
     * STATUS CODE
     * =====================================================
     * @description
     * Código de status retornado pela API.
     */
    statusCode: number;

    /**
     * =====================================================
     * RESULT STRING
     * =====================================================
     * @description
     * Conteúdo bruto retornado pela API.
     *
     * Pode conter informações serializadas ou dados
     * auxiliares dependendo da implementação do backend.
     */
    resultString: unknown;

    /**
     * =====================================================
     * RESULT
     * =====================================================
     * @description
     * Lista contendo os horários disponíveis para
     * agendamento.
     */
    result: {

        /**
         * =================================================
         * HORÁRIO DISPONÍVEL
         * =================================================
         * @description
         * Horário disponível para agendamento.
         *
         * Formato esperado:
         * HH:mm
         *
         * Exemplos:
         * - 09:00
         * - 14:30
         * - 18:45
         */
        horarios: string;

    }[];

    /**
     * =====================================================
     * MESSAGE
     * =====================================================
     * @description
     * Mensagem retornada pela API indicando o resultado
     * da operação.
     */
    message: string;

}

/**
 * =========================================================
 * DTO - Agendamento Request
 * =========================================================
 * @description
 * Payload utilizado para realizar um novo agendamento
 * de serviço para um cliente.
 *
 * Este objeto contém as informações necessárias para:
 * - identificar o serviço selecionado;
 * - identificar o funcionário responsável;
 * - armazenar os dados do cliente;
 * - definir a data e horário do agendamento.
 *
 * @example
 * ```ts
 * const agendamento: AgendamentoRequestDto = {
 *   servico: 1,
 *   funcionario: 5,
 *   nomeCliente: "João Silva",
 *   contato: "(19) 99999-9999",
 *   dataAgendamento: "2026-05-13T14:30:00"
 * }
 * ```
 */
export interface AgendamentoRequestDto {

    /**
     * Identificador único do serviço
     * que será agendado.
     *
     * @example 1
     */
    servico: number

    /**
     * Identificador único do funcionário
     * responsável pelo atendimento.
     *
     * @example 5
     */
    funcionario: number

    /**
     * Nome completo do cliente
     * que realizará o agendamento.
     *
     * @example "João Silva"
     */
    nomeCliente: string

    /**
     * Contato principal do cliente.
     *
     * Pode conter:
     * - telefone;
     * - celular;
     * - WhatsApp;
     * - e-mail.
     *
     * @example "(19) 99999-9999"
     */
    contato: string

    /**
     * Data e horário do agendamento.
     *
     * Recomenda-se utilizar o padrão ISO 8601.
     *
     * @example "2026-05-13T14:30:00"
     */
    dataAgendamento: string
}

/**
 * =========================================================
 * DTO - Agendamento Response
 * =========================================================
 * @description
 * Resposta retornada após criação do agendamento.
 */
export interface AgendamentoResponseDto {

    /**
     * @description
     * Código/ID do agendamento.
     */
    id?: number;

    /**
     * @description
     * Mensagem retornada pela API.
     */
    mensagem?: string;

    /**
     * @description
     * Indica se o agendamento foi criado com sucesso.
     */
    sucesso?: boolean;

}

/**
 * =========================================================
 * DTO - Buscar Serviços
 * =========================================================
 * @description
 * Payload utilizado para buscar serviços de um funcionário.
 */
export interface GetServicosRequestDto {

    /**
     * @description
     * Código/ID do funcionário.
     */
    funcionarioId: number | string;

}

/**
 * =========================================================
 * DTO - Buscar Disponibilidades
 * =========================================================
 * @description
 * Payload utilizado para consultar disponibilidades
 * de agenda.
 */
export interface GetDisponibilidadesRequestDto {

    /**
     * @description
     * Código/ID do funcionário.
     */
    funcionarioId: number | string;

    /**
     * @description
     * Ano da consulta.
     */
    ano: number;

    /**
     * @description
     * Mês da consulta.
     */
    mes: number;

    /**
     * @description
     * Dia da consulta.
     * Opcional para consultas mensais.
     */
    dia?: number;

}
