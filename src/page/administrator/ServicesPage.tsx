import { formatToBRL } from "@/utils/formatToBRL";

const SERVICE_GROUPS = [
  { category: "Corte", services: [{ id: "full-hair-dye", name: "Full Hair Dye", description: "Coloring + hydration", price: 45, duration: "45 min", status: "Ativo" }, { id: "root-touch-up", name: "Root Touch-up", description: "Hydration + washing", price: 45, duration: "40 min", status: "Ativo" }, { id: "fantasy-coloring", name: "Fantasy Coloring", description: "Washing + hydration", price: 45, duration: "50 min", status: "Ativo" }] },
  { category: "Coloracao", services: [{ id: "hair-cut-basic", name: "Hair Cut Basic", description: "Cut + styling", price: 30, duration: "30 min", status: "Ativo" }, { id: "hair-cut-premium", name: "Hair Cut Premium", description: "Cut + wash + styling", price: 55, duration: "60 min", status: "Ativo" }, { id: "deep-hydration", name: "Deep Hydration", description: "Hydration treatment", price: 40, duration: "45 min", status: "Pausado" }] },
  { category: "Finalizacao", services: [{ id: "keratin-treatment", name: "Keratin Treatment", description: "Repair + smoothing", price: 120, duration: "90 min", status: "Ativo" }, { id: "scalp-detox", name: "Scalp Detox", description: "Cleaning + exfoliation", price: 35, duration: "35 min", status: "Ativo" }, { id: "blow-dry", name: "Blow Dry", description: "Washing + brushing", price: 25, duration: "30 min", status: "Ativo" }, { id: "braids-style", name: "Braids Style", description: "Styling braids", price: 60, duration: "70 min", status: "Ativo" }] },
] as const;

const ServicesPage = () => {
  const services = SERVICE_GROUPS.flatMap((group) => group.services.map((service) => ({ ...service, category: group.category })));
  const activeServices = services.filter((service) => service.status === "Ativo").length;

  return (
    <div className="tirr__admin__page">
      <section className="tirr__admin__stats" aria-label="Resumo de servicos">
        <article className="tirr__admin__stat-card"><span className="tirr__admin__stat-icon"><i className="bi bi-collection" /></span><div><small>Categorias</small><strong>{SERVICE_GROUPS.length} organizadas</strong></div></article>
        <article className="tirr__admin__stat-card"><span className="tirr__admin__stat-icon"><i className="bi bi-check2-circle" /></span><div><small>Ativos</small><strong>{activeServices} servicos</strong></div></article>
        <article className="tirr__admin__stat-card"><span className="tirr__admin__stat-icon"><i className="bi bi-cash-stack" /></span><div><small>Ticket medio</small><strong>{formatToBRL(50)}</strong></div></article>
      </section>

      <section className="tirr__admin__panel">
        <div className="tirr__admin__panel-header"><div><p className="tirr__admin__overline">Catalogo de atendimento</p><h2>Servicos disponiveis</h2></div></div>
        <div className="tirr__admin__service-grid">
          {services.map((service) => (
            <article className="tirr__admin__service-card" key={service.id}>
              <div className="tirr__admin__service-header">
                <div className="tirr__admin__service-icon"><i className="bi bi-scissors" /></div>
                <div className="tirr__admin__service-copy"><p>{service.category}</p><h3>{service.name}</h3><span>{service.description}</span></div>
                <span className={`tirr__admin__status ${service.status === "Ativo" ? "is-active" : ""}`}>{service.status}</span>
              </div>
              <div className="tirr__admin__service-footer"><span><i className="bi bi-clock" />{service.duration}</span><strong>{formatToBRL(service.price)}</strong></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
