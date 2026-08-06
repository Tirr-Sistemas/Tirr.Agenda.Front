import Icon from "@/presentation/icons/Icon";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

import AsyncState from "@/presentation/components/AsyncState";
import FormField from "@/presentation/components/FormField";
import { BookingConflictError } from "@/scheduling/application/errors/BookingConflictError";
import type {
  AvailableTimeSlot,
  BookableService,
  PublicBusiness,
  ScheduledAppointment,
  ServiceProfessional,
} from "@/scheduling/application/dtos/PublicBookingDtos";
import { useApplication } from "@/presentation/hooks/useApplication";
import { formatToBRL } from "@/presentation/utils/formatToBRL";
import { phoneMask } from "@/presentation/utils/maskPhone";

/**
 * @description Etapas possíveis da jornada pública de agendamento.
 */
type Step = "service" | "professional" | "time" | "customer" | "review" | "success";
const STEPS: Step[] = ["service", "professional", "time", "customer", "review"];
const STEP_LABELS = ["Servico", "Profissional", "Horario", "Seus dados", "Revisao"];
/**
 * @description Converte uma data em chave ISO sem horário.
 *
 * @param date - Valor de date utilizado pela operação.
 * @returns Texto resultante da operação.
 */
const dateKey = (date: Date) => date.toISOString().slice(0, 10);

/**
 * @description Exibe uma descrição útil e substitui valores compostos apenas por pontuação.
 *
 * @param description - Descrição cadastrada para o serviço.
 * @param durationInMinutes - Duração usada como informação alternativa.
 * @returns Descrição legível para o cliente.
 */
const serviceDescription = (
  description: string | null,
  durationInMinutes: number,
): string => {
  const value = description?.trim();
  return value && /[\p{L}\p{N}]/u.test(value) ? value : `${durationInMinutes} minutos`;
};

/**
 * @description Jornada pública que conduz o cliente da escolha à confirmação da reserva.
 *
 * @returns Elemento React renderizado pelo componente.
 */
const PublicSchedulerPage = () => {
  const application = useApplication();
  const { businessId: routeBusinessId } = useParams();
  const businessId = routeBusinessId?.trim() ?? "";
  const [step, setStep] = useState<Step>("service");
  const [services, setServices] = useState<BookableService[]>([]);
  const [business, setBusiness] = useState<PublicBusiness | null>(null);
  const [professionals, setProfessionals] = useState<ServiceProfessional[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<AvailableTimeSlot[]>([]);
  const [service, setService] = useState<BookableService | null>(null);
  const [professional, setProfessional] = useState<ServiceProfessional | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slot, setSlot] = useState<AvailableTimeSlot | null>(null);
  const [customer, setCustomer] = useState({ fullName: "", email: "", phone: "" });
  const [result, setResult] = useState<ScheduledAppointment | null>(null);
  const [areServicesLoading, setAreServicesLoading] = useState(true);
  const [areProfessionalsLoading, setAreProfessionalsLoading] = useState(false);
  const [areDatesLoading, setAreDatesLoading] = useState(false);
  const [areSlotsLoading, setAreSlotsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentIndex = Math.max(0, STEPS.indexOf(step));
  const minDate = dateKey(new Date());
  const maxDate = dateKey(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));

  useEffect(() => {
    window.requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(".tirr__booking-stage")?.focus({ preventScroll: true }),
    );
  }, [step]);

  useEffect(() => {
    setAreServicesLoading(true);
    setError("");
    Promise.all([
      application.booking.resolveBusiness.execute({ type: "businessId", businessId }),
      application.booking.listServices.execute({ businessId }),
    ])
      .then(([businessResult, serviceResult]) => {
        setBusiness(businessResult);
        setServices(serviceResult);
      })
      .catch((caught) =>
        setError(
          caught instanceof Error ? caught.message : "Nao foi possivel carregar os servicos.",
        ),
      )
      .finally(() => setAreServicesLoading(false));
  }, [application, businessId]);

  useEffect(() => {
    if (!service) return;
    setAreProfessionalsLoading(true);
    setError("");
    application.booking.listProfessionals
      .execute({ businessId, serviceId: service.serviceId })
      .then(setProfessionals)
      .catch((caught) =>
        setError(
          caught instanceof Error ? caught.message : "Nao foi possivel carregar os profissionais.",
        ),
      )
      .finally(() => setAreProfessionalsLoading(false));
  }, [application, businessId, service]);

  useEffect(() => {
    if (!service || !professional) return;
    setAreDatesLoading(true);
    setError("");
    application.booking.listAvailableDates
      .execute({
        businessId,
        professionalId: professional.professionalId,
        serviceId: service.serviceId,
        startsOn: minDate,
        endsOn: maxDate,
      })
      .then(setAvailableDates)
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar as datas."),
      )
      .finally(() => setAreDatesLoading(false));
  }, [application, businessId, maxDate, minDate, professional, service]);

  useEffect(() => {
    if (!service || !professional || !selectedDate) return;
    setAreSlotsLoading(true);
    setError("");
    setSlot(null);
    application.booking.listAvailableTimeSlots
      .execute({
        businessId,
        professionalId: professional.professionalId,
        serviceId: service.serviceId,
        date: selectedDate,
      })
      .then(setSlots)
      .catch((caught) =>
        setError(
          caught instanceof Error ? caught.message : "Nao foi possivel carregar os horarios.",
        ),
      )
      .finally(() => setAreSlotsLoading(false));
  }, [application, businessId, professional, selectedDate, service]);

  /**
   * @description Agrupa as datas disponíveis por mês para apresentação no fluxo de agendamento.
   *
   * @returns Texto resultante da operação.
   */
  const groupedDates = useMemo(() => availableDates.slice(0, 21), [availableDates]);
  /**
   * @description Retorna à etapa anterior do agendamento e limpa estados dependentes da etapa atual.
   */
  const goBack = () => {
    const index = STEPS.indexOf(step);
    if (index > 0) setStep(STEPS[index - 1]);
  };

  /**
   * @description Valida e envia o formulário da página, sincronizando dados e mensagens de erro.
   *
   * @returns Promessa resolvida com o resultado da operação.
   */
  const submit = async () => {
    if (!service || !professional || !slot) return;
    setIsSubmitting(true);
    setError("");
    try {
      const created = await application.booking.createPublicBooking.execute({
        businessId,
        serviceId: service.serviceId,
        professionalId: professional.professionalId,
        startsAtUtc: slot.startsAtUtc,
        customerFullName: customer.fullName.trim(),
        customerEmail: customer.email.trim(),
        customerPhone: customer.phone.replace(/\D/g, ""),
      });
      setResult(created);
      setStep("success");
    } catch (caught) {
      if (caught instanceof BookingConflictError) {
        setError("Esse horario acabou de ser reservado. Escolha outro horario disponivel.");
        setStep("time");
        setSlots(
          await application.booking.listAvailableTimeSlots.execute({
            businessId,
            professionalId: professional.professionalId,
            serviceId: service.serviceId,
            date: selectedDate,
          }),
        );
      } else {
        setError(
          caught instanceof Error ? caught.message : "Nao foi possivel confirmar o agendamento.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!businessId)
    return (
      <AsyncState
        kind="error"
        title="Empresa nao informada"
        description="Use o link de agendamento fornecido pelo estabelecimento."
      />
    );

  return (
    <div className="tirr__public-booking">
      {business && (
        <div className="tirr__booking-business">
          <span className="tirr__business-mark">
            <Icon name="building" />
          </span>
          <div>
            <small>Agendamento online</small>
            <strong>{business.name}</strong>
          </div>
        </div>
      )}
      {step !== "success" && (
        <nav className="tirr__booking-steps" aria-label="Etapas do agendamento">
          <ol>
            {STEP_LABELS.map((label, index) => (
              <li
                key={label}
                aria-current={index === currentIndex ? "step" : undefined}
                className={index === currentIndex ? "active" : index < currentIndex ? "done" : ""}
              >
                <span aria-hidden="true">
                  {index < currentIndex ? <Icon name="check2" /> : index + 1}
                </span>
                <b>{label}</b>
              </li>
            ))}
          </ol>
        </nav>
      )}
      {error && (
        <div className="tirr__inline-alert" role="alert">
          <Icon name="exclamation-circle" />
          {error}
        </div>
      )}
      {step !== "service" && step !== "success" && service && (
        <aside className="tirr__booking-selection" aria-label="Resumo das escolhas">
          <div>
            <Icon name="stars" />
            <span>
              <small>Servico</small>
              <strong>{service.name}</strong>
            </span>
          </div>
          {professional && (
            <div>
              <Icon name="person-badge" />
              <span>
                <small>Profissional</small>
                <strong>{professional.displayName}</strong>
              </span>
            </div>
          )}
          {(slot || selectedDate) && (
            <div>
              <Icon name="calendar-check" />
              <span>
                <small>Quando</small>
                <strong>
                  {slot
                    ? new Date(slot.startsAtUtc).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })
                    : new Date(`${selectedDate}T12:00:00`).toLocaleDateString("pt-BR")}
                </strong>
              </span>
            </div>
          )}
        </aside>
      )}

      {step === "service" && (
        <section className="tirr__booking-stage" tabIndex={-1}>
          <header>
            <p>Etapa 1</p>
            <h1>Qual servico voce procura?</h1>
            <span>Escolha o atendimento para ver profissionais e horarios.</span>
          </header>
          {areServicesLoading ? (
            <div
              className="tirr__resource-skeleton"
              role="status"
              aria-label="Carregando servicos"
            />
          ) : services.length ? (
            <div className="tirr__choice-list">
              {services.map((item) => (
                <button
                  key={item.serviceId}
                  aria-pressed={service?.serviceId === item.serviceId}
                  className={service?.serviceId === item.serviceId ? "selected" : ""}
                  onClick={() => setService(item)}
                >
                  <Icon name="stars" />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{serviceDescription(item.description, item.durationInMinutes)}</small>
                  </span>
                  <b>{formatToBRL(item.price)}</b>
                </button>
              ))}
            </div>
          ) : (
            <AsyncState
              kind="empty"
              title="Nenhum servico disponivel"
              description="O estabelecimento ainda nao liberou atendimentos."
            />
          )}
          <footer>
            <button
              className="btn btn-primary"
              disabled={!service}
              onClick={() => setStep("professional")}
            >
              Continuar <Icon name="arrow-right" />
            </button>
          </footer>
        </section>
      )}

      {step === "professional" && (
        <section className="tirr__booking-stage" tabIndex={-1}>
          <header>
            <p>Etapa 2</p>
            <h1>Escolha quem vai atender voce</h1>
            <span>Valores e duracao podem variar por profissional.</span>
          </header>
          {areProfessionalsLoading ? (
            <div
              className="tirr__resource-skeleton"
              role="status"
              aria-label="Carregando profissionais"
            />
          ) : professionals.length ? (
            <div className="tirr__choice-list">
              {professionals.map((item) => (
                <button
                  key={item.professionalId}
                  aria-pressed={professional?.professionalId === item.professionalId}
                  className={professional?.professionalId === item.professionalId ? "selected" : ""}
                  onClick={() => setProfessional(item)}
                >
                  <Icon name="person-badge" />
                  <span>
                    <strong>{item.displayName}</strong>
                    <small>{item.durationInMinutes} minutos</small>
                  </span>
                  <b>{formatToBRL(item.price)}</b>
                </button>
              ))}
            </div>
          ) : (
            <AsyncState
              kind="empty"
              title="Nenhum profissional disponivel"
              description="Nao ha profissionais vinculados a este servico."
            />
          )}
          <footer>
            <button className="btn btn-outline-primary" onClick={goBack}>
              Voltar
            </button>
            <button
              className="btn btn-primary"
              disabled={!professional}
              onClick={() => setStep("time")}
            >
              Continuar <Icon name="arrow-right" />
            </button>
          </footer>
        </section>
      )}

      {step === "time" && (
        <section className="tirr__booking-stage" tabIndex={-1}>
          <header>
            <p>Etapa 3</p>
            <h1>Escolha data e horario</h1>
            <span>Mostramos apenas opcoes disponiveis para sua reserva.</span>
          </header>
          {areDatesLoading && !availableDates.length ? (
            <div className="tirr__resource-skeleton" role="status" aria-label="Carregando datas" />
          ) : groupedDates.length ? (
            <>
              <div className="tirr__date-strip">
                {groupedDates.map((date) => {
                  const parsed = new Date(`${date}T12:00:00`);
                  return (
                    <button
                      key={date}
                      aria-pressed={selectedDate === date}
                      className={selectedDate === date ? "selected" : ""}
                      onClick={() => setSelectedDate(date)}
                    >
                      <small>{parsed.toLocaleDateString("pt-BR", { weekday: "short" })}</small>
                      <strong>{parsed.getDate()}</strong>
                      <span>{parsed.toLocaleDateString("pt-BR", { month: "short" })}</span>
                    </button>
                  );
                })}
              </div>
              {selectedDate &&
                (areSlotsLoading ? (
                  <div
                    className="tirr__resource-skeleton compact"
                    role="status"
                    aria-label="Carregando horarios"
                  />
                ) : slots.length ? (
                  <div className="tirr__slot-list">
                    {slots.map((item) => (
                      <button
                        key={item.startsAtUtc}
                        aria-pressed={slot?.startsAtUtc === item.startsAtUtc}
                        className={slot?.startsAtUtc === item.startsAtUtc ? "selected" : ""}
                        onClick={() => setSlot(item)}
                      >
                        {new Date(item.startsAtUtc).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </button>
                    ))}
                  </div>
                ) : (
                  <AsyncState
                    kind="empty"
                    title="Sem horarios nesta data"
                    description="Escolha outra data disponivel."
                  />
                ))}
            </>
          ) : (
            <AsyncState
              kind="empty"
              title="Nenhuma data disponivel"
              description="Nao encontramos horarios livres para este profissional nos proximos 60 dias."
            />
          )}
          <footer>
            <button className="btn btn-outline-primary" onClick={goBack}>
              Voltar
            </button>
            <button
              className="btn btn-primary"
              disabled={!slot}
              onClick={() => setStep("customer")}
            >
              Continuar <Icon name="arrow-right" />
            </button>
          </footer>
        </section>
      )}

      {step === "customer" && (
        <section className="tirr__booking-stage" tabIndex={-1}>
          <header>
            <p>Etapa 4</p>
            <h1>Como podemos falar com voce?</h1>
            <span>Esses dados identificam sua reserva.</span>
          </header>
          <div className="tirr__booking-form">
            <FormField
              id="customer-name"
              label="Nome completo"
              value={customer.fullName}
              onChange={(event) => setCustomer({ ...customer, fullName: event.target.value })}
              autoComplete="name"
              required
            />
            <FormField
              id="customer-email"
              label="E-mail"
              type="email"
              value={customer.email}
              onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
              autoComplete="email"
              required
            />
            <FormField
              id="customer-phone"
              label="Telefone"
              value={customer.phone}
              onChange={(event) =>
                setCustomer({ ...customer, phone: phoneMask(event.target.value) })
              }
              autoComplete="tel"
              required
            />
          </div>
          <footer>
            <button className="btn btn-outline-primary" onClick={goBack}>
              Voltar
            </button>
            <button
              className="btn btn-primary"
              disabled={
                customer.fullName.trim().length < 3 ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
                customer.phone.replace(/\D/g, "").length < 10
              }
              onClick={() => setStep("review")}
            >
              Revisar <Icon name="arrow-right" />
            </button>
          </footer>
        </section>
      )}

      {step === "review" && service && professional && slot && (
        <section className="tirr__booking-stage" tabIndex={-1}>
          <header>
            <p>Etapa 5</p>
            <h1>Revise seu agendamento</h1>
            <span>Confira os dados antes de reservar o horario.</span>
          </header>
          <dl className="tirr__review-grid">
            <div>
              <dt>Servico</dt>
              <dd>{service.name}</dd>
            </div>
            <div>
              <dt>Profissional</dt>
              <dd>{professional.displayName}</dd>
            </div>
            <div>
              <dt>Data e horario</dt>
              <dd>
                {new Date(slot.startsAtUtc).toLocaleString("pt-BR", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </dd>
            </div>
            <div>
              <dt>Valor</dt>
              <dd>{formatToBRL(professional.price)}</dd>
            </div>
            <div>
              <dt>Cliente</dt>
              <dd>{customer.fullName}</dd>
            </div>
            <div>
              <dt>Contato</dt>
              <dd>
                {customer.email}
                <br />
                {customer.phone}
              </dd>
            </div>
          </dl>
          <footer>
            <button className="btn btn-outline-primary" onClick={goBack}>
              Voltar
            </button>
            <button
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={() => void submit()}
            >
              {isSubmitting ? "Confirmando..." : "Confirmar agendamento"}
            </button>
          </footer>
        </section>
      )}

      {step === "success" && result && service && professional && (
        <section
          className="tirr__booking-stage tirr__booking-success"
          aria-labelledby="booking-success-title"
          tabIndex={-1}
        >
          <header className="tirr__booking-success__header">
            <span className="tirr__booking-success__mark">
              <Icon name="check2" size={28} />
            </span>
            <div className="tirr__booking-success__copy">
              <p>Agendamento concluido</p>
              <h1 id="booking-success-title">Seu horario esta reservado</h1>
              <span>Confira abaixo os dados confirmados para o seu atendimento.</span>
            </div>
          </header>

          <dl className="tirr__review-grid tirr__booking-success__details">
            <div>
              <dt>Servico</dt>
              <dd>{service.name}</dd>
            </div>
            <div>
              <dt>Profissional</dt>
              <dd>{professional.displayName}</dd>
            </div>
            <div>
              <dt>Data e horario</dt>
              <dd>
                {new Date(result.startsAtUtc).toLocaleString("pt-BR", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </dd>
            </div>
            <div>
              <dt>Valor</dt>
              <dd>{formatToBRL(professional.price)}</dd>
            </div>
          </dl>

          <footer>
            <button
              className="btn btn-primary"
              onClick={() => {
                setStep("service");
                setService(null);
                setProfessional(null);
                setSelectedDate("");
                setSlot(null);
                setResult(null);
              }}
            >
              <Icon name="calendar-plus" />
              Fazer novo agendamento
            </button>
          </footer>
        </section>
      )}
    </div>
  );
};

export default PublicSchedulerPage;
