import moment from "moment/min/moment-with-locales";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";

import { formatToBRL } from "@/utils/formatToBRL";
import { FAKE_API_CONNECTOR } from "@/service/fakeApi";

import {
  adaptAppointments,
  getClosestAppointment,
  isSameCalendarDay,
  type AdminAppointment,
} from "./agenda";

import "react-big-calendar/lib/css/react-big-calendar.css";

const formats = {
  timeGutterFormat: "HH:mm",
  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
};

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
  noEventsInRange: "Nenhum atendimento neste periodo.",
  showMore: (total: number) => `+${total} atendimentos`,
};

moment.locale("pt-br");
moment.updateLocale("pt-br", { week: { dow: 1, doy: 4 } });

const localizer = momentLocalizer(moment);

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("pt-BR", options).format(date);

const Dashboard = () => {
  const [view, setView] = useState<View>("day");
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const loadAgenda = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const [categories, rawAppointments] = await Promise.all([
        FAKE_API_CONNECTOR.getServices(),
        FAKE_API_CONNECTOR.getAppointments(),
      ]);
      const adaptedAppointments = adaptAppointments(rawAppointments, categories);
      const closestAppointment = getClosestAppointment(adaptedAppointments);

      setAppointments(adaptedAppointments);
      setSelectedAppointment(closestAppointment);

      if (closestAppointment) {
        setDate(closestAppointment.start);
      }
    } catch {
      setHasError(true);
      setAppointments([]);
      setSelectedAppointment(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAgenda();
  }, [loadAgenda]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 991px)");
    const updateViewport = () => {
      setIsCompact(media.matches);

      if (media.matches) {
        setView("day");
      }
    };

    updateViewport();
    media.addEventListener("change", updateViewport);

    return () => media.removeEventListener("change", updateViewport);
  }, []);

  const appointmentsForDate = useMemo(() => {
    if (view === "day") {
      return appointments.filter((appointment) => isSameCalendarDay(appointment.start, date));
    }

    const firstDay = moment(date).startOf("week").startOf("day");
    const lastDay = moment(date).endOf("week").endOf("day");

    return appointments.filter((appointment) =>
      moment(appointment.start).isBetween(firstDay, lastDay, undefined, "[]")
    );
  }, [appointments, date, view]);

  const nextAppointment = useMemo(
    () =>
      appointmentsForDate.find((appointment) => appointment.start.getTime() >= Date.now()) ??
      appointmentsForDate[0] ??
      null,
    [appointmentsForDate]
  );

  const scheduledValue = appointmentsForDate.reduce(
    (total, appointment) => total + appointment.servicePrice,
    0
  );
  const clientCount = new Set(appointmentsForDate.map((appointment) => appointment.clientEmail)).size;
  const upcomingAppointments = useMemo(
    () =>
      appointments
        .filter((appointment) => appointment.start.getTime() >= Date.now())
        .slice(0, 5),
    [appointments]
  );
  const visibleUpcomingAppointments = upcomingAppointments.length
    ? upcomingAppointments
    : appointments.slice(0, 5);

  const formattedDate = formatDate(date, {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  const formattedWeek = `${formatDate(moment(date).startOf("week").toDate(), { day: "2-digit", month: "short" })} a ${formatDate(moment(date).endOf("week").toDate(), { day: "2-digit", month: "short" })}`;
  const appointmentPeriodLabel = view === "week" ? "na semana" : "no dia";

  const selectAppointment = (appointment: AdminAppointment) => {
    setSelectedAppointment(appointment);
    setDate(appointment.start);
  };

  return (
    <div className="tirr__admin__page tirr__admin__agenda-page">
      <section className="tirr__admin__stats" aria-label="Resumo da agenda">
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon"><i className="bi bi-calendar-check" /></span>
          <div><small>Atendimentos</small><strong>{appointmentsForDate.length} {appointmentPeriodLabel}</strong></div>
        </article>
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon"><i className="bi bi-clock-history" /></span>
          <div><small>Proximo horario</small><strong>{nextAppointment ? formatDate(nextAppointment.start, { hour: "2-digit", minute: "2-digit" }) : "Sem horario"}</strong></div>
        </article>
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon"><i className="bi bi-people" /></span>
          <div><small>Clientes</small><strong>{clientCount} {appointmentPeriodLabel}</strong></div>
        </article>
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon"><i className="bi bi-cash-stack" /></span>
          <div><small>Valor previsto</small><strong>{formatToBRL(scheduledValue)}</strong></div>
        </article>
      </section>

      <div className="tirr__admin__agenda-layout">
        <section className="tirr__admin__panel tirr__admin__calendar-panel">
          <div className="tirr__admin__panel-header">
            <div>
              <p className="tirr__admin__overline">{view === "week" ? "Agenda semanal" : "Agenda do dia"}</p>
              <h2>{view === "week" ? formattedWeek : formattedDate}</h2>
            </div>

            <div className="tirr__admin__calendar-actions">
              {!isCompact && (
                <div className="tirr__admin__view-switch" aria-label="Visualizacao do calendario">
                  {(["day", "week"] as View[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={view === option ? "active" : ""}
                      onClick={() => setView(option)}
                      aria-pressed={view === option}
                    >
                      {option === "day" ? "Dia" : "Semana"}
                    </button>
                  ))}
                </div>
              )}

              <div className="tirr__admin__date-navigation">
                <button
                  type="button"
                  className="tirr__admin__icon-button"
                  onClick={() => setDate(moment(date).subtract(1, view === "week" ? "week" : "day").toDate())}
                  aria-label={view === "week" ? "Semana anterior" : "Dia anterior"}
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <button type="button" className="tirr__admin__today-button" onClick={() => setDate(new Date())}>Hoje</button>
                <button
                  type="button"
                  className="tirr__admin__icon-button"
                  onClick={() => setDate(moment(date).add(1, view === "week" ? "week" : "day").toDate())}
                  aria-label={view === "week" ? "Proxima semana" : "Proximo dia"}
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="tirr__admin__agenda-feedback" role="status">
              <span className="tirr__admin__loading-mark" aria-hidden="true" />
              <p>Carregando agenda...</p>
            </div>
          )}

          {hasError && !isLoading && (
            <div className="tirr__admin__agenda-feedback" role="alert">
              <span className="tirr__admin__feedback-icon"><i className="bi bi-exclamation-circle" /></span>
              <p>Nao foi possivel carregar os agendamentos.</p>
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => void loadAgenda()}>Tentar novamente</button>
            </div>
          )}

          {!isLoading && !hasError && !appointments.length && (
            <div className="tirr__admin__agenda-feedback" role="status">
              <span className="tirr__admin__feedback-icon"><i className="bi bi-calendar-x" /></span>
              <p>Nenhum agendamento encontrado.</p>
            </div>
          )}

          {!isLoading && !hasError && appointments.length > 0 && (
            <div className="tirr__admin__calendar">
              <Calendar<AdminAppointment>
                toolbar={false}
                localizer={localizer}
                culture="pt-br"
                messages={messages}
                formats={formats}
                events={appointments}
                titleAccessor={(appointment) => `${appointment.serviceName} - ${appointment.clientName}`}
                view={view}
                date={date}
                views={isCompact ? ["day"] : ["week", "day"]}
                startAccessor="start"
                endAccessor="end"
                popup
                onView={setView}
                onNavigate={setDate}
                onSelectEvent={selectAppointment}
                selected={selectedAppointment ?? undefined}
              />
            </div>
          )}
        </section>

        <aside className="tirr__admin__agenda-sidebar" aria-label="Detalhes da agenda">
          <section className="tirr__admin__panel tirr__admin__upcoming-panel">
            <div className="tirr__admin__panel-header">
              <div><p className="tirr__admin__overline">Proximos</p><h2>Atendimentos</h2></div>
            </div>

            <div className="tirr__admin__upcoming-list">
              {isLoading && <p className="tirr__admin__muted-state">Carregando atendimentos...</p>}
              {!isLoading && !hasError && !visibleUpcomingAppointments.length && <p className="tirr__admin__muted-state">Sem proximos atendimentos.</p>}
              {!isLoading && !hasError && visibleUpcomingAppointments.map((appointment) => (
                <button
                  type="button"
                  key={appointment.id}
                  className={`tirr__admin__upcoming-item ${selectedAppointment?.id === appointment.id ? "is-selected" : ""}`}
                  onClick={() => selectAppointment(appointment)}
                >
                  <time dateTime={appointment.start.toISOString()}>{formatDate(appointment.start, { hour: "2-digit", minute: "2-digit" })}</time>
                  <span><strong>{appointment.clientName}</strong><small>{appointment.serviceName}</small></span>
                  <i className="bi bi-chevron-right" aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>

          <section className="tirr__admin__panel tirr__admin__appointment-detail">
            <div className="tirr__admin__panel-header">
              <div><p className="tirr__admin__overline">Selecionado</p><h2>Detalhes do atendimento</h2></div>
            </div>

            {selectedAppointment ? (
              <div className="tirr__admin__appointment-content">
                <div className="tirr__admin__appointment-person">
                  <span>{selectedAppointment.clientName.split(" ").map((name) => name[0]).slice(0, 2).join("")}</span>
                  <div><h3>{selectedAppointment.clientName}</h3><p>{selectedAppointment.serviceName}</p></div>
                </div>
                <dl className="tirr__admin__appointment-meta">
                  <div><dt>Data</dt><dd>{formatDate(selectedAppointment.start, { day: "2-digit", month: "long", year: "numeric" })}</dd></div>
                  <div><dt>Horario</dt><dd>{formatDate(selectedAppointment.start, { hour: "2-digit", minute: "2-digit" })}</dd></div>
                  <div><dt>Categoria</dt><dd>{selectedAppointment.serviceCategory}</dd></div>
                  <div><dt>Valor</dt><dd>{formatToBRL(selectedAppointment.servicePrice)}</dd></div>
                </dl>
                <div className="tirr__admin__appointment-contact">
                  <a href={`mailto:${selectedAppointment.clientEmail}`}><i className="bi bi-envelope" aria-hidden="true" />{selectedAppointment.clientEmail}</a>
                  <a href={`tel:${selectedAppointment.clientPhone.replace(/\D/g, "")}`}><i className="bi bi-telephone" aria-hidden="true" />{selectedAppointment.clientPhone}</a>
                </div>
              </div>
            ) : (
              <p className="tirr__admin__muted-state">Selecione um atendimento para ver os detalhes.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
