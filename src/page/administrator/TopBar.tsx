import { useLocation } from "react-router";

import { authUtils } from "@/utils/auth";

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
    <header className="tirr__topbar">
      <div>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="tirr__admin__topbar-notification"
          aria-label="Notificacoes"
        >
          <i className="bi bi-bell-fill font-size-20"></i>
          <span className="tirr__admin__topbar-badge">
            8
          </span>
        </button>
        <button
          type="button"
          className="tirr__admin__topbar-logout"
          onClick={authUtils.logout}
          aria-label="Sair da area administrativa"
          title="Sair"
        >
          <i className="bi bi-box-arrow-right font-size-20" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
