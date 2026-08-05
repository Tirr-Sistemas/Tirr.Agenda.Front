import AgendaCalendar from "./AgendaCalendar";
import AppointmentOperations from "./AppointmentOperations";

/**
 * @description Página administrativa oficial que combina calendário e operações do agendamento.
 *
 * @returns Elemento React renderizado pelo componente.
 */
const AgendaPage = () => (
  <>
    <AgendaCalendar />
    <AppointmentOperations />
  </>
);
export default AgendaPage;
