import { steps } from "@/constants/steps";
import useScheduleNavigation from "@/hook/useNavigation";
import { CheckIcon } from "../icons";

/**
 * Componente de Header do fluxo de agendamento.
 *
 * Responsável por exibir o topo da interface durante o processo
 * de agendamento, incluindo navegação por etapas (stepper)
 * e indicação visual do progresso do usuário.
 *
 * Este componente normalmente permanece fixo entre as páginas
 * do fluxo (wizard), ajudando o usuário a entender em qual etapa está.
 *
 * Responsabilidades do componente:
 * - Exibir o título da etapa atual
 * - Renderizar o stepper de progresso (etapas do fluxo)
 * - Indicar visualmente o avanço do agendamento
 * - Melhorar a navegação e orientação do usuário
 */
const Header = () => {
  const { numberPage } = useScheduleNavigation();

  const pageActual = numberPage + 1;

  return (
    <div className="tirr__header shadow-sm ">
      <div className="d-flex align-items-center gap-2 h-100 px-4">
        {steps.map((step) => {
          const stepCompleted = pageActual > step.id;
          const stepActual = pageActual === step.id;
          return (
            <div key={step.id} className={`d-flex align-items-center ${stepActual ? "flex-grow-1" : ""}`}>
              <div
                className={` tirr__header__content-item rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                  stepActual || stepCompleted 
                    ? "bg-warning text-white border-0"
                    : "bg-white text-gray-light border"
                }`}
              >
                {stepCompleted ? <CheckIcon /> : step.id}
              </div>
              {stepActual && (
                <span className="ms-2 fw-semibold small text-nowrap animate-fade-in">
                  {step.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="progress" style={{ height: "4px"}}>
        <div
          className="progress-bar bg-warning" 
          style={{ width: `${(pageActual / steps.length) * 100}%`}}
        ></div>
      </div>
    </div>
  )
}

export default Header