import { useEffect, useMemo, useState } from "react";

import { DAY_WEEK, MONTHS } from "@/constants/calendar";
import { HOURS_PERIOD } from "@/constants/hours";

import usePromise from "@/hook/usePromise";
import useScheduleNavigation from "@/hook/useNavigation";

import useGlobalContext from "@/store";

import loadDaysUseCase, {
  LoadDaysUseCaseArgs
} from "@/useCases/loadDaysUseCase";

import loadHoursUseCase, {
  LoadHoursUseCaseArgs
} from "@/useCases/loadHoursUseCase";

import { calendarGenerate } from "@/utils/calendarGenerate";
import { isValidDate } from "@/utils/date";

/**
 * =====================================================
 * TYPES
 * =====================================================
 */
export type CalendarDay = {
  day: number;
  month: number;
  year: number;
  isPreview: boolean;
};

type UseCalendarScheduleReturn = {
  month: number;
  year: number;

  days: (CalendarDay | null)[];

  availableDays: number[];
  availableHours: string[];

  selectedDate: Date | null;
  selectedPeriod: number;
  hour: string;

  filteredHours: string[];

  daysIsLoading: boolean;
  hoursIsLoading: boolean;

  disabledButton: boolean;

  DAY_WEEK: typeof DAY_WEEK;
  MONTHS: typeof MONTHS;

  setSelectedPeriod:
    React.Dispatch<
      React.SetStateAction<number>
    >;

  setHour:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  prevMonth: () => void;
  nextMonth: () => void;

  handleSelectDate: (
    day: number,
    customMonth?: number,
    customYear?: number
  ) => void;

  handleContinue: () => void;
  handleBack: () => void;
};

const useCalendarSchedule =
  (): UseCalendarScheduleReturn => {

    /**
     * =====================================================
     * SERVICES
     * =====================================================
     */
    const {
      execute: loadDays,
      result: availableDays,
      isLoading: daysIsLoading
    } = usePromise<
      number[],
      [LoadDaysUseCaseArgs]
    >(
      loadDaysUseCase,
      []
    );

    const {
      execute: loadHours,
      result: availableHours,
      isLoading: hoursIsLoading
    } = usePromise<
      string[],
      [LoadHoursUseCaseArgs]
    >(
      loadHoursUseCase,
      []
    );

    /**
     * =====================================================
     * CONTEXT
     * =====================================================
     */
    const {
      schedule,
      updateSchedule
    } = useGlobalContext();

    const {
      next,
      back
    } = useScheduleNavigation();

    /**
     * =====================================================
     * SAVED DATE
     * =====================================================
     */
    const savedDate =
      schedule.chosenDay !== undefined &&
      schedule.chosenMonth !== undefined
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
     */
    const [viewDate, setViewDate] =
      useState<Date>(
        savedDate || new Date()
      );

    const [selectedDate, setSelectedDate] =
      useState<Date | null>(
        savedDate
      );

    const [selectedPeriod, setSelectedPeriod] =
      useState<number>(
        HOURS_PERIOD.PERIOD_DAY
      );

    const [hour, setHour] =
      useState<string>(
        schedule.chosenHour || ""
      );

    /**
     * =====================================================
     * DATE INFO
     * =====================================================
     */
    const month =
      viewDate.getMonth();

    const year =
      viewDate.getFullYear();

    /**
     * =====================================================
     * CALENDAR
     * =====================================================
     * Adiciona preview do próximo mês
     */
    const days = useMemo(() => {
      const currentMonthDays = calendarGenerate(month, year);

      const remainder = currentMonthDays.length % 7;
      const remaining = remainder === 0 ? 0 : 7 - remainder;

      /**
       * ===============================================
       * FORMATAR MÊS ATUAL
       * ===============================================
       */
      const formattedCurrentMonth = currentMonthDays.map((day) => {
        if (!day) return null;
        return { day, month, year, isPreview: false };
      });

      /**
       * ===============================================
       * PREENCHER O FINAL (MÊS SEGUINTE)
       * ===============================================
       */
      const nextMonthDate = new Date(year, month + 1);
      const nextMonthPreview = Array.from({ length: remaining }, (_, index) => ({
        day: index + 1,
        month: nextMonthDate.getMonth(),
        year: nextMonthDate.getFullYear(),
        isPreview: true,
      }));

      return [...formattedCurrentMonth, ...nextMonthPreview];
    }, [month, year]);

    /**
     * =====================================================
     * MONTH NAVIGATION
     * =====================================================
     */
    const prevMonth = () => {

      setViewDate(
        new Date(
          year,
          month - 1
        )
      );

    };

    const nextMonth = () => {

      setViewDate(
        new Date(
          year,
          month + 1
        )
      );

    };

    /**
     * =====================================================
     * PREVIOUS MONTH BLOCK
     * =====================================================
     */
    const disabledButton =
      year <
        new Date().getFullYear() ||
      (
        year ===
          new Date().getFullYear() &&
        month <=
          new Date().getMonth()
      );

    /**
     * =====================================================
     * LOAD AVAILABLE DAYS
     * =====================================================
     */
    useEffect(() => {

      let mounted = true;

      const loadAvailability =
        async () => {

          setSelectedDate(null);
          setHour("");

          await loadDays({
            employerId: 1,
            year,
            month: month + 1
          });

          if (!mounted) {
            return;
          }

        };

      loadAvailability();

      return () => {
        mounted = false;
      };

    }, [year, month]);

    /**
     * =====================================================
     * LOAD HOURS
     * =====================================================
     */
    useEffect(() => {

      const loadHoursByDay =
        async () => {

          if (!selectedDate) {
            return;
          }

          setHour("");

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
     */
    const filteredHours =
      useMemo(() => {

        return availableHours.filter(
          (hour) => {

            const hourNumber =
              Number(
                hour.split(":")[0]
              );

            if (
              selectedPeriod ===
              HOURS_PERIOD.PERIOD_DAY
            ) {
              return hourNumber < 17;
            }

            return hourNumber >= 17;

          }
        );

      }, [
        availableHours,
        selectedPeriod
      ]);

    /**
     * =====================================================
     * SELECT DATE
     * =====================================================
     */
    const handleSelectDate = (
      day: number,
      customMonth = month,
      customYear = year
    ) => {

      const valid =
        isValidDate(
          day,
          customMonth,
          customYear
        );

      const available =
        availableDays.includes(day);

      if (!valid || !available) {
        return;
      }

      setSelectedDate(
        new Date(
          customYear,
          customMonth,
          day
        )
      );

    };

    /**
     * =====================================================
     * CONTINUE
     * =====================================================
     */
    const handleContinue = () => {

      if (
        !selectedDate ||
        !hour
      ) {
        return;
      }

      updateSchedule({
        chosenDay:
          selectedDate.getDate(),

        chosenMonth:
          selectedDate.getMonth(),

        chosenYear:
          selectedDate.getFullYear(),

        chosenHour: hour
      });

      next();

    };

    return {
      month,
      year,

      days,

      availableDays,
      availableHours,

      selectedDate,
      selectedPeriod,
      hour,

      filteredHours,

      daysIsLoading,
      hoursIsLoading,

      disabledButton,

      DAY_WEEK,
      MONTHS,

      setSelectedPeriod,
      setHour,

      prevMonth,
      nextMonth,

      handleSelectDate,
      handleContinue,

      handleBack: back
    };

};

export default useCalendarSchedule;