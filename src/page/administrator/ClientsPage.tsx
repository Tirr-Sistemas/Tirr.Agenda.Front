import { useMemo, useState } from "react";

const CLIENTS = [
  { id: 1, name: "Ronald Vollet", email: "ronald.vollet@gmail.com", phone: "(19) 97125-4742", appointments: 2, lastService: "Braids Style", status: "Ativo" },
  { id: 2, name: "Ronaldo Vieira", email: "ronaldo-vieira27@hotmail.com", phone: "(19) 99843-4150", appointments: 1, lastService: "Full Hair Dye", status: "Novo" },
  { id: 3, name: "Teste Teste", email: "ronald.vollet@drogal.com.br", phone: "(19) 97125-4742", appointments: 1, lastService: "Full Hair Dye", status: "Ativo" },
] as const;

const initials = (name: string) => name.split(" ").map((part) => part[0]).slice(0, 2).join("");

const ClientsPage = () => {
  const [query, setQuery] = useState("");
  const clients = useMemo(() => {
    const value = query.toLowerCase().trim();
    return CLIENTS.filter((client) => !value || `${client.name} ${client.email} ${client.phone}`.toLowerCase().includes(value));
  }, [query]);
  const totalAppointments = CLIENTS.reduce((total, client) => total + client.appointments, 0);

  return (
    <div className="tirr__admin__page">
      <section className="tirr__admin__stats" aria-label="Resumo de clientes">
        <article className="tirr__admin__stat-card"><span className="tirr__admin__stat-icon"><i className="bi bi-people" /></span><div><small>Clientes</small><strong>{CLIENTS.length} cadastrados</strong></div></article>
        <article className="tirr__admin__stat-card"><span className="tirr__admin__stat-icon"><i className="bi bi-calendar-event" /></span><div><small>Agendamentos</small><strong>{totalAppointments} no total</strong></div></article>
        <article className="tirr__admin__stat-card"><span className="tirr__admin__stat-icon"><i className="bi bi-person-plus" /></span><div><small>Novos clientes</small><strong>1 este mes</strong></div></article>
      </section>

      <section className="tirr__admin__panel">
        <div className="tirr__admin__panel-header tirr__admin__list-header">
          <div><p className="tirr__admin__overline">Base de relacionamento</p><h2>Clientes</h2></div>
          <label className="tirr__admin__search" aria-label="Buscar clientes">
            <i className="bi bi-search" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente" />
          </label>
        </div>

        <div className="tirr__admin__client-list">
          {clients.map((client) => (
            <article key={client.id} className="tirr__admin__client-row">
              <span className="tirr__admin__client-avatar">{initials(client.name)}</span>
              <div className="tirr__admin__client-main"><h3>{client.name}</h3><p>{client.email}</p></div>
              <div className="tirr__admin__client-data"><small>Telefone</small><span>{client.phone}</span></div>
              <div className="tirr__admin__client-data"><small>Ultimo servico</small><span>{client.lastService}</span></div>
              <div className="tirr__admin__client-data"><small>Agendamentos</small><span>{client.appointments}</span></div>
              <span className={`tirr__admin__status ${client.status === "Ativo" ? "is-active" : ""}`}>{client.status}</span>
              <button type="button" className="tirr__admin__icon-button" aria-label={`Ver ${client.name}`}><i className="bi bi-chevron-right" /></button>
            </article>
          ))}
          {!clients.length && <p className="tirr__admin__empty">Nenhum cliente encontrado.</p>}
        </div>
      </section>
    </div>
  );
};

export default ClientsPage;
