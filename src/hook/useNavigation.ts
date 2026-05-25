import { ScheduleFlow, type ScheduleRoute } from "@/config";
import useGlobalContext from "@/store";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * =========================================================
 * HOOK: useScheduleNavigation
 * =========================================================
 * @description
 * Responsável por controlar a navegação do fluxo de agendamento
 * (wizard de etapas).
 *
 * Fluxo:
 * /agenda-servico
 * → /agenda-dia-e-hora
 * → /agenda-perfil
 * → /agenda-confirmacao
 *
 * Este hook centraliza:
 * - Página atual do fluxo
 * - Navegação direta entre etapas
 * - Avançar e voltar no fluxo
 * - Estado derivado do progresso
 */
const useScheduleNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

   /**
   * =====================================================
   * PÁGINA ATUAL
   * =====================================================
   * @description
   * Rota atual tipada dentro do fluxo de agendamento.
   */
  const currentPage = location.pathname as ScheduleRoute;

  const numberPage = ScheduleFlow.indexOf(currentPage)

  const { schedule } = useGlobalContext();

  useEffect(() => {
    const isStatesEmpty = (!schedule || Object.keys(schedule).length === 0) && numberPage > 0;
    
    if (isStatesEmpty) {
      navigate(ScheduleFlow[0], { replace: true });
    }
  }, [schedule, numberPage, navigate]);

  /**
   * =====================================================
   * NAVEGAR PARA UMA PÁGINA ESPECÍFICA
   * =====================================================
   * @description
   * Permite ir diretamente para uma etapa do fluxo.
   */
  const goTo = (page: ScheduleRoute) => {
    navigate(page);
  };

  /**
   * =====================================================
   * PRÓXIMA ETAPA
   * =====================================================
   * @description
   * Avança para a próxima página do fluxo de agendamento.
   */
  const next = () => {
    const index = ScheduleFlow.indexOf(currentPage);
    const nextPage = ScheduleFlow[index + 1];

    if (nextPage) {
      navigate(nextPage);
    }
  };

  /**
   * =====================================================
   * ETAPA ANTERIOR
   * =====================================================
   * @description
   * Retorna para a etapa anterior do fluxo.
   */
  const back = () => {
    const index = ScheduleFlow.indexOf(currentPage);
    const prevPage = ScheduleFlow[index - 1];

    if (prevPage) {
      navigate(prevPage);
    }
  };

  return {
    /**
     * Página atual do fluxo
     */
    currentPage,

    /**
     * Navega diretamente para uma página
     */
    goTo,

    /**
     * Avança para próxima etapa
     */
    next,

    /**
     * Volta para etapa anterior
     */
    back,

    /**
     * Indica se está na primeira etapa
     */
    isFirstPage: currentPage === ScheduleFlow[0],

    /**
     * Indica se está na última etapa
     */
    isLastPage: currentPage === ScheduleFlow[ScheduleFlow.length - 1],

    /**
     * Indica o número da página
     */
    numberPage
  };
};

export default useScheduleNavigation;