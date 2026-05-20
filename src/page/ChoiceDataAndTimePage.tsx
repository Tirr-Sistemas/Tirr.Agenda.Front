import { DAY_WEEK, MONTHS } from "@/constants/calendar";
import { HOURS_PERIOD } from "@/constants/hours";
import useScheduleNavigation from "@/hook/useNavigation";
import usePromise from "@/hook/usePromise";
import {
  CarretLeftIcon,
  CarretRightIcon,
  MoonIcon,
  SunIcon
} from "@/shared/icons";
import useGlobalContext from "@/store";

import loadDaysUseCase, {
  LoadDaysUseCaseArgs
} from "@/useCases/loadDaysUseCase";
import loadHoursUseCase, { LoadHoursUseCaseArgs } from "@/useCases/loadHoursUseCase";

import { calendarGenerate } from "@/utils/calendarGenerate";
import { isValidDate } from "@/utils/date";

import {
  useEffect,
  useMemo,
  useState
} from "react";

/**
 * =========================================================
 * PAGE: ChoiceDataAndTimePage
 * =========================================================
 */
const ChoiceDataAndTimePage = () => {

  /**
   * =====================================================
   * HOOKS
   * =====================================================
   */
  const {
    execute: loadDays,
    result: availableDays,
    isLoading: daysIsLoading
  } = usePromise<number[], [LoadDaysUseCaseArgs]>(
    loadDaysUseCase,
    []
  );

  const {
    execute: loadHours,
    result: availableHours,
    isLoading: hoursIsLoading
  } = usePromise<string[], [LoadHoursUseCaseArgs]>(
    loadHoursUseCase,
    []
  );

  const { schedule, updateSchedule } =
    useGlobalContext();

  const { next, back } =
    useScheduleNavigation();

  /**
   * =====================================================
   * DATA SALVA
   * =====================================================
   */
  const dateSelectedSaveSchedule =
    schedule.chosenDay &&
      schedule.chosenMonth
      ? new Date(
        new Date().getFullYear(),
        MONTHS.indexOf(
          MONTHS[schedule.chosenMonth]
        ),
        schedule.chosenDay
      )
      : null;

  /**
   * =====================================================
   * STATES
   * =====================================================
   */
  const [viewDate, setViewDate] =
    useState(new Date());

  const [selectedDate, setSelectedDate] =
    useState<Date | null>(
      dateSelectedSaveSchedule
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
  const month = viewDate.getMonth();

  const year = viewDate.getFullYear();

  /**
   * =====================================================
   * CALENDÁRIO
   * =====================================================
   */
  const days = useMemo(() => {
    return calendarGenerate(month, year);
  }, [month, year]);

  /**
   * =====================================================
   * NAVEGAÇÃO MÊS
   * =====================================================
   */
  const prevMonth = () => {
    setViewDate(
      new Date(year, month - 1)
    );
  };

  const nextMonth = () => {
    setViewDate(
      new Date(year, month + 1)
    );
  };

  /**
   * =====================================================
   * BLOQUEIO MÊS ANTERIOR
   * =====================================================
   */
  const disabledButton =
    year < new Date().getFullYear() ||
    (
      year === new Date().getFullYear() &&
      month <= new Date().getMonth()
    );

  /**
   * =====================================================
   * CARREGA DIAS DISPONÍVEIS
   * =====================================================
   */
  useEffect(() => {

    let mounted = true;

    const loadAvailability = async () => {

      /**
       * =============================================
       * RESET
       * =============================================
       */
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
   * CARREGA HORÁRIOS
   * =====================================================
   */
  useEffect(() => {

    const loadHoursByDay = async () => {

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
   * HORÁRIOS FILTRADOS
   * =====================================================
   * @description
   * Filtra horários baseado no período selecionado.
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
   * CONTINUAR
   * =====================================================
   */
  const handleContinue = () => {

    if (!selectedDate || !hour) {
      return;
    }

    updateSchedule({

      chosenDay:
        selectedDate.getDate(),

      chosenMonth:selectedDate.getMonth(),

      chosenHour:
        hour,

      chosenYear:
        year

    });

    next();

  };

                console.log("🚀 ~ ChoiceDataAndTimePage ~ selectedDate:", selectedDate)
  return (
    <div className="container py-5 px-3 d-flex gap-5 flex-column justify-content-center align-items-center tirr__calendar-time-page__calendar-container">
      {/* CALENDÁRIO */}
      <div>

        <div className="mb-2 w-100">
          <h6 className="fs-6 text-muted fw-light">
            Vamos encontrar o dia ideal para você
          </h6>
        </div>

        <div className="bg-white rounded-3 py-2" style={{minHeight: '330px'}}>
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3 px-3">
            <h6 className="text-uppercase">
              {MONTHS[month]} {year}
            </h6>

            <div className="d-flex gap-1">
              <button
                className="btn"
                disabled={disabledButton}
                onClick={prevMonth}
              >
                <CarretLeftIcon />
              </button>

              <button
                className="btn"
                onClick={nextMonth}
              >
                <CarretRightIcon />
              </button>
            </div>

          </div>

          {/* WEEK */}
          <div className="d-flex mb-2 text-center">
            {DAY_WEEK.map((d) => (
              <div
                key={d}
                className="flex-fill text-muted small fw-semibold font-size-12"
              >
                {d}
              </div>
            ))}

          </div>

          {/* DAYS */}
          <div className="d-flex flex-wrap text-center">
            {days.map((day, index) => {

              if (!day) {
                return (
                  <div
                    key={index}
                    style={{ width: "14.28%" }}
                  />
                );
              }

              /**
               * ===========================================
               * VALIDAÇÕES
               * ===========================================
               */
              const dateIsValid =
                isValidDate(day, month, year);

              const dayIsAvailable =
                availableDays.includes(day);

              const disabled =
                !dateIsValid ||
                !dayIsAvailable;

              const isSelected =
                selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === month &&
                selectedDate?.getFullYear() === year;

              return (
                <div
                  key={index}
                  style={{ width: "14.28%" }}
                  className="mb-1 d-flex justify-content-center"
                >

                  <button
                    disabled={disabled}
                    className={`btn fw-bold btn-sm rounded-circle border-dark tirr__calendar-time-page__calendar-item ${isSelected
                      ? "btn-primary border-0"
                      : "bg-white"
                      }`}
                    onClick={() => {
                      setSelectedDate(
                        new Date(
                          year,
                          month,
                          day
                        )
                      );
                    }}
                  >
                    {day}
                  </button>

                </div>
              );

            })}

          </div>

          {/* LOADING */}
          {daysIsLoading && (
            <div className="text-center small text-muted py-2">
              Carregando disponibilidade...
            </div>
          )}

        </div>

      </div>

      {/* HORÁRIOS */}
      {selectedDate && (
        <div className="w-100">
          <div className="mb-4">

            <div className="mb-2 w-100">
              <p className="fs-6 text-muted fw-light">
                Escolha o horário que combina com você
              </p>
            </div>

            <div className="bg-white rounded-3 py-2 p-3 " style={{minHeight: '330px'}}>
              {/* DATE */}
              <div className="d-flex align-items-center p-2">
                <h6 className="text-uppercase">
                  {selectedDate
                    ? `${selectedDate.getDate()} ${MONTHS[
                    selectedDate.getMonth()
                    ]
                    } ${selectedDate.getFullYear()
                    }`
                    : ""}
                </h6>
              </div>

              {/* PERIOD */}
              <div className="d-flex flex-inline w-100 p-1 bg-light rounded-4 gap-1 my-3">
                <button
                  disabled={!selectedDate}
                  onClick={() => {
                    setSelectedPeriod(
                      HOURS_PERIOD.PERIOD_DAY
                    );
                  }}
                  className={`btn w-50 rounded-3 border-0 d-flex gap-1 align-items-center justify-content-center text-center ${selectedPeriod ===
                    HOURS_PERIOD.PERIOD_DAY
                    ? "btn-primary"
                    : "btn-outline-primary"
                    }`}
                >
                  <SunIcon />
                  Dia
                </button>
                <button
                  disabled={!selectedDate}
                  onClick={() => {
                    setSelectedPeriod(
                      HOURS_PERIOD.PERIOD_NIGHT
                    );
                  }}
                  className={`btn w-50 rounded-3 text-dark border-0 d-flex gap-1 align-items-center justify-content-center text-center ${selectedPeriod ===
                    HOURS_PERIOD.PERIOD_NIGHT
                    ? "text-dark"
                    : "btn-outline-primary"
                    }`}
                >
                  <MoonIcon />
                  Noite
                </button>
              </div>

              {/* HOURS */}
              <div 
                className="d-grid gap-2 my-4" 
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))"}}
              >
                {filteredHours.map((h) => {
                  const isSelected =
                    hour === h;

                  return (
                    <button
                      key={h}
                      disabled={!selectedDate}
                      className={`btn border-dark ${isSelected
                        ? "btn-primary border-0"
                        : "bg-white"
                        }`}
                      onClick={() => {
                        setHour(h);
                      }}
                    >
                      {h}
                    </button>
                  );

                })}
              </div>

              {/* EMPTY */}
              {!hoursIsLoading &&
                selectedDate &&
                filteredHours.length === 0 && (
                  <div className="text-center small text-muted py-3">
                    Nenhum horário disponível.
                  </div>
                )}

              {/* LOADING */}
              {hoursIsLoading && (
                <div className="text-center small text-muted py-3">
                  Carregando horários...
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="d-flex w-100 justify-content-between gap-2">

        <button
          className="btn btn-outline-secondary btn-outline-primary w-100 p-3 font-size-17 fw-bold"
          onClick={back}
        >
          Voltar
        </button>

        <button
          className="btn btn-primary w-100 p-3 font-size-17 fw-bold"
          disabled={!selectedDate || !hour}
          onClick={handleContinue}
        >
          Próximo
        </button>

      </div>

    </div>
  );

};

export default ChoiceDataAndTimePage;