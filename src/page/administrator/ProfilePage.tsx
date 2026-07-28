const PROFILE_ITEMS = [
  { label: "Estabelecimento", value: "Tirr Sistema Agenda", icon: "bi-shop" },
  { label: "Responsavel", value: "Administrador", icon: "bi-person" },
  { label: "Contato", value: "(19) 99999-9999", icon: "bi-telephone" },
  { label: "E-mail", value: "contato@tirragenda.com", icon: "bi-envelope" },
] as const;

const BUSINESS_HOURS = [
  { day: "Segunda a sexta", hours: "08:00 as 18:00" },
  { day: "Sabado", hours: "08:00 as 14:00" },
  { day: "Domingo", hours: "Fechado" },
] as const;

const ProfilePage = () => (
  <div className="tirr__admin__page tirr__admin__profile-page">
    <section className="tirr__admin__profile-hero">
      <span className="tirr__admin__profile-avatar">A</span>
      <div><p className="tirr__admin__overline">Conta principal</p><h2>Administrador</h2><span>Acesso gerencial</span></div>
    </section>

    <div className="tirr__admin__profile-grid">
      <section className="tirr__admin__panel">
        <div className="tirr__admin__panel-header"><div><p className="tirr__admin__overline">Informacoes</p><h2>Dados do estabelecimento</h2></div></div>
        <div className="tirr__admin__details-list">
          {PROFILE_ITEMS.map((item) => <div key={item.label} className="tirr__admin__detail-row"><span className="tirr__admin__detail-icon"><i className={`bi ${item.icon}`} /></span><span><small>{item.label}</small><strong>{item.value}</strong></span></div>)}
        </div>
      </section>

      <section className="tirr__admin__panel">
        <div className="tirr__admin__panel-header"><div><p className="tirr__admin__overline">Disponibilidade</p><h2>Horario de atendimento</h2></div><span className="tirr__admin__status is-active">Online</span></div>
        <div className="tirr__admin__hours-list">
          {BUSINESS_HOURS.map((item) => <div key={item.day}><span>{item.day}</span><strong className={item.hours === "Fechado" ? "text-muted" : ""}>{item.hours}</strong></div>)}
        </div>
      </section>
    </div>
  </div>
);

export default ProfilePage;
