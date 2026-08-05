import moment from "moment/min/moment-with-locales";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer, type EventProps, type ToolbarProps, type View } from "react-big-calendar";

import { useAuthStore } from "@/auth/authStore";
import { AdminDrawer, AdminEmptyRow, StatusPill } from "@/shared/AdminUi";
import FormField from "@/shared/FormField";
import { appointmentsApi, publicSchedulingApi } from "@/service/api";
import type { Appointment, AvailableTimeSlot, BookableService, ServiceProfessional } from "@/service/api";
import { formatToBRL } from "@/utils/formatToBRL";
import { phoneMask } from "@/utils/maskPhone";

moment.locale("pt-br");
moment.updateLocale("pt-br", { week: { dow: 1, doy: 4 } });
const localizer = momentLocalizer(moment);
const STATUS_LABEL: Record<string, string> = { Pending: "Pendente", Confirmed: "Confirmado", Cancelled: "Cancelado", Completed: "Concluido", NoShow: "Nao compareceu" };
const STATUS_TONE = { Pending: "warning", Confirmed: "info", Cancelled: "danger", Completed: "success", NoShow: "neutral" } as const;
const dateOnly = (date: Date) => moment(date).format("YYYY-MM-DD");
const emptyBooking = { serviceId: "", professionalId: "", date: "", startsAtUtc: "", fullName: "", email: "", phone: "" };
type CalendarAppointment = Appointment & { start: Date; end: Date; title: string };

const CalendarToolbar = ({ label, onNavigate }: ToolbarProps<CalendarAppointment>) => <div className="tirr__calendar-toolbar">
  <div className="tirr__calendar-toolbar__navigation">
    <button type="button" onClick={() => onNavigate("PREV")} aria-label="Periodo anterior" title="Periodo anterior"><i className="bi bi-chevron-left" /></button>
    <button type="button" onClick={() => onNavigate("NEXT")} aria-label="Proximo periodo" title="Proximo periodo"><i className="bi bi-chevron-right" /></button>
  </div>
  <strong>{label}</strong>
  <button type="button" className="tirr__calendar-toolbar__today" onClick={() => onNavigate("TODAY")}>Hoje</button>
</div>;

const AgendaPage = () => {
  const businessId = useAuthStore((state) => state.activeBusiness?.businessId ?? "");
  const permissions = useAuthStore((state) => state.permissions);
  const [view, setView] = useState<View>(() => window.matchMedia("(max-width: 767px)").matches ? "day" : "week");
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
    const updateView = () => setView(mobileQuery.matches ? "day" : "week");
    updateView();
    mobileQuery.addEventListener("change", updateView);
    return () => mobileQuery.removeEventListener("change", updateView);
  }, []);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = view === "day"
        ? await appointmentsApi.day(businessId, dateOnly(date))
        : view === "month"
          ? await appointmentsApi.month(businessId, date.getFullYear(), date.getMonth() + 1)
          : await appointmentsApi.week(businessId, dateOnly(moment(date).startOf("week").toDate()));
      setAppointments(data);
      setSelected((current) => data.find((item) => item.appointmentId === current?.appointmentId) ?? data[0] ?? null);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar a agenda."); }
    finally { setLoading(false); }
  }, [businessId, date, view]);
  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => appointments.filter((item) => !statusFilter || item.status === statusFilter), [appointments, statusFilter]);
  const visibleSelected = filtered.find((item) => item.appointmentId === selected?.appointmentId) ?? filtered[0] ?? null;
  const events = useMemo<CalendarAppointment[]>(() => filtered.map((item) => ({ ...item, start: new Date(item.startsAtUtc), end: new Date(item.endsAtUtc), title: `${item.serviceName} - ${item.customerName}` })), [filtered]);
  const revenue = filtered.filter((item) => item.status !== "Cancelled").reduce((total, item) => total + item.price, 0);

  const openBooking = async () => { setDrawer(true); setBooking(emptyBooking); setServices([]); setProfessionals([]); setSlots([]); setBookingResourcesLoading(true); try { setServices(await publicSchedulingApi.services(businessId)); } catch (caught) { setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar os servicos."); } finally { setBookingResourcesLoading(false); } };
  const selectService = async (serviceId: string) => { setBooking({ ...booking, serviceId, professionalId: "", startsAtUtc: "" }); setProfessionals([]); setSlots([]); if (!serviceId) return; setBookingResourcesLoading(true); try { setProfessionals(await publicSchedulingApi.professionals(businessId, serviceId)); } catch (caught) { setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar os profissionais."); } finally { setBookingResourcesLoading(false); } };
  const selectDate = async (value: string, professionalId = booking.professionalId) => { setBooking((current) => ({ ...current, date: value, startsAtUtc: "" })); setSlots([]); if (!booking.serviceId || !professionalId || !value) return; setBookingResourcesLoading(true); try { setSlots(await publicSchedulingApi.availableSlots(businessId, professionalId, booking.serviceId, value)); } catch (caught) { setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar os horarios."); } finally { setBookingResourcesLoading(false); } };
  const saveBooking = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaving(true); setError(""); try { await appointmentsApi.create(businessId, { serviceId: booking.serviceId, professionalId: booking.professionalId, startsAtUtc: booking.startsAtUtc, customerFullName: booking.fullName.trim(), customerEmail: booking.email.trim(), customerPhone: booking.phone.replace(/\D/g, "") }); setDrawer(false); await load(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Nao foi possivel criar o agendamento."); } finally { setSaving(false); } };

  return <div className="tirr__admin__page tirr__admin__agenda-page"><section className="tirr__admin__stats"><article className="tirr__admin__stat-card"><span className="tirr__admin__stat-icon"><i className="bi bi-calendar-check" /></span><div><small>Atendimentos</small><strong>{filtered.length}</strong></div></article><article className="tirr__admin__stat-card"><span className="tirr__admin__stat-icon"><i className="bi bi-check2-circle" /></span><div><small>Confirmados</small><strong>{filtered.filter((item) => item.status === "Confirmed").length}</strong></div></article><article className="tirr__admin__stat-card"><span className="tirr__admin__stat-icon"><i className="bi bi-cash-stack" /></span><div><small>Valor previsto</small><strong>{formatToBRL(revenue)}</strong></div></article></section>
    {error && <div className="tirr__inline-alert"><i className="bi bi-exclamation-circle" />{error}</div>}
    <div className="tirr__admin__agenda-layout"><section className="tirr__admin__panel tirr__admin__calendar-panel"><div className="tirr__admin__panel-header"><div><p className="tirr__admin__overline">Planejamento</p><h2>{moment(date).format(view === "month" ? "MMMM [de] YYYY" : "DD [de] MMMM")}</h2></div><div className="tirr__admin__calendar-actions"><select className="form-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filtrar por status"><option value="">Todos os status</option>{Object.entries(STATUS_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><div className="tirr__admin__view-switch" aria-label="Visualizacao da agenda">{(["day", "week", "month"] as View[]).map((item) => <button type="button" key={item} aria-pressed={view === item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item === "day" ? "Dia" : item === "week" ? "Semana" : "Mes"}</button>)}</div>{permissions.includes("appointments.post") && <button className="btn btn-primary" onClick={() => void openBooking()}><i className="bi bi-plus-lg" /> Agendar</button>}</div></div>{loading ? <div className="tirr__admin__agenda-feedback" role="status"><span className="tirr__admin__loading-mark" /><p>Carregando agenda...</p></div> : <div className={`tirr__admin__calendar ${view === "day" ? "is-day-view" : "is-wide-view"}`}><Calendar<CalendarAppointment> localizer={localizer} culture="pt-br" events={events} view={view} date={date} views={["day", "week", "month"]} components={{ toolbar: CalendarToolbar, event: ({ event }: EventProps<CalendarAppointment>) => <button type="button" className="tirr__calendar-event" aria-label={`${event.serviceName}, ${event.customerName}`} onClick={() => setSelected(event)}>{event.title}</button> }} onView={setView} onNavigate={setDate} onSelectEvent={(event) => setSelected(event)} startAccessor="start" endAccessor="end" messages={{ today: "Hoje", previous: "Anterior", next: "Proximo", month: "Mes", week: "Semana", day: "Dia", agenda: "Agenda", noEventsInRange: "Nenhum atendimento." }} /></div>}</section>
      <aside className="tirr__admin__agenda-sidebar"><section className="tirr__admin__panel"><div className="tirr__admin__panel-header"><div><p className="tirr__admin__overline">Selecionado</p><h2>Atendimento</h2></div></div>{visibleSelected ? <div className="tirr__admin__appointment-content"><div className="tirr__admin__appointment-person"><span>{visibleSelected.customerName.split(" ").map((item) => item[0]).slice(0, 2).join("")}</span><div><h3>{visibleSelected.customerName}</h3><p>{visibleSelected.serviceName}</p></div></div><StatusPill tone={STATUS_TONE[visibleSelected.status]} label={STATUS_LABEL[visibleSelected.status]} /><dl className="tirr__admin__appointment-meta"><div><dt>Profissional</dt><dd>{visibleSelected.professionalName}</dd></div><div><dt>Inicio</dt><dd>{new Date(visibleSelected.startsAtUtc).toLocaleString("pt-BR")}</dd></div><div><dt>Categoria</dt><dd>{visibleSelected.serviceCategoryName}</dd></div><div><dt>Valor</dt><dd>{formatToBRL(visibleSelected.price)}</dd></div></dl></div> : <AdminEmptyRow icon="bi-calendar2-x" description={statusFilter ? "Altere o filtro de status ou navegue para outro periodo." : "Os detalhes aparecerao quando houver um atendimento no periodo."}>Nenhum atendimento selecionado</AdminEmptyRow>}</section><section className="tirr__admin__panel"><div className="tirr__admin__panel-header"><div><p className="tirr__admin__overline">Periodo</p><h2>Lista de atendimentos</h2></div></div><div className="tirr__compact-list">{filtered.slice(0, 8).map((item) => <button key={item.appointmentId} className={visibleSelected?.appointmentId === item.appointmentId ? "active" : ""} onClick={() => setSelected(item)}><time>{new Date(item.startsAtUtc).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</time><span><strong>{item.customerName}</strong><small>{item.serviceName}</small></span></button>)}{!filtered.length && <AdminEmptyRow icon="bi-calendar2-x" description={statusFilter ? "Tente remover o filtro para visualizar outros status." : "Novos agendamentos aparecerao aqui."}>{statusFilter ? "Nenhum resultado para este filtro" : "Nenhum atendimento no periodo"}</AdminEmptyRow>}</div></section></aside></div>
    <AdminDrawer open={drawer} title="Novo agendamento" description="Crie um horario pela equipe administrativa." onClose={() => setDrawer(false)} onSubmit={saveBooking} busy={saving || bookingResourcesLoading} submitLabel="Confirmar agendamento"><div className="tirr__drawer-fields"><label className="tirr__form-field"><span>Servico</span><select className="form-select" value={booking.serviceId} onChange={(event) => void selectService(event.target.value)} disabled={bookingResourcesLoading} required><option value="">Selecione</option>{services.map((item) => <option key={item.serviceId} value={item.serviceId}>{item.name}</option>)}</select></label>{bookingResourcesLoading && <div className="tirr__resource-skeleton compact" role="status" aria-label="Carregando opcoes" />}{!bookingResourcesLoading && !services.length && <AdminEmptyRow icon="bi-scissors" description="Cadastre e ative um servico no Catalogo antes de criar o agendamento.">Nenhum servico disponivel</AdminEmptyRow>}<label className="tirr__form-field"><span>Profissional</span><select className="form-select" value={booking.professionalId} onChange={(event) => { setBooking({ ...booking, professionalId: event.target.value, startsAtUtc: "" }); if (booking.date) void selectDate(booking.date, event.target.value); }} disabled={!booking.serviceId || bookingResourcesLoading} required><option value="">Selecione</option>{professionals.map((item) => <option key={item.professionalId} value={item.professionalId}>{item.displayName}</option>)}</select></label>{!bookingResourcesLoading && Boolean(booking.serviceId) && !professionals.length && <AdminEmptyRow icon="bi-person-x" description="Vincule um profissional ativo a este servico.">Nenhum profissional disponivel</AdminEmptyRow>}<FormField id="booking-date" label="Data" type="date" value={booking.date} min={dateOnly(new Date())} onChange={(event) => void selectDate(event.target.value)} disabled={!booking.professionalId || bookingResourcesLoading} required /><label className="tirr__form-field"><span>Horario</span><select className="form-select" value={booking.startsAtUtc} onChange={(event) => setBooking({ ...booking, startsAtUtc: event.target.value })} disabled={!booking.date || bookingResourcesLoading} required><option value="">Selecione</option>{slots.map((item) => <option key={item.startsAtUtc} value={item.startsAtUtc}>{new Date(item.startsAtUtc).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</option>)}</select></label>{!bookingResourcesLoading && Boolean(booking.date && booking.professionalId) && !slots.length && <AdminEmptyRow icon="bi-clock" description="Escolha outra data ou revise a disponibilidade do profissional.">Nenhum horario disponivel</AdminEmptyRow>}<FormField id="booking-name" label="Cliente" value={booking.fullName} onChange={(event) => setBooking({ ...booking, fullName: event.target.value })} required /><FormField id="booking-email" label="E-mail" type="email" value={booking.email} onChange={(event) => setBooking({ ...booking, email: event.target.value })} required /><FormField id="booking-phone" label="Telefone" value={booking.phone} onChange={(event) => setBooking({ ...booking, phone: phoneMask(event.target.value) })} required /></div></AdminDrawer>
  </div>;
};

export default AgendaPage;
