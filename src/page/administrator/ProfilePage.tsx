const PROFILE_ITEMS = [
  { label: "Estabelecimento", value: "Tirr Sistema Agenda" },
  { label: "Responsavel", value: "Administrador" },
  { label: "Contato", value: "(19) 99999-9999" },
  { label: "Email", value: "contato@tirragenda.com" },
] as const;

const BUSINESS_HOURS = [
  { day: "Segunda a sexta", hours: "08:00 as 18:00" },
  { day: "Sabado", hours: "08:00 as 14:00" },
  { day: "Domingo", hours: "Fechado" },
] as const;

const ProfilePage = () => {
  return (
    <div className="tirr__admin__page container-fluid bg-light min-vh-100 py-3">
      <div className="mb-3">
        <h1 className="font-size-20 fw-bold">Perfil</h1>
        <p className="text-muted font-size-13">
          Informacoes principais da conta administrativa.
        </p>
      </div>

      <section className="bg-white rounded-4 p-3 shadow-sm mb-3">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="tirr__admin__profile-avatar bg-primary text-white">
            <i className="bi bi-person-fill font-size-24" />
          </div>

          <div>
            <h2 className="font-size-17 fw-bold">Administrador</h2>
            <p className="text-muted font-size-13">Acesso gerencial</p>
          </div>
        </div>

        <div className="d-flex flex-column gap-2">
          {PROFILE_ITEMS.map((item) => (
            <div
              key={item.label}
              className="border rounded-3 p-3 d-flex align-items-center justify-content-between gap-3"
            >
              <span className="text-muted font-size-13">{item.label}</span>
              <strong className="font-size-13 text-end">{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-4 p-3 shadow-sm">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="font-size-16 fw-bold">Horario de atendimento</h2>
          <span className="badge bg-primary font-size-12">Online</span>
        </div>

        <div className="d-flex flex-column gap-2">
          {BUSINESS_HOURS.map((item) => (
            <div
              key={item.day}
              className="border rounded-3 p-3 d-flex align-items-center justify-content-between"
            >
              <span className="font-size-13">{item.day}</span>
              <strong className="font-size-13">{item.hours}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
