import { useEffect, useState } from "react";

import useScheduleNavigation from "@/hook/useNavigation";
import usePromise from "@/hook/usePromise";
import type { CategoryModel } from "@/model/CategoryModel";
import type { ServiceModel } from "@/model/ServiceModel";
import AsyncState from "@/shared/AsyncState";
import BookingSummary from "@/shared/BookingSummary";
import FixedActionBar from "@/shared/FixedActionBar";
import SchedulerPageHeader from "@/shared/SchedulerPageHeader";
import ServiceOption from "@/shared/ServiceOption";
import useGlobalContext from "@/store";
import loadServiceUseCase from "@/useCases/scheduler/loadServiceUseCase";

const EMPTY_CATEGORIES: CategoryModel[] = [];

const ChoiceServicePage = () => {
  const { schedule, updateSchedule } = useGlobalContext();
  const { next } = useScheduleNavigation();
  const {
    result: categories,
    execute: loadServices,
    isLoading,
    hasError,
  } = usePromise<CategoryModel[]>(loadServiceUseCase, EMPTY_CATEGORIES);
  const [selectedService, setSelectedService] = useState<ServiceModel | null>(schedule.chosenService ?? null);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const handleContinue = () => {
    if (!selectedService) return;

    updateSchedule({ chosenService: selectedService });
    next();
  };

  return (
    <div className="tirr__scheduler-page">
      <SchedulerPageHeader
        eyebrow="Etapa 1"
        title="Escolha seu servico"
        description="Selecione o atendimento que voce deseja agendar."
      />

      <div className="tirr__scheduler-content-grid">
        <section className="tirr__scheduler-main-content" aria-label="Servicos disponiveis">
          {isLoading && (
            <div className="tirr__service-skeletons" role="status" aria-label="Carregando servicos">
              {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
            </div>
          )}

          {hasError && !isLoading && (
            <AsyncState
              kind="error"
              title="Nao foi possivel carregar os servicos"
              description="Verifique sua conexao e tente novamente."
              actionLabel="Tentar novamente"
              onAction={() => void loadServices()}
            />
          )}

          {!isLoading && !hasError && categories.length === 0 && (
            <AsyncState
              kind="empty"
              title="Nenhum servico disponivel"
              description="Ainda nao ha atendimentos liberados para agendamento."
            />
          )}

          {!isLoading && !hasError && categories.map((category, index) => (
            <section className="tirr__scheduler-service-group" key={`${category.title}-${index}`}>
              <h2>{category.title}</h2>
              <div className="tirr__scheduler-service-grid">
                {category.services.map((service) => (
                  <ServiceOption
                    key={service.id}
                    service={service}
                    selected={selectedService?.id === service.id}
                    onSelect={setSelectedService}
                  />
                ))}
              </div>
            </section>
          ))}
        </section>

        <BookingSummary schedule={{ ...schedule, chosenService: selectedService ?? undefined }} />
      </div>

      <FixedActionBar>
        <button className="btn btn-primary" type="button" disabled={!selectedService} onClick={handleContinue}>
          Continuar <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>
      </FixedActionBar>
    </div>
  );
};

export default ChoiceServicePage;
