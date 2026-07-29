import { MONTHS } from "@/constants/calendar";
import type { ScheduleModel } from "@/model/ScheduleModel";
import { formatToBRL } from "@/utils/formatToBRL";

type BookingSummaryProps = {
  schedule: Partial<ScheduleModel.Input>;
  compact?: boolean;
};

const BookingSummary = ({ schedule, compact = false }: BookingSummaryProps) => {
  const service = schedule.chosenService;

  if (!service) {
    return null;
  }

  const hasDate =
    typeof schedule.chosenDay === "number" &&
    typeof schedule.chosenMonth === "number" &&
    typeof schedule.chosenYear === "number";

  return (
    <aside className={`tirr__booking-summary ${compact ? "is-compact" : ""}`} aria-label="Resumo do agendamento">
      <p className="tirr__booking-summary__eyebrow">Seu agendamento</p>
      <div className="tirr__booking-summary__service">
        <img src={service.image} alt="" />
        <div>
          <h2>{service.name}</h2>
          <p>{service.description}</p>
        </div>
        <strong>{formatToBRL(service.price)}</strong>
      </div>
      {hasDate && (
        <div className="tirr__booking-summary__date">
          <i className="bi bi-calendar3" aria-hidden="true" />
          <span>
            {schedule.chosenDay} de {MONTHS[schedule.chosenMonth!]} de {schedule.chosenYear}
            {schedule.chosenHour ? `, ${schedule.chosenHour}` : ""}
          </span>
        </div>
      )}
    </aside>
  );
};

export default BookingSummary;
