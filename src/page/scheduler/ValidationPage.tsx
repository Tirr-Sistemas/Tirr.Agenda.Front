import { ScheduleRoutes } from "@/config";
import { MONTHS } from "@/constants/calendar";
import useScheduleNavigation from "@/hook/useNavigation";
import usePromise from "@/hook/usePromise";
import { CalendarIcon, MailIcon, PhoneIcon, UserIcon } from "@/shared/icons";
import useGlobalContext from "@/store";
import toScheduleUseCase, { type ToScheduleUseCaseArgs } from "@/useCases/scheduler/toScheduleUseCase";

/**
 * =========================================================
 * Página: ValidationPage
 * =========================================================
 *
 * Etapa final do fluxo de agendamento.
 *
 * Responsável por:
 * - Exibir resumo completo do agendamento
 * - Confirmar envio do agendamento
 * - Voltar para edição caso necessário
 */
const ValidationPage = () => {
  const { schedule, clearSchedule } = useGlobalContext();
  const { back, goTo } = useScheduleNavigation();

  const {
    execute: toSchedule,
    isLoading: isScheduling,
  } = usePromise(toScheduleUseCase, false);

  /**
   * =====================================================
   * HANDLE CONFIRM SCHEDULE
   * =====================================================
   */
  const handleConfirm = async () => {

    if (!schedule || isScheduling) return;

    /**
     * =====================================================
     * VALIDAÇÃO DEFENSIVA (UI LAYER)
     * =====================================================
     */
    const hasService = !!schedule.chosenService?.id;
    const hasDay = typeof schedule.chosenDay === "number" && schedule.chosenDay > 0;
    const hasMonth = typeof schedule.chosenMonth === "number" && schedule.chosenMonth > 0;
    const hasHour = typeof schedule.chosenHour === "string" && schedule.chosenHour.trim().length > 0;
    const hasName = typeof schedule.name === "string" && schedule.name.trim().length > 0;
    const hasEmail = typeof schedule.email === "string" && schedule.email.trim().length > 0;
    const hasPhone = typeof schedule.phone === "string" && schedule.phone.trim().length >= 10;
    
    if (!hasService || !hasDay || !hasMonth || !hasHour || !hasName || !hasEmail || !hasPhone) {
      alert("Preencha todos os campos corretamente antes de agendar.");
      return;
    }

    /**
     * DTO montado a partir do ScheduleModel
     */
    const data: ToScheduleUseCaseArgs = {
      chosenDay: schedule.chosenDay!,
      chosenYear: schedule.chosenYear!,
      chosenMonth: schedule.chosenMonth!,
      chosenHour: schedule.chosenHour!,
      chosenService: schedule.chosenService!,
      email: schedule.email!,
      name: schedule.name!,
      phone: schedule.phone!,
    };

    try {

      await toSchedule(data);

      clearSchedule();

      goTo(ScheduleRoutes.SERVICE);

      alert("Agendamento realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao agendar:", error);
      alert("Erro ao realizar agendamento.");
    }
  };

  if (!schedule) {
    return (
      <div className="container py-5">
        <p className="text-muted">Nenhum agendamento encontrado.</p>
      </div>
    );
  }

  return (
    <div className="container py-5 px-3 mb-6">
      {/* ================= SUMMARY ================= */}
      <div className="border-0 rounded-4 p-1 mb-4 d-flex flex-column gap-4">

        {/* DATE & TIME */}
        <div className="tirr__validaditon-page__info-container fw-light">
          <p>Dia escolhido</p>
          <div className="tirr__validaditon-page__info-item">
            <CalendarIcon />
            <div>
              <p className="fw-semibold">Data selecionada</p>
              <p className="mb-0 font-size-13">
                {schedule.chosenDay} de {schedule.chosenMonth && MONTHS[schedule.chosenMonth]} às {schedule.chosenHour}H
              </p>
            </div>
          </div>
          
        </div>

        {/* CLIENT */}
        <div className="tirr__validaditon-page__info-container fw-light">
          <p>Seus dados</p>
          <div className="tirr__validaditon-page__info-item">
            <UserIcon />
            <div>
              <p className="fw-semibold">Seu nome</p>
              <p className="mb-0 font-size-13">
                {schedule.name}
              </p>
            </div>
          </div>
          <div className="tirr__validaditon-page__info-item">
            <MailIcon />
            <div>
              <p className="fw-semibold">Seu Email</p>
              <p className="mb-0 font-size-13">
                {schedule.email}
              </p>
            </div>
          </div>
          <div className="tirr__validaditon-page__info-item">
            <PhoneIcon />
            <div>
              <p className="fw-semibold">Seu Telefone</p>
              <p className="mb-0 font-size-13">
                {schedule.phone}
              </p>
            </div>
          </div>
        </div>

        {/* SERVIÇO */}
        <div className="tirr__validaditon-page__info-container fw-light">
          <p>Serviço escolhido</p>
          <div className="tirr__validaditon-page__info-item">
            <div className="d-flex align-items-center flex-grow-1 gap-2">
              <img
                src={schedule?.chosenService?.image}
                alt={schedule?.chosenService?.name}
                className="tirr__page__img rounded-circle bg-gray-light"
              />
              <div>
                <p className="fw-semibold">{schedule?.chosenService?.name}</p>
                <p className="mb-0 font-size-13">
                  {schedule.chosenService?.description}
                </p>
              </div>
            </div>
            <p className="fw-bold text-primary">R$ {schedule?.chosenService?.price}</p>
          </div>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="d-flex justify-content-between gap-2 fixed-bottom bg-light p-3 d-flex justify-content-end w-100 shadow-lg">
        <button
          className="btn btn-outline-primary w-100 p-3 font-size-17 fw-bold"
          onClick={back}
          disabled={isScheduling}
        >
          Voltar
        </button>

        <button
          className="btn btn-primary w-100 font-size-17 fw-bold"
          onClick={handleConfirm}
          disabled={isScheduling}
        >
          {isScheduling ? "Agendando..." : "Agendar"}
        </button>

      </div>

    </div>
  );
};

export default ValidationPage;