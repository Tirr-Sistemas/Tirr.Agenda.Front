import { API_AGENDA } from "@/service/AgendaApi";
import { GetDisponibilidadeMesResponse } from "@/service/AgendaApi/types";

/**
 * =========================================================
 * LOAD DAYS USE CASE
 * =========================================================
 * @description
 * Caso de uso responsável por carregar os dias disponíveis
 * para agendamento de um funcionário em um mês específico.
 *
 * Fluxo:
 * 1. Consulta a API de disponibilidade mensal
 * 2. Valida a resposta da API
 * 3. Extrai apenas os números dos dias disponíveis
 * 4. Retorna uma lista simplificada de dias
 *
 * Exemplo de retorno:
 * [1, 5, 12, 18, 25]
 *
 * Camada:
 * - Application Layer (Use Case)
 *
 * @param employerId
 * Identificador do funcionário/profissional.
 *
 * @param year
 * Ano da consulta de disponibilidade.
 *
 * @param month
 * Mês da consulta de disponibilidade.
 *
 * @returns
 * Lista contendo os dias disponíveis para agendamento.
 */

export interface LoadDaysUseCaseArgs {
  employerId: number,
  year: number,
  month: number
}

const loadDaysUseCase = async ({ employerId, month, year }:LoadDaysUseCaseArgs): Promise<number[]> => {

  /**
   * =====================================================
   * DISPONIBILIDADE MENSAL
   * =====================================================
   * @description
   * Busca os dias disponíveis para agendamento do
   * funcionário informado.
   */
  const servicosResponse: GetDisponibilidadeMesResponse | null =
    await API_AGENDA.getDisponibilidadesMes(
      employerId,
      year,
      month
    );

  /**
   * =====================================================
   * VALIDAÇÃO RESPOSTA
   * =====================================================
   * @description
   * Interrompe execução caso a API não retorne resultados.
   */
  if (!servicosResponse?.result) {
    return [];
  }

  /**
   * =====================================================
   * EXTRAÇÃO DOS DIAS
   * =====================================================
   * @description
   * Converte a estrutura da API em uma lista simples
   * contendo apenas os números dos dias disponíveis.
   */
  const days: number[] = [];

  for (const item of servicosResponse.result) {
    days.push(item.dias);
  }

  /**
   * =====================================================
   * RETURN
   * =====================================================
   * @description
   * Retorna lista de dias disponíveis.
   */
  return days;

};

export default loadDaysUseCase;