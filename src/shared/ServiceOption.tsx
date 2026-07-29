import type { ServiceModel } from "@/model/ServiceModel";
import { formatToBRL } from "@/utils/formatToBRL";

type ServiceOptionProps = {
  service: ServiceModel;
  selected: boolean;
  onSelect: (service: ServiceModel) => void;
};

const ServiceOption = ({ service, selected, onSelect }: ServiceOptionProps) => (
  <button
    type="button"
    className={`tirr__service-option ${selected ? "is-selected" : ""}`}
    onClick={() => onSelect(service)}
    aria-pressed={selected}
  >
    <img src={service.image} alt="" />
    <span className="tirr__service-option__copy">
      <strong>{service.name}</strong>
      <small>{service.description}</small>
    </span>
    <span className="tirr__service-option__price">{formatToBRL(service.price)}</span>
    {selected && <i className="bi bi-check-circle-fill" aria-label="Servico selecionado" />}
  </button>
);

export default ServiceOption;
