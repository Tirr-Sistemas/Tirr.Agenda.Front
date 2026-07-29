import { HOURS_PERIOD } from "@/constants/hours";
import useCalendarSchedule from "@/hook/useCalendarSchedule";
import AsyncState from "@/shared/AsyncState";
import BookingSummary from "@/shared/BookingSummary";
import CalendarPanel from "@/shared/CalendarPanel";
import FixedActionBar from "@/shared/FixedActionBar";
import SchedulerPageHeader from "@/shared/SchedulerPageHeader";
import TimeSlot from "@/shared/TimeSlot";
import useGlobalContext from "@/store";

const ChoiceDataAndTimePage = () => {
  const { schedule } = useGlobalContext();
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
    daysHasError,
    hoursHasError,
    disabledButton,
    setSelectedPeriod,
    setHour,
    prevMonth,
    nextMonth,
    retryDays,
    retryHours,
    handleSelectDate,
    handleContinue,
    handleBack,
  } = useCalendarSchedule();

  const selectedDateLabel = selectedDate
    ? selectedDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
    : "";

  return (
    <div className="tirr__scheduler-page">
      <SchedulerPageHeader
        eyebrow="Etapa 2"
        title="Defina data e horario"
        description="Escolha um dia disponivel e depois o horario que funciona melhor para voce."
      />

      <div className="tirr__scheduler-content-grid">
        <div className="tirr__scheduler-main-content tirr__scheduler-date-time-layout">
          <CalendarPanel
            month={month}
            year={year}
            days={days}
            availableDays={availableDays}
            selectedDate={selectedDate}
            isLoading={daysIsLoading}
            hasError={daysHasError}
            canGoBack={!disabledButton}
            onPreviousMonth={prevMonth}
            onNextMonth={nextMonth}
            onSelectDate={handleSelectDate}
            onRetry={() => void retryDays()}
          />

          <section className="tirr__scheduler-panel tirr__scheduler-time-panel" aria-label="Escolha um horario">
            <div className="tirr__scheduler-time-panel__header">
              <p>Horario disponivel</p>
              <h2>{selectedDate ? selectedDateLabel : "Escolha uma data"}</h2>
            </div>

            {!selectedDate && (
              <AsyncState
                kind="empty"
                title="Primeiro, escolha uma data"
                description="Os horarios disponiveis aparecerao aqui."
              />
            )}

            {selectedDate && hoursHasError && (
              <AsyncState
                kind="error"
                title="Nao foi possivel carregar os horarios"
                description="Tente novamente em instantes."
                actionLabel="Tentar novamente"
                onAction={() => void retryHours()}
              />
            )}

            {selectedDate && !hoursHasError && (
              <>
                <div className="tirr__scheduler-period-switch" aria-label="Periodo do dia">
                  <button
                    type="button"
                    className={selectedPeriod === HOURS_PERIOD.PERIOD_DAY ? "is-selected" : ""}
                    onClick={() => setSelectedPeriod(HOURS_PERIOD.PERIOD_DAY)}
                    aria-pressed={selectedPeriod === HOURS_PERIOD.PERIOD_DAY}
                  >
                    <i className="bi bi-sun" aria-hidden="true" /> Dia
                  </button>
                  <button
                    type="button"
                    className={selectedPeriod === HOURS_PERIOD.PERIOD_NIGHT ? "is-selected" : ""}
                    onClick={() => setSelectedPeriod(HOURS_PERIOD.PERIOD_NIGHT)}
                    aria-pressed={selectedPeriod === HOURS_PERIOD.PERIOD_NIGHT}
                  >
                    <i className="bi bi-moon" aria-hidden="true" /> Noite
                  </button>
                </div>

                {hoursIsLoading && <AsyncState kind="loading" title="Carregando horarios" description="Estamos verificando a disponibilidade." />}
                {!hoursIsLoading && filteredHours.length === 0 && <AsyncState kind="empty" title="Nenhum horario neste periodo" description="Escolha outro periodo ou uma nova data." />}
                {!hoursIsLoading && filteredHours.length > 0 && (
                  <div className="tirr__time-slot-grid">
                    {filteredHours.map((value) => (
                      <TimeSlot key={value} value={value} selected={hour === value} onSelect={setHour} />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        <BookingSummary schedule={schedule} />
      </div>

      <FixedActionBar>
        <button className="btn btn-outline-primary" type="button" onClick={handleBack}>Voltar</button>
        <button className="btn btn-primary" type="button" disabled={!selectedDate || !hour} onClick={handleContinue}>
          Continuar <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>
      </FixedActionBar>
    </div>
  );
};

export default ChoiceDataAndTimePage;
