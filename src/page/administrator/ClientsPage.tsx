const CLIENTS = [
  {
    id: 1,
    name: "Ronald Vollet",
    email: "ronald.vollet@gmail.com",
    phone: "(19) 97125-4742",
    appointments: 2,
    lastService: "Braids Style",
    status: "Ativo",
  },
  {
    id: 2,
    name: "Ronaldo Vieira",
    email: "ronaldo-vieira27@hotmail.com",
    phone: "(19) 99843-4150",
    appointments: 1,
    lastService: "Full Hair Dye",
    status: "Novo",
  },
  {
    id: 3,
    name: "Teste Teste",
    email: "ronald.vollet@drogal.com.br",
    phone: "(19) 97125-4742",
    appointments: 1,
    lastService: "Full Hair Dye",
    status: "Ativo",
  },
] as const;

const ClientsPage = () => {
  const totalAppointments = CLIENTS.reduce(
    (total, client) => total + client.appointments,
    0
  );

  return (
    <div className="tirr__admin__page container-fluid bg-light min-vh-100 py-3">
      <div className="row g-2 mb-3">
        <div className="col-6">
          <div className="bg-white rounded-4 p-3 shadow-sm">
            <p className="text-muted font-size-13">Clientes</p>
            <strong className="font-size-24">{CLIENTS.length}</strong>
          </div>
        </div>

        <div className="col-6">
          <div className="bg-white rounded-4 p-3 shadow-sm">
            <p className="text-muted font-size-13">Agendamentos</p>
            <strong className="font-size-24">{totalAppointments}</strong>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-4 p-3 shadow-sm">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="font-size-16 fw-bold">Lista de clientes</h2>
          <span className="badge bg-primary font-size-12">Atualizado</span>
        </div>

        <div className="d-flex flex-column gap-2">
          {CLIENTS.map((client) => (
            <article
              key={client.id}
              className="border rounded-3 p-3 d-flex flex-column gap-2"
            >
              <div className="d-flex align-items-start justify-content-between gap-2">
                <div>
                  <h3 className="font-size-16 fw-bold">{client.name}</h3>
                  <p className="text-muted font-size-13">{client.email}</p>
                </div>

                <span className="badge bg-light text-dark border">
                  {client.status}
                </span>
              </div>

              <div className="row g-2 font-size-13">
                <div className="col-12 col-md-4">
                  <span className="text-muted">Telefone</span>
                  <p className="fw-semibold">{client.phone}</p>
                </div>

                <div className="col-6 col-md-4">
                  <span className="text-muted">Agendamentos</span>
                  <p className="fw-semibold">{client.appointments}</p>
                </div>

                <div className="col-6 col-md-4">
                  <span className="text-muted">Ultimo servico</span>
                  <p className="fw-semibold">{client.lastService}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClientsPage;
