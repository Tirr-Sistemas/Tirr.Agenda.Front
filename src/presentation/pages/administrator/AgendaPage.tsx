import AgendaCalendar from "./AgendaCalendar";
import AppointmentOperations from "./AppointmentOperations";

/**
 * @description Página administrativa oficial que combina calendário e operações do agendamento.
 *
 * @returns Elemento React renderizado pelo componente.
 */
const AgendaPage = () => (
  <div className="tirr__admin__page tirr__admin__agenda-page">
    <AgendaCalendar />
    <AppointmentOperations />
  </div>
);
export default AgendaPage;
