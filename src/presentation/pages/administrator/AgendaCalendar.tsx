import Icon from "@/presentation/icons/Icon";
import moment from "moment/min/moment-with-locales";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Calendar,
  momentLocalizer,
  type EventProps,
  type ToolbarProps,
  type View,
} from "react-big-calendar";

import type { Appointment } from "@/administration/application/dtos";
import { AdminDrawer, AdminEmptyRow, StatusPill } from "@/presentation/components/AdminUi";
import FormField from "@/presentation/components/FormField";
import { useApplication } from "@/presentation/hooks/useApplication";
import { useAuthStore } from "@/presentation/stores/authStore";
import { formatToBRL } from "@/presentation/utils/formatToBRL";
import { phoneMask } from "@/presentation/utils/maskPhone";
import type {
  AvailableTimeSlot,
  BookableService,
  ServiceProfessional,
} from "@/scheduling/application/dtos/PublicBookingDtos";

moment.locale("pt-br");
moment.updateLocale("pt-br", { week: { dow: 1, doy: 4 } });
const localizer = momentLocalizer(moment);
const STATUS_LABEL: Record<string, string> = {
  Pending: "Pendente",
  Confirmed: "Confirmado",
  Cancelled: "Cancelado",
  Completed: "Concluido",
  NoShow: "Nao compareceu",
};
const STATUS_TONE = {
  Pending: "warning",
  Confirmed: "info",
  Cancelled: "danger",
  Completed: "success",
  NoShow: "neutral",
} as const;
/**
 * @description Converte uma data de navegação para a chave local usada pela API.
 *
 * @param date - Valor de date utilizado pela operação.
 * @returns Texto resultante da operação.
 */
const dateOnly = (date: Date) => moment(date).format("YYYY-MM-DD");
const emptyBooking = {
  serviceId: "",
  professionalId: "",
  date: "",
  startsAtUtc: "",
  fullName: "",
  email: "",
  phone: "",
};
/**
 * @description Agendamento enriquecido para o contrato do React Big Calendar.
 */
type CalendarAppointment = Appointment & {
  start: Date;
  end: Date;
  title: string;
};

/**
 * @description Barra de navegação localizada do calendário administrativo.
 *
 * @param props - Propriedades recebidas pelo componente.
 * @returns Elemento React renderizado pelo componente.
 */
const CalendarToolbar = ({ label, onNavigate }: ToolbarProps<CalendarAppointment>) => (
  <div className="tirr__calendar-toolbar">
    <div className="tirr__calendar-toolbar__navigation">
      <button
        type="button"
        onClick={() => onNavigate("PREV")}
        aria-label="Periodo anterior"
        title="Periodo anterior"
      >
        <Icon name="chevron-left" />
      </button>
      <button
        type="button"
        onClick={() => onNavigate("NEXT")}
        aria-label="Proximo periodo"
        title="Proximo periodo"
      >
        <Icon name="chevron-right" />
      </button>
    </div>
    <strong>{label}</strong>
    <button
      type="button"
      className="tirr__calendar-toolbar__today"
      onClick={() => onNavigate("TODAY")}
    >
      Hoje
    </button>
  </div>
);

/**
 * @description Agenda administrativa com filtros, calendário, detalhes e criação de reservas.
 *
 * @returns Elemento React renderizado pelo componente.
 */
const AgendaCalendar = () => {
  const application = useApplication();
  const businessId = useAuthStore((state) => state.activeBusiness?.businessId ?? "");
  const permissions = useAuthStore((state) => state.permissions);
  const [view, setView] = useState<View>(() =>
    window.matchMedia("(max-width: 767px)").matches ? "day" : "week",
  );
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [booking, setBooking] = useState(emptyBooking);
  const [services, setServices] = useState<BookableService[]>([]);
  const [professionals, setProfessionals] = useState<ServiceProfessional[]>([]);
  const [slots, setSlots] = useState<AvailableTimeSlot[]>([]);
  const [saving, setSaving] = useState(false);
  const [bookingResourcesLoading, setBookingResourcesLoading] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    /**
     * @description Adapta a visualização do calendário à largura atual da tela.
     */
    const updateView = () => setView(mobileQuery.matches ? "day" : "week");
    updateView();
    mobileQuery.addEventListener("change", updateView);
    return () => mobileQuery.removeEventListener("change", updateView);
  }, []);

  /**
   * @description Carrega os dados necessários à tela e sincroniza estados de progresso, seleção e erro.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data =
        view === "day"
          ? await application.administration.appointments.day(businessId, dateOnly(date))
          : view === "month"
            ? await application.administration.appointments.month(
                businessId,
                date.getFullYear(),
                date.getMonth() + 1,
              )
            : await application.administration.appointments.week(
                businessId,
                dateOnly(moment(date).startOf("week").toDate()),
              );
      setAppointments(data);
      setSelected(
        (current) =>
          data.find((item) => item.appointmentId === current?.appointmentId) ?? data[0] ?? null,
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar a agenda.");
    } finally {
      setLoading(false);
    }
  }, [application.administration.appointments, businessId, date, view]);
  useEffect(() => {
    void load();
  }, [load]);

  /**
   * @description Deriva a coleção visível a partir dos filtros atualmente selecionados.
   *
   * @returns Coleção resultante da operação.
   */
  const filtered = useMemo(
    () => appointments.filter((item) => !statusFilter || item.status === statusFilter),
    [appointments, statusFilter],
  );
  const visibleSelected =
    filtered.find((item) => item.appointmentId === selected?.appointmentId) ?? filtered[0] ?? null;
  /**
   * @description Converte os agendamentos filtrados em eventos compatíveis com o calendário visual.
   *
   * @returns Texto resultante da operação.
   */
  const events = useMemo<CalendarAppointment[]>(
    () =>
      filtered.map((item) => ({
        ...item,
        start: new Date(item.startsAtUtc),
        end: new Date(item.endsAtUtc),
        title: `${item.serviceName} - ${item.customerName}`,
      })),
    [filtered],
  );
  const revenue = filtered
    .filter((item) => item.status !== "Cancelled")
    .reduce((total, item) => total + item.price, 0);

  /**
   * @description Abre o formul?rio de agendamento e carrega os servi?os dispon?veis para o estabelecimento.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const openBooking = async () => {
    setDrawer(true);
    setBooking(emptyBooking);
    setServices([]);
    setProfessionals([]);
    setSlots([]);
    setBookingResourcesLoading(true);
    try {
      setServices(await application.booking.listServices.execute({ businessId }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar os servicos.");
    } finally {
      setBookingResourcesLoading(false);
    }
  };
  /**
   * @description Atualiza o servi?o selecionado e carrega os profissionais habilitados para atend?-lo.
   *
   * @param serviceId - Identificador do servi?o selecionado.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const selectService = async (serviceId: string) => {
    setBooking({ ...booking, serviceId, professionalId: "", startsAtUtc: "" });
    setProfessionals([]);
    setSlots([]);
    if (!serviceId) return;
    setBookingResourcesLoading(true);
    try {
      setProfessionals(
        await application.booking.listProfessionals.execute({
          businessId,
          serviceId,
        }),
      );
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Nao foi possivel carregar os profissionais.",
      );
    } finally {
      setBookingResourcesLoading(false);
    }
  };
  /**
   * @description Atualiza a data selecionada e consulta os hor?rios dispon?veis para a combina??o atual.
   *
   * @param value - Valor que ser? processado.
   *
   * @param professionalId - Identificador do profissional selecionado.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const selectDate = async (value: string, professionalId = booking.professionalId) => {
    setBooking((current) => ({ ...current, date: value, startsAtUtc: "" }));
    setSlots([]);
    if (!booking.serviceId || !professionalId || !value) return;
    setBookingResourcesLoading(true);
    try {
      setSlots(
        await application.booking.listAvailableTimeSlots.execute({
          businessId,
          professionalId,
          serviceId: booking.serviceId,
          date: value,
        }),
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar os horarios.");
    } finally {
      setBookingResourcesLoading(false);
    }
  };
  /**
   * @description Envia um novo agendamento com os dados normalizados e recarrega a agenda ap?s o sucesso.
   *
   * @param event - Evento disparado pela interface.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const saveBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await application.administration.appointments.create(businessId, {
        serviceId: booking.serviceId,
        professionalId: booking.professionalId,
        startsAtUtc: booking.startsAtUtc,
        customerFullName: booking.fullName.trim(),
        customerEmail: booking.email.trim(),
        customerPhone: booking.phone.replace(/\D/g, ""),
      });
      setDrawer(false);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel criar o agendamento.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="tirr__admin__stats">
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon">
            <Icon name="calendar-check" />
          </span>
          <div>
            <small>Atendimentos</small>
            <strong>{filtered.length}</strong>
          </div>
        </article>
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon">
            <Icon name="check2-circle" />
          </span>
          <div>
            <small>Confirmados</small>
            <strong>{filtered.filter((item) => item.status === "Confirmed").length}</strong>
          </div>
        </article>
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon">
            <Icon name="cash-stack" />
          </span>
          <div>
            <small>Valor previsto</small>
            <strong>{formatToBRL(revenue)}</strong>
          </div>
        </article>
      </section>
      {error && (
        <div className="tirr__inline-alert">
          <Icon name="exclamation-circle" />
          {error}
        </div>
      )}
      <div className="tirr__admin__agenda-layout">
        <section className="tirr__admin__panel tirr__admin__calendar-panel">
          <div className="tirr__admin__panel-header">
            <div>
              <p className="tirr__admin__overline">Planejamento</p>
              <h2>{moment(date).format(view === "month" ? "MMMM [de] YYYY" : "DD [de] MMMM")}</h2>
            </div>
            <div className="tirr__admin__calendar-actions">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filtrar por status"
              >
                <option value="">Todos os status</option>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <div className="tirr__admin__view-switch" aria-label="Visualizacao da agenda">
                {(["day", "week", "month"] as View[]).map((item) => (
                  <button
                    type="button"
                    key={item}
                    aria-pressed={view === item}
                    className={view === item ? "active" : ""}
                    onClick={() => setView(item)}
                  >
                    {item === "day" ? "Dia" : item === "week" ? "Semana" : "Mes"}
                  </button>
                ))}
              </div>
              {permissions.includes("appointments.post") && (
                <button className="btn btn-primary" onClick={() => void openBooking()}>
                  <Icon name="plus-lg" /> Agendar
                </button>
              )}
            </div>
          </div>
          {loading ? (
            <div className="tirr__admin__agenda-feedback" role="status">
              <span className="tirr__admin__loading-mark" />
              <p>Carregando agenda...</p>
            </div>
          ) : (
            <div
              className={`tirr__admin__calendar ${view === "day" ? "is-day-view" : "is-wide-view"}`}
            >
              <Calendar<CalendarAppointment>
                localizer={localizer}
                culture="pt-br"
                events={events}
                view={view}
                date={date}
                views={["day", "week", "month"]}
                components={{
                  toolbar: CalendarToolbar,
                  /**
                   * @description Executa a responsabilidade de event no contexto de agenda calendar.
                   *
                   * @param props - Propriedades recebidas pelo componente.
                   *
                   * @returns Elemento React renderizado pelo componente.
                   */
                  event: ({ event }: EventProps<CalendarAppointment>) => (
                    <button
                      type="button"
                      className="tirr__calendar-event"
                      aria-label={`${event.serviceName}, ${event.customerName}`}
                      onClick={() => setSelected(event)}
                    >
                      {event.title}
                    </button>
                  ),
                }}
                onView={setView}
                onNavigate={setDate}
                onSelectEvent={(event) => setSelected(event)}
                startAccessor="start"
                endAccessor="end"
                messages={{
                  today: "Hoje",
                  previous: "Anterior",
                  next: "Proximo",
                  month: "Mes",
                  week: "Semana",
                  day: "Dia",
                  agenda: "Agenda",
                  noEventsInRange: "Nenhum atendimento.",
                }}
              />
            </div>
          )}
        </section>
        <aside className="tirr__admin__agenda-sidebar">
          <section className="tirr__admin__panel">
            <div className="tirr__admin__panel-header">
              <div>
                <p className="tirr__admin__overline">Selecionado</p>
                <h2>Atendimento</h2>
              </div>
            </div>
            {visibleSelected ? (
              <div className="tirr__admin__appointment-content">
                <div className="tirr__admin__appointment-person">
                  <span>
                    {visibleSelected.customerName
                      .split(" ")
                      .map((item) => item[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <h3>{visibleSelected.customerName}</h3>
                    <p>{visibleSelected.serviceName}</p>
                  </div>
                </div>
                <StatusPill
                  tone={STATUS_TONE[visibleSelected.status]}
                  label={STATUS_LABEL[visibleSelected.status]}
                />
                <dl className="tirr__admin__appointment-meta">
                  <div>
                    <dt>Profissional</dt>
                    <dd>{visibleSelected.professionalName}</dd>
                  </div>
                  <div>
                    <dt>Inicio</dt>
                    <dd>{new Date(visibleSelected.startsAtUtc).toLocaleString("pt-BR")}</dd>
                  </div>
                  <div>
                    <dt>Categoria</dt>
                    <dd>{visibleSelected.serviceCategoryName}</dd>
                  </div>
                  <div>
                    <dt>Valor</dt>
                    <dd>{formatToBRL(visibleSelected.price)}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <AdminEmptyRow
                icon="calendar2-x"
                description={
                  statusFilter
                    ? "Altere o filtro de status ou navegue para outro periodo."
                    : "Os detalhes aparecerao quando houver um atendimento no periodo."
                }
              >
                Nenhum atendimento selecionado
              </AdminEmptyRow>
            )}
          </section>
          <section className="tirr__admin__panel">
            <div className="tirr__admin__panel-header">
              <div>
                <p className="tirr__admin__overline">Periodo</p>
                <h2>Lista de atendimentos</h2>
              </div>
            </div>
            <div className="tirr__compact-list">
              {filtered.slice(0, 8).map((item) => (
                <button
                  key={item.appointmentId}
                  className={visibleSelected?.appointmentId === item.appointmentId ? "active" : ""}
                  onClick={() => setSelected(item)}
                >
                  <time>
                    {new Date(item.startsAtUtc).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                  <span>
                    <strong>{item.customerName}</strong>
                    <small>{item.serviceName}</small>
                  </span>
                </button>
              ))}
              {!filtered.length && (
                <AdminEmptyRow
                  icon="calendar2-x"
                  description={
                    statusFilter
                      ? "Tente remover o filtro para visualizar outros status."
                      : "Novos agendamentos aparecerao aqui."
                  }
                >
                  {statusFilter
                    ? "Nenhum resultado para este filtro"
                    : "Nenhum atendimento no periodo"}
                </AdminEmptyRow>
              )}
            </div>
          </section>
        </aside>
      </div>
      <AdminDrawer
        open={drawer}
        title="Novo agendamento"
        description="Crie um horario pela equipe administrativa."
        onClose={() => setDrawer(false)}
        onSubmit={saveBooking}
        busy={saving || bookingResourcesLoading}
        submitLabel="Confirmar agendamento"
      >
        <div className="tirr__drawer-fields">
          <label className="tirr__form-field">
            <span>Servico</span>
            <select
              className="form-select"
              value={booking.serviceId}
              onChange={(event) => void selectService(event.target.value)}
              disabled={bookingResourcesLoading}
              required
            >
              <option value="">Selecione</option>
              {services.map((item) => (
                <option key={item.serviceId} value={item.serviceId}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          {bookingResourcesLoading && (
            <div
              className="tirr__resource-skeleton compact"
              role="status"
              aria-label="Carregando opcoes"
            />
          )}
          {!bookingResourcesLoading && !services.length && (
            <AdminEmptyRow
              icon="scissors"
              description="Cadastre e ative um servico no Catalogo antes de criar o agendamento."
            >
              Nenhum servico disponivel
            </AdminEmptyRow>
          )}
          <label className="tirr__form-field">
            <span>Profissional</span>
            <select
              className="form-select"
              value={booking.professionalId}
              onChange={(event) => {
                setBooking({
                  ...booking,
                  professionalId: event.target.value,
                  startsAtUtc: "",
                });
                if (booking.date) void selectDate(booking.date, event.target.value);
              }}
              disabled={!booking.serviceId || bookingResourcesLoading}
              required
            >
              <option value="">Selecione</option>
              {professionals.map((item) => (
                <option key={item.professionalId} value={item.professionalId}>
                  {item.displayName}
                </option>
              ))}
            </select>
          </label>
          {!bookingResourcesLoading && Boolean(booking.serviceId) && !professionals.length && (
            <AdminEmptyRow
              icon="person-x"
              description="Vincule um profissional ativo a este servico."
            >
              Nenhum profissional disponivel
            </AdminEmptyRow>
          )}
          <FormField
            id="booking-date"
            label="Data"
            type="date"
            value={booking.date}
            min={dateOnly(new Date())}
            onChange={(event) => void selectDate(event.target.value)}
            disabled={!booking.professionalId || bookingResourcesLoading}
            required
          />
          <label className="tirr__form-field">
            <span>Horario</span>
            <select
              className="form-select"
              value={booking.startsAtUtc}
              onChange={(event) => setBooking({ ...booking, startsAtUtc: event.target.value })}
              disabled={!booking.date || bookingResourcesLoading}
              required
            >
              <option value="">Selecione</option>
              {slots.map((item) => (
                <option key={item.startsAtUtc} value={item.startsAtUtc}>
                  {new Date(item.startsAtUtc).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </option>
              ))}
            </select>
          </label>
          {!bookingResourcesLoading &&
            Boolean(booking.date && booking.professionalId) &&
            !slots.length && (
              <AdminEmptyRow
                icon="clock"
                description="Escolha outra data ou revise a disponibilidade do profissional."
              >
                Nenhum horario disponivel
              </AdminEmptyRow>
            )}
          <FormField
            id="booking-name"
            label="Cliente"
            value={booking.fullName}
            onChange={(event) => setBooking({ ...booking, fullName: event.target.value })}
            required
          />
          <FormField
            id="booking-email"
            label="E-mail"
            type="email"
            value={booking.email}
            onChange={(event) => setBooking({ ...booking, email: event.target.value })}
            required
          />
          <FormField
            id="booking-phone"
            label="Telefone"
            value={booking.phone}
            onChange={(event) => setBooking({ ...booking, phone: phoneMask(event.target.value) })}
            required
          />
        </div>
      </AdminDrawer>
    </>
  );
};

export default AgendaCalendar;
