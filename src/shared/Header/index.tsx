import { steps } from "@/constants/steps";
import useScheduleNavigation from "@/hook/useNavigation";
import useGlobalContext from "@/store";

const Header = () => {
  const { numberPage } = useScheduleNavigation();
  const { schedule } = useGlobalContext();
  const pageActual = numberPage + 1;

  return (
    <header className="tirr__scheduler-topbar">
      <div className="tirr__scheduler-topbar__content">
        <div className="tirr__scheduler-topbar__brand">
          <span aria-hidden="true"><i className="bi bi-calendar2-check-fill" /></span>
          <strong>Tirr Agenda</strong>
        </div>

        <div className="tirr__scheduler-topbar__progress" aria-label={`Etapa ${pageActual} de ${steps.length}`}>
          <span className="tirr__scheduler-topbar__progress-label">Etapa {pageActual} de {steps.length}</span>
          <ol>
            {steps.map((step) => (
              <li key={step.id} className={step.id < pageActual ? "is-complete" : step.id === pageActual ? "is-current" : ""}>
                <span>{step.id < pageActual ? <i className="bi bi-check" aria-hidden="true" /> : step.id}</span>
                <small>{step.label}</small>
              </li>
            ))}
          </ol>
        </div>

        {schedule.chosenService && (
          <div className="tirr__scheduler-topbar__selection">
            <span>Servico</span>
            <strong>{schedule.chosenService.name}</strong>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
