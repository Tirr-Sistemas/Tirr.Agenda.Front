import useScheduleNavigation from "@/hook/useNavigation";
import usePromise from "@/hook/usePromise";
import type { CategoryModel } from "@/model/CategoryModel";
import type { ServiceModel } from "@/model/ServiceModel";
import useGlobalContext from "@/store";
import loadServiceUseCase from "@/useCases/loadServiceUseCase";
import { useEffect, useState } from "react";

/**
 * =========================================================
 * PAGE: ChoiceServicePage
 * =========================================================
 * @description
 * Página responsável por permitir ao usuário selecionar
 * o serviço que deseja agendar.
 *
 * Esta é uma etapa inicial do fluxo de agendamento.
 *
 * Responsabilidades:
 * - Listar serviços disponíveis
 * - Exibir informações básicas (nome, descrição, preço, imagem)
 * - Permitir seleção de um serviço
 * - Persistir seleção no store global
 * - Avançar para próxima etapa do fluxo
 */
const ChoiceServicePage = () => {
  const { schedule, updateSchedule } = useGlobalContext();
  const { next } = useScheduleNavigation();

  const {
    result: categories,
    execute: loadServices,
    isLoading: serviceIsLoading,
  } = usePromise<CategoryModel[]>(loadServiceUseCase, []);
  
  const [selectedService, setSelectedService] =
    useState<ServiceModel | null>(schedule.chosenService || null);

  /**
   * Carrega serviços ao montar a página
   */
  useEffect(() => {
    loadServices();
  }, []);

  /**
   * Seleciona um serviço
   */
  const handleSelectService = (service: ServiceModel) => {
    setSelectedService(service);
  };

  /**
   * Confirma seleção e avança no fluxo
   */
  const handleContinue = () => {
    if (!selectedService) return;

    updateSchedule({chosenService:selectedService})

    next();
  };

  return (
    <div className="py-5 px-3 d-flex flex-column mb-6">
      <div>
        {/* LOADING */}
        {serviceIsLoading && (
          <div className="alert alert-info">Carregando serviços...</div>
        )}

        {/* LISTA DE SERVIÇOS */}
        {categories?.map((category) => (
          <div key={category.title} className="mb-4">
            
            {/* TÍTULO DA CATEGORIA */}
            <h6 className="text-muted mb-2 fw-light">{category.title}</h6>

            <div className="row g-2">
              {category.services?.map((service) => {
                const isSelected = selectedService?.id === service.id;

                return (
                  <div className="col-12 col-md-6 col-lg-4" key={service.id}>
                    <div
                      onClick={() => handleSelectService(service)}
                      className={`bg-white rounded-4 d-flex flex-inline align-items-center text-center justify-content-between p-3 h-100 cursor-pointer transition ${
                        isSelected ? "border-primary shadow-sm tirr__page__btn-outline-border" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center flex-grow-1 gap-2">
                        {/* IMAGEM */}
                        <img
                          src={service.image}
                          alt={service.name}
                          className="tirr__page__img rounded-circle"
                        />
                        
                        <div className="d-flex flex-column align-items-start text-start gap-1">
                          <h5 className="fw-bold font-size-17">{service.name}</h5>
                          <p className="text-muted font-size-13 fw-light">{service.description}</p>
                        </div>
                      </div>
                      
                      {/* INFO */}
                      <div className="fw-bold text-primary">
                        R$ {service.price}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER ACTION */}
      <div className="mt-4 d-flex justify-content-end w-100 fixed-bottom bg-light p-3 d-flex justify-content-end w-100 shadow-lg">
        <button
          className="btn btn-primary w-100 p-3 font-size-17 fw-bold"
          disabled={!selectedService}
          onClick={handleContinue}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default ChoiceServicePage;