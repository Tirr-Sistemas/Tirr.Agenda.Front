// hooks/useCalendar.ts

import {
    useEffect,
    useMemo,
    useState
} from "react";

import { HOURS_PERIOD } from "@/constants/hours";

import usePromise from "@/hook/usePromise";

import { LoadDaysUseCaseArgs } from "@/useCases/scheduler/loadDaysUseCase";
import { LoadHoursUseCaseArgs } from "@/useCases/scheduler/loadHoursUseCase";

import { calendarGenerate } from "@/utils/calendarGenerate";
import { isValidDate } from "@/utils/date";

/**
 * =========================================================
 * INTERFACE: UseCalendarArgs
 * =========================================================
 *
 * @description
 * Propriedades utilizadas pelo hook `useCalendar`.
 *
 * Responsável por fornecer:
 * - Use case de carregamento de dias disponíveis.
 * - Use case de carregamento de horários.
 * - Dados previamente salvos do agendamento.
 */
export interface UseCalendarArgs {

    /**
     * =====================================================
     * LOAD DAYS USE CASE
     * =====================================================
     *
     * @description
     * Função responsável por carregar os dias disponíveis
     * para agendamento.
     */
    loadDaysUseCase: (
        args: LoadDaysUseCaseArgs
    ) => Promise<number[]>;

    /**
     * =====================================================
     * LOAD HOURS USE CASE
     * =====================================================
     *
     * @description
     * Função responsável por carregar os horários
     * disponíveis do dia selecionado.
     */
    loadHoursUseCase: (
        args: LoadHoursUseCaseArgs
    ) => Promise<string[]>;

    /**
     * =====================================================
     * SCHEDULE
     * =====================================================
     *
     * @description
     * Dados previamente selecionados no fluxo
     * de agendamento.
     */
    schedule: {

        /**
         * Dia selecionado.
         */
        chosenDay?: number;

        /**
         * Mês selecionado.
         */
        chosenMonth?: number;

        /**
         * Ano selecionado.
         */
        chosenYear?: number;

        /**
         * Horário selecionado.
         */
        chosenHour?: string;

    };

}

/**
 * =========================================================
 * HOOK: useCalendar
 * =========================================================
 *
 * @description
 * Hook responsável por encapsular toda a lógica
 * do calendário e horários do fluxo de agendamento.
 *
 * Funcionalidades:
 * - Controle do mês visualizado.
 * - Navegação entre meses.
 * - Seleção de dias.
 * - Carregamento de disponibilidade.
 * - Carregamento de horários.
 * - Filtro de horários por período.
 * - Validações de datas.
 * - Controle de estados do calendário.
 */
const useCalendar = (
    props: UseCalendarArgs
) => {

    /**
     * =====================================================
     * PROPS
     * =====================================================
     *
     * @description
     * Recupera as propriedades recebidas pelo hook.
     */
    const {
        loadDaysUseCase,
        loadHoursUseCase,
        schedule
    } = props;

    /**
     * =====================================================
     * REQUESTS
     * =====================================================
     *
     * @description
     * Hooks responsáveis pelo controle das requisições
     * assíncronas de dias e horários disponíveis.
     */

    /**
     * =====================================================
     * LOAD DAYS REQUEST
     * =====================================================
     *
     * @description
     * Responsável por carregar os dias disponíveis
     * para o mês atual.
     */
    const {
        execute: loadDays,
        result: availableDays,
        isLoading: daysIsLoading
    } = usePromise<number[], [LoadDaysUseCaseArgs]>(
        loadDaysUseCase,
        []
    );

    /**
     * =====================================================
     * LOAD HOURS REQUEST
     * =====================================================
     *
     * @description
     * Responsável por carregar os horários disponíveis
     * para o dia selecionado.
     */
    const {
        execute: loadHours,
        result: availableHours,
        isLoading: hoursIsLoading
    } = usePromise<string[], [LoadHoursUseCaseArgs]>(
        loadHoursUseCase,
        []
    );

    /**
     * =====================================================
     * SAVED DATE
     * =====================================================
     *
     * @description
     * Recupera a data previamente salva no fluxo,
     * caso exista.
     */
    const savedDate =
        schedule?.chosenDay !== undefined &&
            schedule?.chosenMonth !== undefined
            ? new Date(
                schedule.chosenYear ||
                new Date().getFullYear(),
                schedule.chosenMonth,
                schedule.chosenDay
            )
            : null;

    /**
     * =====================================================
     * STATES
     * =====================================================
     *
     * @description
     * Estados internos responsáveis pelo controle
     * do calendário.
     */

    /**
     * =====================================================
     * VIEW DATE
     * =====================================================
     *
     * @description
     * Data utilizada como referência para navegação
     * do calendário.
     */
    const [viewDate, setViewDate] =
        useState<Date>(
            savedDate || new Date()
        );

    /**
     * =====================================================
     * SELECTED DATE
     * =====================================================
     *
     * @description
     * Data atualmente selecionada pelo usuário.
     */
    const [selectedDate, setSelectedDate] =
        useState<Date | null>(
            savedDate
        );

    /**
     * =====================================================
     * SELECTED PERIOD
     * =====================================================
     *
     * @description
     * Período selecionado para filtragem dos horários.
     */
    const [selectedPeriod, setSelectedPeriod] =
        useState<number>(
            HOURS_PERIOD.PERIOD_DAY
        );

    /**
     * =====================================================
     * SELECTED HOUR
     * =====================================================
     *
     * @description
     * Horário atualmente selecionado.
     */
    const [hour, setHour] =
        useState<string>(
            schedule?.chosenHour || ""
        );

    /**
     * =====================================================
     * DATE INFO
     * =====================================================
     *
     * @description
     * Informações derivadas da data visualizada
     * no calendário.
     */
    const month = viewDate.getMonth();

    const year = viewDate.getFullYear();

    /**
     * =====================================================
     * CALENDAR DAYS
     * =====================================================
     *
     * @description
     * Gera os dias do calendário baseado
     * no mês e ano atual.
     */
    const days = useMemo(() => {

        return calendarGenerate(
            month,
            year
        );

    }, [month, year]);

    /**
     * =====================================================
     * MONTH NAVIGATION
     * =====================================================
     *
     * @description
     * Funções responsáveis pela navegação
     * entre meses.
     */

    /**
     * =====================================================
     * PREVIOUS MONTH
     * =====================================================
     *
     * @description
     * Navega para o mês anterior.
     */
    const prevMonth = () => {

        setViewDate(
            new Date(year, month - 1)
        );

    };

    /**
     * =====================================================
     * NEXT MONTH
     * =====================================================
     *
     * @description
     * Navega para o próximo mês.
     */
    const nextMonth = () => {

        setViewDate(
            new Date(year, month + 1)
        );

    };

    /**
     * =====================================================
     * PREVIOUS MONTH BLOCK
     * =====================================================
     *
     * @description
     * Impede navegação para meses anteriores
     * ao mês atual.
     */
    const disabledPrevMonth =
        year < new Date().getFullYear() ||
        (
            year === new Date().getFullYear() &&
            month <= new Date().getMonth()
        );

    /**
     * =====================================================
     * LOAD AVAILABLE DAYS
     * =====================================================
     *
     * @description
     * Carrega os dias disponíveis sempre que
     * o mês ou ano visualizado mudar.
     */
    useEffect(() => {

        let mounted = true;

        const loadAvailability = async () => {

            /**
             * =============================================
             * RESET
             * =============================================
             *
             * @description
             * Limpa a data e horário selecionados ao trocar
             * de mês.
             */
            setSelectedDate(null);

            setHour("");

            /**
             * =============================================
             * LOAD DAYS
             * =============================================
             *
             * @description
             * Busca os dias disponíveis para o mês atual.
             */
            await loadDays({
                employerId: 1,
                year,
                month: month + 1
            });

            /**
             * =============================================
             * COMPONENT UNMOUNT
             * =============================================
             *
             * @description
             * Evita atualizações após desmontagem
             * do componente.
             */
            if (!mounted) {
                return;
            }

        };

        loadAvailability();

        return () => {
            mounted = false;
        };

    }, [month, year]);

    /**
     * =====================================================
     * LOAD HOURS
     * =====================================================
     *
     * @description
     * Carrega os horários disponíveis sempre que
     * uma data for selecionada.
     */
    useEffect(() => {

        const loadHoursByDay = async () => {

            /**
             * =============================================
             * VALIDATION
             * =============================================
             *
             * @description
             * Impede execução sem data selecionada.
             */
            if (!selectedDate) {
                return;
            }

            /**
             * =============================================
             * RESET HOUR
             * =============================================
             *
             * @description
             * Remove o horário previamente selecionado.
             */
            setHour("");

            /**
             * =============================================
             * LOAD HOURS
             * =============================================
             *
             * @description
             * Busca os horários disponíveis do dia.
             */
            await loadHours({
                employerId: 1,
                year:
                    selectedDate.getFullYear(),
                month:
                    selectedDate.getMonth() + 1,
                day:
                    selectedDate.getDate()
            });

        };

        loadHoursByDay();

    }, [selectedDate]);

    /**
     * =====================================================
     * FILTERED HOURS
     * =====================================================
     *
     * @description
     * Filtra os horários disponíveis de acordo
     * com o período selecionado.
     *
     * Regras:
     * - Dia: horários antes das 18h.
     * - Noite: horários a partir das 18h.
     */
    const filteredHours = useMemo(() => {

        return availableHours.filter((hour) => {

            const hourNumber =
                Number(hour.split(":")[0]);

            if (
                selectedPeriod ===
                HOURS_PERIOD.PERIOD_DAY
            ) {
                return hourNumber < 18;
            }

            return hourNumber >= 18;

        });

    }, [
        availableHours,
        selectedPeriod
    ]);

    /**
     * =====================================================
     * HELPERS
     * =====================================================
     *
     * @description
     * Funções auxiliares utilizadas pela interface.
     */

    /**
     * =====================================================
     * IS DAY DISABLED
     * =====================================================
     *
     * @description
     * Verifica se um dia deve ficar desabilitado.
     *
     * Regras:
     * - Datas inválidas.
     * - Dias indisponíveis.
     */
    const isDayDisabled = (
        day: number
    ) => {

        const dateIsValid =
            isValidDate(day, month, year);

        const dayIsAvailable =
            availableDays.includes(day);

        return (
            !dateIsValid ||
            !dayIsAvailable
        );

    };

    /**
     * =====================================================
     * IS DAY SELECTED
     * =====================================================
     *
     * @description
     * Verifica se o dia informado é o dia atualmente
     * selecionado.
     */
    const isDaySelected = (
        day: number
    ) => {

        return (
            selectedDate?.getDate() === day &&
            selectedDate?.getMonth() === month &&
            selectedDate?.getFullYear() === year
        );

    };

    /**
     * =====================================================
     * SELECT DAY
     * =====================================================
     *
     * @description
     * Seleciona um dia no calendário.
     */
    const selectDay = (
        day: number
    ) => {

        setSelectedDate(
            new Date(year, month, day)
        );

    };

    return {

        /**
         * =================================================
         * DATE
         * =================================================
         *
         * @description
         * Informações da data atual do calendário.
         */
        month,
        year,
        days,
        viewDate,

        /**
         * =================================================
         * STATES
         * =================================================
         *
         * @description
         * Estados controlados do calendário.
         */
        selectedDate,
        selectedPeriod,
        hour,

        /**
         * =================================================
         * LOADERS
         * =================================================
         *
         * @description
         * Estados de carregamento das requisições.
         */
        daysIsLoading,
        hoursIsLoading,

        /**
         * =================================================
         * DATA
         * =================================================
         *
         * @description
         * Dados derivados do calendário.
         */
        availableDays,
        availableHours,
        filteredHours,

        /**
         * =================================================
         * ACTIONS
         * =================================================
         *
         * @description
         * Funções responsáveis pela manipulação
         * do calendário.
         */
        setHour,
        setSelectedPeriod,
        prevMonth,
        nextMonth,
        selectDay,

        /**
         * =================================================
         * VALIDATIONS
         * =================================================
         *
         * @description
         * Funções e flags auxiliares de validação.
         */
        disabledPrevMonth,
        isDayDisabled,
        isDaySelected

    };

};

export default useCalendar;