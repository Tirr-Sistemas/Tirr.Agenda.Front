import { DAY_WEEK, MONTHS } from "@/constants/calendar";
import type { CalendarDay } from "@/hook/useCalendarSchedule";
import { isValidDate } from "@/utils/date";

import AsyncState from "./AsyncState";

type CalendarPanelProps = {
  month: number;
  year: number;
  days: (CalendarDay | null)[];
  availableDays: number[];
  selectedDate: Date | null;
  isLoading: boolean;
  hasError: boolean;
  canGoBack: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (day: number) => void;
  onRetry: () => void;
};

const CalendarPanel = ({
  month,
  year,
  days,
  availableDays,
  selectedDate,
  isLoading,
  hasError,
  canGoBack,
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
  onRetry,
}: CalendarPanelProps) => (
  <section className="tirr__scheduler-panel tirr__scheduler-calendar-panel" aria-label="Escolha uma data">
    <div className="tirr__scheduler-calendar-panel__header">
      <h2>{MONTHS[month]} {year}</h2>
      <div>
        <button type="button" className="tirr__scheduler-icon-button" disabled={!canGoBack} onClick={onPreviousMonth} aria-label="Mes anterior">
          <i className="bi bi-chevron-left" />
        </button>
        <button type="button" className="tirr__scheduler-icon-button" onClick={onNextMonth} aria-label="Proximo mes">
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </div>

    {hasError ? (
      <AsyncState kind="error" title="Nao foi possivel carregar os dias" description="Tente novamente em instantes." actionLabel="Tentar novamente" onAction={onRetry} />
    ) : (
      <div className="tirr__scheduler-calendar-grid" aria-busy={isLoading}>
        {DAY_WEEK.map((day) => <span key={day}>{day}</span>)}
        {days.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />;

          const available = !day.isPreview && isValidDate(day.day, day.month, day.year) && availableDays.includes(day.day);
          const selected =
            selectedDate?.getDate() === day.day &&
            selectedDate?.getMonth() === day.month &&
            selectedDate?.getFullYear() === day.year;

          return (
            <button
              type="button"
              key={`${day.year}-${day.month}-${day.day}-${index}`}
              disabled={!available || isLoading}
              className={`${selected ? "is-selected" : ""} ${day.isPreview ? "is-preview" : ""}`}
              onClick={() => onSelectDate(day.day)}
              aria-pressed={selected}
              aria-label={`${day.day} de ${MONTHS[day.month]}`}
            >
              {day.day}
            </button>
          );
        })}
      </div>
    )}

    {isLoading && <p className="tirr__scheduler-panel__loading" role="status">Carregando disponibilidade...</p>}
  </section>
);

export default CalendarPanel;
