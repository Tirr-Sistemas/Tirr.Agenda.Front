import { type FormEvent, useCallback, useEffect, useState } from "react";

import { useAuthStore } from "@/auth/authStore";
import { AdminDrawer, AdminEmptyRow, PageFeedback } from "@/shared/AdminUi";
import FormField from "@/shared/FormField";
import { appointmentsApi } from "@/service/api";
import type { Appointment } from "@/service/api";

const AppointmentOperations = () => {
  const businessId = useAuthStore((state) => state.activeBusiness?.businessId ?? "");
  const allowed = useAuthStore((state) => state.permissions.includes("appointments.put"));
  const [items, setItems] = useState<Appointment[]>([]);
  const [appointmentId, setAppointmentId] = useState("");
  const [rescheduleAt, setRescheduleAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const result = await appointmentsApi.day(businessId, today);
      setItems(result);
      setAppointmentId((current) => result.some((item) => item.appointmentId === current) ? current : result[0]?.appointmentId ?? "");
    } catch (caught) {
      setLoadError(caught instanceof Error ? caught.message : "Nao foi possivel carregar os atendimentos do dia.");
    } finally { setLoading(false); }
  }, [businessId, today]);

  useEffect(() => { if (allowed) void load(); }, [allowed, load]);
  if (!allowed) return null;
  if (loading || loadError) return <section className="tirr__admin__panel tirr__appointment-actions"><PageFeedback loading={loading} error={loadError} onRetry={() => void load()} /></section>;
  if (!items.length) return <section className="tirr__admin__panel tirr__appointment-actions"><div><p className="tirr__admin__overline">Acoes do dia</p><h2>Gerenciar atendimento</h2></div><AdminEmptyRow icon="bi-calendar2-x" description="Quando houver atendimentos hoje, as acoes de status e reagendamento ficarao disponiveis aqui.">Nenhum atendimento para gerenciar</AdminEmptyRow></section>;

  const changeStatus = async (status: Appointment["status"], reason?: string) => {
    if (!appointmentId) return;
    setBusy(true);
    setMessage("");
    try {
      await appointmentsApi.updateStatus(businessId, appointmentId, status, reason ?? undefined);
      await load();
      setMessage("Status atualizado.");
      if (status === "Cancelled") { setCancelOpen(false); setCancelReason(""); }
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Nao foi possivel atualizar.");
    } finally { setBusy(false); }
  };

  const cancel = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cancelReason.trim()) void changeStatus("Cancelled", cancelReason.trim());
  };

  const reschedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await appointmentsApi.reschedule(businessId, appointmentId, new Date(rescheduleAt).toISOString());
      setRescheduleAt("");
      await load();
      setMessage("Atendimento reagendado.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Nao foi possivel reagendar.");
    } finally { setBusy(false); }
  };

  return <section className="tirr__admin__panel tirr__appointment-actions">
    <div><p className="tirr__admin__overline">Acoes do dia</p><h2>Gerenciar atendimento</h2></div>
    {message && <div className="tirr__inline-alert" role="status">{message}</div>}
    <label className="tirr__form-field"><span>Atendimento</span><select className="form-select" value={appointmentId} onChange={(event) => setAppointmentId(event.target.value)}>{items.map((item) => <option key={item.appointmentId} value={item.appointmentId}>{new Date(item.startsAtUtc).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} - {item.customerName} - {item.serviceName}</option>)}</select></label>
    <div className="tirr__appointment-status-actions"><button className="btn btn-outline-secondary btn-sm" disabled={busy} onClick={() => void changeStatus("Confirmed")}>Confirmar</button><button className="btn btn-outline-secondary btn-sm" disabled={busy} onClick={() => void changeStatus("Completed")}>Concluir</button><button className="btn btn-outline-secondary btn-sm" disabled={busy} onClick={() => void changeStatus("NoShow")}>Nao compareceu</button><button className="btn btn-outline-danger btn-sm" disabled={busy} onClick={() => setCancelOpen(true)}>Cancelar</button></div>
    <form onSubmit={reschedule}><label className="tirr__form-field"><span>Novo inicio</span><input className="form-control" type="datetime-local" value={rescheduleAt} onChange={(event) => setRescheduleAt(event.target.value)} required /></label><button className="btn btn-primary btn-sm" disabled={busy}>Reagendar</button></form>
    <AdminDrawer open={cancelOpen} title="Cancelar atendimento" description="Informe o motivo para manter o historico do cliente." onClose={() => setCancelOpen(false)} onSubmit={cancel} busy={busy} submitLabel="Confirmar cancelamento"><FormField id="cancel-reason" label="Motivo" value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} required /></AdminDrawer>
  </section>;
};

export default AppointmentOperations;
