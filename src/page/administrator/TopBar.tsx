import { useLocation } from "react-router";

const PAGE_META = {
  "/administrador": {
    title: "Agenda",
    description: "Visualize os horarios e acompanhe os atendimentos do dia.",
  },
  "/administrador/clientes": {
    title: "Clientes",
    description: "Acompanhe contatos, recorrencia e ultimo servico agendado.",
  },
  "/administrador/servicos": {
    title: "Servicos",
    description: "Gerencie catalogo, valores e duracao dos atendimentos.",
  },
  "/administrador/perfil": {
    title: "Perfil",
    description: "Informacoes principais da conta administrativa.",
  },
} as const;

const TopBar = () => {
  const { pathname } = useLocation();
  const page = PAGE_META[pathname as keyof typeof PAGE_META] ?? PAGE_META["/administrador"];

  return (
    <header className="tirr__topbar d-flex align-items-center justify-content-between px-3">
      <div>
        <h1 className="font-size-18 fw-bold">{page.title}</h1>
        <p className="text-muted font-size-12">{page.description}</p>
      </div>

      <button
        type="button"
        className="tirr__admin__topbar-notification"
        aria-label="Notificacoes"
      >
        <i className="bi bi-bell-fill font-size-20"></i>
        <span className="tirr__admin__topbar-badge font-size-12 bg-primary">
          8
        </span>
      </button>
    </header>
  );
};

export default TopBar;
