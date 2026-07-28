import { API_AGENDA } from "@/service/AgendaApi";
import { GetDisponibilidadeHorarioResponse } from "@/service/AgendaApi/types";

/**
 * =========================================================
 * LOAD HOURS USE CASE
 * =========================================================
 * @description
 * Caso de uso responsável por carregar os horários
 * disponíveis para agendamento de um funcionário
 * em uma data específica.
 *
 * Fluxo:
 * 1. Consulta a API de disponibilidade diária
 * 2. Valida a resposta da API
 * 3. Extrai apenas os horários disponíveis
 * 4. Retorna uma lista simplificada de horários
 *
 * Exemplo de retorno:
 * [
 *   "09:00",
 *   "10:30",
 *   "14:00"
 * ]
 *
 * Camada:
 * - Application Layer (Use Case)
 *
 * @param employerId
 * Identificador do funcionário/profissional.
 *
 * @param year
 * Ano da consulta.
 *
 * @param month
 * Mês da consulta.
 *
 * @param day
 * Dia da consulta.
 *
 * @returns
 * Lista contendo os horários disponíveis para
 * agendamento.
 */

/**
 * =========================================================
 * LOAD HOURS USE CASE ARGS
 * =========================================================
 * @description
 * Argumentos necessários para carregar os horários
 * disponíveis.
 */
export interface LoadHoursUseCaseArgs {

  /**
   * =====================================================
   * EMPLOYER ID
   * =====================================================
   * @description
   * Identificador do funcionário/profissional.
   */
  employerId: number;

  /**
   * =====================================================
   * YEAR
   * =====================================================
   * @description
   * Ano da consulta.
   */
  year: number;

  /**
   * =====================================================
   * MONTH
   * =====================================================
   * @description
   * Mês da consulta.
   */
  month: number;

  /**
   * =====================================================
   * DAY
   * =====================================================
   * @description
   * Dia da consulta.
   */
  day: number;

}

const loadHoursUseCase = async ({
  employerId,
  year,
  month,
  day
}: LoadHoursUseCaseArgs): Promise<string[]> => {

  /**
   * =====================================================
   * DISPONIBILIDADE DIÁRIA
   * =====================================================
   * @description
   * Busca os horários disponíveis para agendamento
   * do funcionário na data informada.
   */
  const response: GetDisponibilidadeHorarioResponse | null =
    await API_AGENDA.getDisponibilidadesDia(
      employerId,
      year,
      month,
      day
    );

  /**
   * =====================================================
   * VALIDAÇÃO RESPOSTA
   * =====================================================
   * @description
   * Interrompe execução caso a API não retorne horários.
   */
  if (!response?.result) {
    return [];
  }

  /**
   * =====================================================
   * EXTRAÇÃO DOS HORÁRIOS
   * =====================================================
   * @description
   * Converte a estrutura da API em uma lista simples
   * contendo apenas os horários disponíveis.
   */
  const hours: string[] = [];

  for (const item of response.result) {
    hours.push(item.horarios);
  }

  /**
   * =====================================================
   * RETURN
   * =====================================================
   * @description
   * Retorna lista de horários disponíveis.
   */
  return hours;

};

export default loadHoursUseCase;