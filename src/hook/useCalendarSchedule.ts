import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";

import { DAY_WEEK, MONTHS } from "@/constants/calendar";
import { HOURS_PERIOD } from "@/constants/hours";
import useScheduleNavigation from "@/hook/useNavigation";
import usePromise from "@/hook/usePromise";
import useGlobalContext from "@/store";
import loadDaysUseCase, { type LoadDaysUseCaseArgs } from "@/useCases/scheduler/loadDaysUseCase";
import loadHoursUseCase, { type LoadHoursUseCaseArgs } from "@/useCases/scheduler/loadHoursUseCase";
import { calendarGenerate } from "@/utils/calendarGenerate";
import { isValidDate } from "@/utils/date";

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
  daysHasError: boolean;
  hoursHasError: boolean;
  disabledButton: boolean;
  DAY_WEEK: typeof DAY_WEEK;
  MONTHS: typeof MONTHS;
  setSelectedPeriod: Dispatch<SetStateAction<number>>;
  setHour: (hour: string) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  retryDays: () => Promise<number[]>;
  retryHours: () => Promise<string[]>;
  handleSelectDate: (day: number, customMonth?: number, customYear?: number) => void;
  handleContinue: () => void;
  handleBack: () => void;
};

const EMPTY_DAYS: number[] = [];
const EMPTY_HOURS: string[] = [];

const useCalendarSchedule = (): UseCalendarScheduleReturn => {
  const { schedule, updateSchedule } = useGlobalContext();
  const { next, back } = useScheduleNavigation();
  const {
    execute: loadDays,
    result: availableDays,
    isLoading: daysIsLoading,
    hasError: daysHasError,
  } = usePromise<number[], [LoadDaysUseCaseArgs]>(loadDaysUseCase, EMPTY_DAYS);
  const {
    execute: loadHours,
    result: availableHours,
    isLoading: hoursIsLoading,
    hasError: hoursHasError,
  } = usePromise<string[], [LoadHoursUseCaseArgs]>(loadHoursUseCase, EMPTY_HOURS);

  const savedDate = useMemo(() => {
    if (schedule.chosenDay === undefined || schedule.chosenMonth === undefined) {
      return null;
    }

    return new Date(
      schedule.chosenYear || new Date().getFullYear(),
      schedule.chosenMonth,
      schedule.chosenDay
    );
  }, [schedule.chosenDay, schedule.chosenMonth, schedule.chosenYear]);

  const [viewDate, setViewDate] = useState<Date>(() => savedDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => savedDate);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(HOURS_PERIOD.PERIOD_DAY);
  const [hour, setHour] = useState<string>(() => schedule.chosenHour || "");

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const days = useMemo(() => {
    const currentMonthDays = calendarGenerate(month, year);
    const remaining = (7 - (currentMonthDays.length % 7)) % 7;
    const nextMonthDate = new Date(year, month + 1);
    const formattedCurrentMonth = currentMonthDays.map((day) => (
      day ? { day, month, year, isPreview: false } : null
    ));
    const nextMonthPreview = Array.from({ length: remaining }, (_, index) => ({
      day: index + 1,
      month: nextMonthDate.getMonth(),
      year: nextMonthDate.getFullYear(),
      isPreview: true,
    }));

    return [...formattedCurrentMonth, ...nextMonthPreview];
  }, [month, year]);

  const disabledButton =
    year < new Date().getFullYear() ||
    (year === new Date().getFullYear() && month <= new Date().getMonth());

  useEffect(() => {
    const loadAvailability = async () => {
      const isSameSavedMonth =
        savedDate &&
        savedDate.getMonth() === month &&
        savedDate.getFullYear() === year;

      if (!isSameSavedMonth) {
        setSelectedDate(null);
        setHour("");
        setSelectedPeriod(HOURS_PERIOD.PERIOD_DAY);
      }

      await loadDays({ employerId: 1, year, month: month + 1 });
    };

    void loadAvailability();
  }, [loadDays, month, savedDate, year]);

  useEffect(() => {
    const loadHoursByDay = async () => {
      if (!selectedDate) {
        return;
      }

      await loadHours({
        employerId: 1,
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      });
    };

    void loadHoursByDay();
  }, [loadHours, selectedDate]);

  const filteredHours = useMemo(() => (
    availableHours.filter((availableHour) => {
      const hourNumber = Number(availableHour.split(":")[0]);
      return selectedPeriod === HOURS_PERIOD.PERIOD_DAY ? hourNumber < 17 : hourNumber >= 17;
    })
  ), [availableHours, selectedPeriod]);

  const prevMonth = () => setViewDate(new Date(year, month - 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1));

  const handleSelectDate = (day: number, customMonth = month, customYear = year) => {
    const available = availableDays.includes(day);

    if (!isValidDate(day, customMonth, customYear) || !available) {
      return;
    }

    setSelectedDate(new Date(customYear, customMonth, day));
    setHour("");
  };

  const handleSetHour = (value: string) => {
    setHour(value);

    if (!value) {
      return;
    }

    setSelectedPeriod(
      Number(value.split(":")[0]) >= 17
        ? HOURS_PERIOD.PERIOD_NIGHT
        : HOURS_PERIOD.PERIOD_DAY
    );
  };

  const handleContinue = () => {
    if (!selectedDate || !hour) {
      return;
    }

    updateSchedule({
      chosenDay: selectedDate.getDate(),
      chosenMonth: selectedDate.getMonth(),
      chosenYear: selectedDate.getFullYear(),
      chosenHour: hour,
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
    daysHasError,
    hoursHasError,
    disabledButton,
    DAY_WEEK,
    MONTHS,
    setSelectedPeriod,
    setHour: handleSetHour,
    prevMonth,
    nextMonth,
    retryDays: () => loadDays({ employerId: 1, year, month: month + 1 }),
    retryHours: () => selectedDate
      ? loadHours({
          employerId: 1,
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        })
      : Promise.resolve(EMPTY_HOURS),
    handleSelectDate,
    handleContinue,
    handleBack: back,
  };
};

export default useCalendarSchedule;
