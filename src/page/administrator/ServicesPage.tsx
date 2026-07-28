import { formatToBRL } from "@/utils/formatToBRL";

const SERVICE_GROUPS = [
  {
    category: "Corte",
    services: [
      {
        id: "full-hair-dye",
        name: "Full Hair Dye",
        description: "Coloring + hydration",
        price: 45,
        duration: "45 min",
        status: "Ativo",
      },
      {
        id: "root-touch-up",
        name: "Root Touch-up",
        description: "Hydration + washing",
        price: 45,
        duration: "40 min",
        status: "Ativo",
      },
      {
        id: "fantasy-coloring",
        name: "Fantasy Coloring",
        description: "Washing + hydration",
        price: 45,
        duration: "50 min",
        status: "Ativo",
      },
    ],
  },
  {
    category: "Coloracao",
    services: [
      {
        id: "hair-cut-basic",
        name: "Hair Cut Basic",
        description: "Cut + styling",
        price: 30,
        duration: "30 min",
        status: "Ativo",
      },
      {
        id: "hair-cut-premium",
        name: "Hair Cut Premium",
        description: "Cut + wash + styling",
        price: 55,
        duration: "60 min",
        status: "Ativo",
      },
      {
        id: "deep-hydration",
        name: "Deep Hydration",
        description: "Hydration treatment",
        price: 40,
        duration: "45 min",
        status: "Pausado",
      },
    ],
  },
  {
    category: "Finalizacao",
    services: [
      {
        id: "keratin-treatment",
        name: "Keratin Treatment",
        description: "Repair + smoothing",
        price: 120,
        duration: "90 min",
        status: "Ativo",
      },
      {
        id: "scalp-detox",
        name: "Scalp Detox",
        description: "Cleaning + exfoliation",
        price: 35,
        duration: "35 min",
        status: "Ativo",
      },
      {
        id: "blow-dry",
        name: "Blow Dry",
        description: "Washing + brushing",
        price: 25,
        duration: "30 min",
        status: "Ativo",
      },
      {
        id: "braids-style",
        name: "Braids Style",
        description: "Styling braids",
        price: 60,
        duration: "70 min",
        status: "Ativo",
      },
    ],
  },
] as const;

const ServicesPage = () => {
  const totalServices = SERVICE_GROUPS.reduce(
    (total, group) => total + group.services.length,
    0
  );

  const activeServices = SERVICE_GROUPS.reduce(
    (total, group) =>
      total + group.services.filter((service) => service.status === "Ativo").length,
    0
  );

  return (
    <div className="tirr__admin__page container-fluid bg-light min-vh-100 py-3">
      <div className="row g-2 mb-3">
        <div className="col-6">
          <div className="bg-white rounded-4 p-3 shadow-sm">
            <p className="text-muted font-size-13">Categorias</p>
            <strong className="font-size-24">{SERVICE_GROUPS.length}</strong>
          </div>
        </div>

        <div className="col-6">
          <div className="bg-white rounded-4 p-3 shadow-sm">
            <p className="text-muted font-size-13">Servicos ativos</p>
            <strong className="font-size-24">
              {activeServices}/{totalServices}
            </strong>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        {SERVICE_GROUPS.map((group) => (
          <section key={group.category} className="bg-white rounded-4 p-3 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="font-size-16 fw-bold">{group.category}</h2>
              <span className="text-muted font-size-13">
                {group.services.length} servicos
              </span>
            </div>

            <div className="d-flex flex-column gap-2">
              {group.services.map((service) => (
                <article
                  key={service.id}
                  className="border rounded-3 p-3 d-flex flex-column gap-2"
                >
                  <div className="d-flex align-items-start justify-content-between gap-2">
                    <div>
                      <h3 className="font-size-16 fw-bold">{service.name}</h3>
                      <p className="text-muted font-size-13">
                        {service.description}
                      </p>
                    </div>

                    <span
                      className={`badge ${
                        service.status === "Ativo"
                          ? "bg-primary"
                          : "bg-light text-dark border"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between font-size-13">
                    <span className="text-muted">{service.duration}</span>
                    <strong className="text-primary">
                      {formatToBRL(service.price)}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
