/**
 * =========================================================
 * Configuração do Axios
 * =========================================================
 * @description
 * Instância única responsável pela comunicação HTTP com a API Agenda.
 * Centraliza baseURL, timeout, interceptors e headers globais.
 */

import axios, { AxiosInstance } from "axios";


import type {
    AgendamentoRequestDto,
    AgendamentoResponseDto,
    GetDisponibilidadeHorarioResponse,
    GetDisponibilidadeMesResponse,
    GetFuncionariosResponseDto,
    GetServicoResponseDto
} from "./types";

/**
 * =========================================================
 * 
 * Instância HTTP (Axios)
 * =========================================================
 * @description
 * Cliente HTTP base utilizado por todos os serviços da Agenda.
 */
export const api: AxiosInstance = axios.create({
    baseURL: "http://agenda-backendapiagendamento-lz548l-8a58ac-187-77-2-83.sslip.io/",
    // baseURL: "https://sua-api.com.br/",
    timeout: 60000,
});

/**
 * =========================================================
 * Rotas da API
 * =========================================================
 * @description
 * Centraliza todos os endpoints relacionados ao módulo Agenda.
 */
const ROUTES = {

    // Funcionários
    GET_FUNCIONARIOS: `api/Agenda/funcionarios`,

    // Serviços
    GET_SERVICOS: (funcionarioId: number | string) =>
        `api/Agenda/servicos/${funcionarioId}`,

    // Disponibilidades (mês)
    GET_DISPONIBILIDADES_MES: (
        funcionarioId: number | string,
        ano: number,
        mes: number
    ) =>
        `api/Agenda/disponibilidades/funcionario/${funcionarioId}/ano/${ano}/mes/${mes}`,

    // Disponibilidades (dia)
    GET_DISPONIBILIDADES_DIA: (
        funcionarioId: number | string,
        ano: number,
        mes: number,
        dia: number
    ) =>
        `api/Agenda/disponibilidades/funcionario/${funcionarioId}/ano/${ano}/mes/${mes}/dia/${dia}`,

    // Agendamento
    POST_AGENDAMENTO: `api/Agenda/agendamento`,
};

/**
 * =========================================================
 * Interceptor de Request
 * =========================================================
 * @description
 * Injeta automaticamente o Bearer Token em todas as requisições.
 */
api.interceptors.request.use((config) => {

    config.headers['X-Agenda-Token'] = "1bFWy5TnLwdnoCKUAvsNf7Bi/EsdWnjJufGk2OCK6KQ="

    return config;

});

/**
 * =========================================================
 * Headers padrão
 * =========================================================
 * @description
 * Headers padrão aplicados em todas as requisições.
 */
const DEFAULT_HEADERS = {
    "Content-Type": "application/json"
};

/**
 * =========================================================
 * Serviço Agenda
 * =========================================================
 * @description
 * Responsável por encapsular todas as chamadas HTTP
 * relacionadas ao módulo de Agenda e Agendamento.
 */
export const API_AGENDA = {

    // =====================================================
    // FUNCIONÁRIOS
    // =====================================================

    /**
     * @description
     * Busca lista de funcionários disponíveis para agendamento.
     */
    getFuncionarios: async (): Promise<GetFuncionariosResponseDto | null> => {

        try {

            const { data } = await api.get<GetFuncionariosResponseDto>(
                ROUTES.GET_FUNCIONARIOS,
                {
                    headers: DEFAULT_HEADERS
                }
            );

            return data;

        } catch {
            return null;
        }

    },

    // =====================================================
    // SERVIÇOS
    // =====================================================

    /**
     * @description
     * Busca lista de serviços disponíveis para um funcionário.
     */
    getServicos: async (
        funcionarioId: number | string
    ): Promise<GetServicoResponseDto | null> => {

        try {

            const { data } = await api.get<GetServicoResponseDto>(
                ROUTES.GET_SERVICOS(funcionarioId),
                {
                    headers: DEFAULT_HEADERS
                }
            );

            return data;

        } catch {
            return null;
        }

    },

    // =====================================================
    // DISPONIBILIDADES
    // =====================================================

    /**
     * @description
     * Busca disponibilidades do funcionário para um mês específico.
     */
    getDisponibilidadesMes: async (
        funcionarioId: number | string,
        ano: number,
        mes: number
    ): Promise<GetDisponibilidadeMesResponse | null> => {

        try {

            const { data } = await api.get<GetDisponibilidadeMesResponse>(
                ROUTES.GET_DISPONIBILIDADES_MES(
                    funcionarioId,
                    ano,
                    mes
                ),
                {
                    headers: DEFAULT_HEADERS
                }
            );

            return data;

        } catch {
            return null;
        }

    },

    /**
     * =====================================================
     * GET DISPONIBILIDADES DIA
     * =====================================================
     * @description
     * Busca os horários disponíveis de um funcionário
     * em uma data específica.
     *
     * A API retorna uma lista contendo os horários
     * livres para agendamento naquele dia.
     *
     * Exemplo de retorno:
     * {
     *   statusCode: 200,
     *   result: [
     *     { horarios: "09:00" },
     *     { horarios: "10:30" },
     *     { horarios: "14:00" }
     *   ],
     *   message: "Sucesso"
     * }
     *
     * Fluxo:
     * - Monta rota com funcionário e data
     * - Realiza requisição HTTP GET
     * - Retorna resposta tipada da API
     * - Em caso de erro retorna estrutura vazia
     *
     * @param funcionarioId
     * Identificador do funcionário/profissional.
     *
     * @param ano
     * Ano da consulta.
     *
     * @param mes
     * Mês da consulta.
     *
     * @param dia
     * Dia da consulta.
     *
     * @returns
     * Objeto contendo os horários disponíveis para
     * agendamento na data informada.
     */
    getDisponibilidadesDia: async (
        funcionarioId: number | string,
        ano: number,
        mes: number,
        dia: number
    ): Promise<GetDisponibilidadeHorarioResponse> => {

        try {

            const { data } = await api.get<GetDisponibilidadeHorarioResponse>(
                ROUTES.GET_DISPONIBILIDADES_DIA(
                    funcionarioId,
                    ano,
                    mes,
                    dia
                ),
                {
                    headers: DEFAULT_HEADERS
                }
            );

            return data;

        } catch {

            /**
             * =============================================
             * FALLBACK
             * =============================================
             * @description
             * Retorna estrutura vazia em caso de erro
             * na comunicação com a API.
             */
            return {
                statusCode: 500,
                resultString: null,
                result: [],
                message: "Erro ao carregar horários disponíveis"
            };

        }

    },

    // =====================================================
    // AGENDAMENTO
    // =====================================================

    /**
     * @description
     * Realiza o agendamento de um serviço.
     */
    criarAgendamento: async (
        payload: AgendamentoRequestDto
    ): Promise<AgendamentoResponseDto | null> => {

        try {

            const { data } = await api.post<AgendamentoResponseDto>(
                ROUTES.POST_AGENDAMENTO,
                payload,
                {
                    headers: DEFAULT_HEADERS
                }
            );

            return data;

        } catch {
            return null;
        }

    },

};
