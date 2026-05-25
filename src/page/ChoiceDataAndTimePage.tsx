import { DAY_WEEK, MONTHS } from "@/constants/calendar";
import { HOURS_PERIOD } from "@/constants/hours";

import useCalendarSchedule from "@/hook/useCalendarSchedule";

import {
  CarretLeftIcon,
  CarretRightIcon,
  MoonIcon,
  SunIcon
} from "@/shared/icons";

import { isValidDate } from "@/utils/date";

/**
 * =========================================================
 * PAGE: ChoiceDataAndTimePage
 * =========================================================
 */
const ChoiceDataAndTimePage = () => {

  /**
   * =====================================================
   * HOOK
   * =====================================================
   */
  const {
    month,
    year,

    days,

    availableDays,

    selectedDate,
    selectedPeriod,
    hour,

    filteredHours,

    daysIsLoading,
    hoursIsLoading,

    disabledButton,

    setSelectedPeriod,
    setHour,

    prevMonth,
    nextMonth,

    handleSelectDate,
    handleContinue,
    handleBack
  } = useCalendarSchedule();

  return (
    <div className="d-flex flex-column">
      <div className="container mb-6 py-5 px-3 d-flex gap-5 flex-column justify-content-center align-items-center">
        {/* CALENDÁRIO */}
        <div className="w-100">
          <div className="mb-2 w-100">
            <h6 className="fs-6 text-muted fw-light">
              Vamos encontrar o dia ideal para você
            </h6>
          </div>

          <div
            className="bg-white rounded-3 py-2"
            style={{ minHeight: "330px" }}
          >

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4 px-3">
              <h6 className="text-uppercase">
                {MONTHS[month]} {year}
              </h6>

              <div className="d-flex gap-1">

                <button
                  className="tirr__calendar-time-page_btn-date-icons"
                  disabled={disabledButton}
                  onClick={prevMonth}
                >
                  <CarretLeftIcon fill={disabledButton ? "#cccccc" : "#4A4A3D"} />
                </button>

                <button
                  className="tirr__calendar-time-page_btn-date-icons"
                  onClick={nextMonth}
                >
                  <CarretRightIcon />
                </button>

              </div>

            </div>

            {/* DAYS */}
            <div className="tirr__calendar-time-page__calendar-grid">
              {DAY_WEEK.map((d) => (
                <div
                  key={d}
                  className="flex-fill text-muted small fw-semibold font-size-12 text-center mb-2"
                >
                  {d}
                </div>
              ))}
              {days.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={index}
                    />
                  );
                }

                /**
                 * ===========================================
                 * VALIDAÇÕES
                 * ===========================================
                 */
                const dateIsValid =
                  isValidDate(day.day, month, year);

                const dayIsAvailable =
                  availableDays.includes(day.day);

                const disabled =
                  !dateIsValid ||
                  !dayIsAvailable;

                const isSelected =
                  selectedDate?.getDate() === day.day &&
                  selectedDate?.getMonth() === month &&
                  selectedDate?.getFullYear() === year;

                return (
                  <div
                    key={index}
                    className="mb-1 d-flex justify-content-center"
                  >

                    <button
                      disabled={disabled}
                      className={`btn fw-bold btn-sm rounded-circle border-dark tirr__calendar-time-page__calendar-item ${
                        isSelected
                          ? "btn-primary border-0"
                          : "bg-white"
                      } ${day.isPreview && 'opacity-25'}`}
                      onClick={() => {
                        handleSelectDate(day.day);
                      }}
                    >
                      {day.day}
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

            <div>

              <div className="mb-2 w-100">
                <p className="fs-6 text-muted fw-light">
                  Escolha o horário que combina com você
                </p>
              </div>

              <div
                className="bg-white rounded-3 py-2 p-3"
                style={{ minHeight: "330px" }}
              >

                {/* DATE */}
                <div className="d-flex align-items-center p-2">
                  <h6 className="text-uppercase">
                    {`${selectedDate.getDate()} ${
                      MONTHS[selectedDate.getMonth()]
                    } ${selectedDate.getFullYear()}`}
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
                    className={`btn w-50 border-0 d-flex gap-1 align-items-center justify-content-center text-center tirr__calendar-time-page__btn-hours ${
                      selectedPeriod ===
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
                    className={`btn w-50 text-dark border-0 d-flex gap-1 align-items-center justify-content-center text-center tirr__calendar-time-page__btn-hours ${
                      selectedPeriod ===
                      HOURS_PERIOD.PERIOD_NIGHT
                        ? "btn-primary text-dark"
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
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(70px, 1fr))"
                  }}
                >
                  {filteredHours.map((h) => {
                    const isSelected =
                      hour === h;

                    return (
                      <button
                        key={h}
                        disabled={!selectedDate}
                        className={`btn border-dark tirr__calendar-time-page__btn-hours ${
                          isSelected
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

      </div>

      {/* ACTIONS */}
      <div className="d-flex w-100 justify-content-between gap-2 fixed-bottom bg-light p-3 d-flex justify-content-end w-100 shadow-lg">
        <button
          className="btn btn-outline-primary w-100 p-3 font-size-17 fw-bold "
          onClick={handleBack}
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