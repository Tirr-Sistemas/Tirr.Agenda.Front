import { useState } from "react";

import { ScheduleRoutes } from "@/config";
import { MONTHS } from "@/constants/calendar";
import useScheduleNavigation from "@/hook/useNavigation";
import usePromise from "@/hook/usePromise";
import AsyncState from "@/shared/AsyncState";
import BookingSummary from "@/shared/BookingSummary";
import FixedActionBar from "@/shared/FixedActionBar";
import SchedulerPageHeader from "@/shared/SchedulerPageHeader";
import useGlobalContext from "@/store";
import toScheduleUseCase, { type ToScheduleUseCaseArgs } from "@/useCases/scheduler/toScheduleUseCase";

type SubmissionState = "idle" | "error" | "success";

const ValidationPage = () => {
  const { schedule, clearSchedule } = useGlobalContext();
  const { back, goTo } = useScheduleNavigation();
  const { execute: toSchedule, isLoading: isScheduling } = usePromise<boolean, [ToScheduleUseCaseArgs]>(toScheduleUseCase, false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");

  const hasCompleteSchedule =
    Boolean(schedule.chosenService?.id) &&
    typeof schedule.chosenDay === "number" &&
    schedule.chosenDay > 0 &&
    typeof schedule.chosenMonth === "number" &&
    schedule.chosenMonth >= 0 &&
    typeof schedule.chosenYear === "number" &&
    Boolean(schedule.chosenHour?.trim()) &&
    Boolean(schedule.name?.trim()) &&
    Boolean(schedule.email?.trim()) &&
    schedule.email !== undefined &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schedule.email) &&
    typeof schedule.phone === "string" &&
    schedule.phone.replace(/\D/g, "").length >= 10;

  const handleConfirm = async () => {
    if (isScheduling) return;

    if (!hasCompleteSchedule) {
      setSubmissionState("error");
      return;
    }

    setSubmissionState("idle");

    const confirmed = await toSchedule({
      chosenService: schedule.chosenService!,
      chosenDay: schedule.chosenDay!,
      chosenYear: schedule.chosenYear!,
      chosenMonth: schedule.chosenMonth!,
      chosenHour: schedule.chosenHour!,
      email: schedule.email!,
      name: schedule.name!,
      phone: schedule.phone!,
    });

    setSubmissionState(confirmed ? "success" : "error");
  };

  const handleNewSchedule = () => {
    clearSchedule();
    goTo(ScheduleRoutes.SERVICE);
  };

  if (submissionState === "success") {
    return (
      <div className="tirr__scheduler-page">
        <SchedulerPageHeader
          eyebrow="Agendamento concluido"
          title="Tudo certo por aqui"
          description="Seu horario foi enviado e os dados abaixo registram a sua solicitacao."
        />

        <div className="tirr__scheduler-content-grid">
          <section className="tirr__scheduler-panel tirr__scheduler-confirmation-panel">
            <AsyncState
              kind="success"
              title="Agendamento realizado"
              description="Entraremos em contato caso seja necessario confirmar algum detalhe."
            />
          </section>
          <BookingSummary schedule={schedule} />
        </div>

        <FixedActionBar>
          <button className="btn btn-primary" type="button" onClick={handleNewSchedule}>
            Novo agendamento <i className="bi bi-arrow-right" aria-hidden="true" />
          </button>
        </FixedActionBar>
      </div>
    );
  }

  return (
    <div className="tirr__scheduler-page">
      <SchedulerPageHeader
        eyebrow="Etapa 4"
        title="Revise seu agendamento"
        description="Confira os dados antes de reservar seu horario."
      />

      <div className="tirr__scheduler-content-grid">
        <section className="tirr__scheduler-panel tirr__scheduler-confirmation-panel" aria-labelledby="confirmation-title">
          <div className="tirr__scheduler-panel-heading">
            <p>Resumo</p>
            <h2 id="confirmation-title">Detalhes da reserva</h2>
          </div>

          {submissionState === "error" && (
            <AsyncState
              kind="error"
              title="Nao foi possivel concluir o agendamento"
              description={hasCompleteSchedule ? "Tente novamente em instantes." : "Revise os dados das etapas anteriores antes de confirmar."}
            />
          )}

          <dl className="tirr__scheduler-review-list">
            <div>
              <dt><i className="bi bi-calendar3" aria-hidden="true" /> Data e horario</dt>
              <dd>
                {typeof schedule.chosenDay === "number" && typeof schedule.chosenMonth === "number"
                  ? `${schedule.chosenDay} de ${MONTHS[schedule.chosenMonth]}${schedule.chosenYear ? ` de ${schedule.chosenYear}` : ""}, ${schedule.chosenHour ?? ""}`
                  : "Nao informado"}
              </dd>
            </div>
            <div>
              <dt><i className="bi bi-person" aria-hidden="true" /> Nome</dt>
              <dd>{schedule.name || "Nao informado"}</dd>
            </div>
            <div>
              <dt><i className="bi bi-envelope" aria-hidden="true" /> Email</dt>
              <dd>{schedule.email || "Nao informado"}</dd>
            </div>
            <div>
              <dt><i className="bi bi-telephone" aria-hidden="true" /> Telefone</dt>
              <dd>{schedule.phone || "Nao informado"}</dd>
            </div>
          </dl>
        </section>

        <BookingSummary schedule={schedule} />
      </div>

      <FixedActionBar>
        <button className="btn btn-outline-primary" type="button" onClick={back} disabled={isScheduling}>
          <i className="bi bi-arrow-left" aria-hidden="true" /> Voltar
        </button>
        <button className="btn btn-primary" type="button" onClick={handleConfirm} disabled={isScheduling}>
          {isScheduling ? "Confirmando..." : "Confirmar agendamento"} <i className="bi bi-check2" aria-hidden="true" />
        </button>
      </FixedActionBar>
    </div>
  );
};

export default ValidationPage;
