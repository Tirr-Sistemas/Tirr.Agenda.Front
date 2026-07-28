import moment from "moment/min/moment-with-locales";
import { useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

const formats = {
  timeGutterFormat: "HH:mm",
  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
};

moment.locale("pt-br");
moment.updateLocale("pt-br", { week: { dow: 1, doy: 4 } });

const localizer = momentLocalizer(moment);
const messages = {
  today: "Hoje",
  previous: "Anterior",
  next: "Proximo",
  month: "Mes",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Nenhum evento neste periodo.",
  showMore: (total: number) => `+${total} eventos`,
};

const today = new Date();
const createTodayDate = (hour: number, minute = 0) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute);

const events = [
  { id: 1, title: "Corte Masculino - Joao", start: createTodayDate(8), end: createTodayDate(8, 30) },
  { id: 2, title: "Barba - Carlos", start: createTodayDate(8, 40), end: createTodayDate(9, 10) },
  { id: 3, title: "Corte + Barba - Pedro", start: createTodayDate(9, 20), end: createTodayDate(9, 50) },
  { id: 4, title: "Sobrancelha - Rafael", start: createTodayDate(10), end: createTodayDate(10, 30) },
  { id: 5, title: "Corte Degrade - Marcos", start: createTodayDate(10, 40), end: createTodayDate(11, 10) },
  { id: 6, title: "Hidratacao Capilar - Lucas", start: createTodayDate(11, 20), end: createTodayDate(11, 50) },
  { id: 7, title: "Corte Infantil - Miguel", start: createTodayDate(13), end: createTodayDate(13, 30) },
  { id: 8, title: "Barba Completa - Andre", start: createTodayDate(13, 40), end: createTodayDate(14, 10) },
];

const Dashboard = () => {
  const [view, setView] = useState<View>("day");
  const [date, setDate] = useState(new Date());
  const formattedDate = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="tirr__admin__page">
      <section className="tirr__admin__stats" aria-label="Resumo da agenda">
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon"><i className="bi bi-calendar-check" /></span>
          <div><small>Hoje</small><strong>{events.length} atendimentos</strong></div>
        </article>
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon"><i className="bi bi-clock-history" /></span>
          <div><small>Proximo horario</small><strong>08:00</strong></div>
        </article>
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon"><i className="bi bi-person-check" /></span>
          <div><small>Confirmados</small><strong>8 clientes</strong></div>
        </article>
      </section>

      <section className="tirr__admin__panel tirr__admin__calendar-panel">
        <div className="tirr__admin__panel-header">
          <div>
            <p className="tirr__admin__overline">Agenda do dia</p>
            <h2>{formattedDate}</h2>
          </div>
          <div className="tirr__admin__view-switch" aria-label="Visualizacao do calendario">
            {(["day", "week"] as View[]).map((option) => (
              <button key={option} type="button" className={view === option ? "active" : ""} onClick={() => setView(option)}>
                {option === "day" ? "Dia" : "Semana"}
              </button>
            ))}
          </div>
        </div>

        <div className="tirr__admin__date-navigation">
          <button type="button" className="tirr__admin__icon-button" onClick={() => setDate(moment(date).subtract(1, "day").toDate())} aria-label="Dia anterior">
            <i className="bi bi-chevron-left" />
          </button>
          <button type="button" className="tirr__admin__today-button" onClick={() => setDate(new Date())}>Hoje</button>
          <button type="button" className="tirr__admin__icon-button" onClick={() => setDate(moment(date).add(1, "day").toDate())} aria-label="Proximo dia">
            <i className="bi bi-chevron-right" />
          </button>
        </div>

        <div className="tirr__admin__calendar">
          <Calendar
            toolbar={false}
            localizer={localizer}
            culture="pt-br"
            messages={messages}
            formats={formats}
            events={events}
            view={view}
            date={date}
            views={["week", "day"]}
            startAccessor="start"
            endAccessor="end"
            popup
            onView={setView}
            onNavigate={setDate}
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
