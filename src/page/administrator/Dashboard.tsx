import moment from "moment/min/moment-with-locales";

import { useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

const formats = {
  timeGutterFormat: "HH:mm",
  eventTimeRangeFormat: ({
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }) => `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,

  agendaTimeFormat: "HH:mm",

  agendaTimeRangeFormat: ({
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }) => `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
};

moment.locale("pt-br");

moment.updateLocale("pt-br", {
  week: {
    dow: 1,
    doy: 4,
  },
});

const localizer = momentLocalizer(moment);

const messages = {
  today: "Hoje",
  previous: "Anterior",
  next: "Próximo",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Nenhum evento neste período.",
  showMore: (total: number) => `+${total} eventos`,
};

const today = new Date();

const createTodayDate = (hour: number, minute = 0) =>
  new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hour,
    minute
  );

const events = [
  {
    id: 1,
    title: "Corte Masculino - João",
    start: createTodayDate(8, 0),
    end: createTodayDate(8, 30),
  },
  {
    id: 2,
    title: "Barba - Carlos",
    start: createTodayDate(8, 40),
    end: createTodayDate(9, 10),
  },
  {
    id: 3,
    title: "Corte + Barba - Pedro",
    start: createTodayDate(9, 20),
    end: createTodayDate(9, 50),
  },
  {
    id: 4,
    title: "Sobrancelha - Rafael",
    start: createTodayDate(10, 0),
    end: createTodayDate(10, 30),
  },
  {
    id: 5,
    title: "Corte Degradê - Marcos",
    start: createTodayDate(10, 40),
    end: createTodayDate(11, 10),
  },
  {
    id: 6,
    title: "Hidratação Capilar - Lucas",
    start: createTodayDate(11, 20),
    end: createTodayDate(11, 50),
  },
  {
    id: 7,
    title: "Corte Infantil - Miguel",
    start: createTodayDate(13, 0),
    end: createTodayDate(13, 30),
  },
  {
    id: 8,
    title: "Barba Completa - André",
    start: createTodayDate(13, 40),
    end: createTodayDate(14, 10),
  },
  {
    id: 9,
    title: "Pigmentação de Barba - Felipe",
    start: createTodayDate(14, 20),
    end: createTodayDate(14, 50),
  },
  {
    id: 10,
    title: "Corte Social - Bruno",
    start: createTodayDate(15, 0),
    end: createTodayDate(15, 30),
  },
];

const Dashboard = () => {
  const [view, setView] = useState<View>("day");
  const [date, setDate] = useState(new Date());

  const previousDay = () => {
    setDate(moment(date).subtract(1, "day").toDate());
  };

  const nextDay = () => {
    setDate(moment(date).add(1, "day").toDate());
  };

  return (
    <div className="tirr__admin__page container-fluid bg-light min-vh-100 py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button
          type="button"
          className="btn btn-light border"
          onClick={previousDay}
        >
          ←
        </button>

        <strong className="text-capitalize font-size-14">
          {date.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
          })}
        </strong>

        <button
          type="button"
          className="btn btn-light border"
          onClick={nextDay}
        >
          →
        </button>
      </div>

      <div>
        <Calendar
          toolbar={false}
          localizer={localizer}
          culture="pt-br"
          messages={messages}
          formats={formats}
          events={events}
          view={view}
          date={date}
          views={["month", "week", "day", "agenda"]}
          startAccessor="start"
          endAccessor="end"
          popup
          selectable
          onView={(v) => setView(v)}
          onNavigate={(d) => setDate(d)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
