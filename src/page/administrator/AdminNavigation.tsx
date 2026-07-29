import { NavLink } from "react-router";

const MENU_ITEMS = [
  { path: "/administrador", icon: "bi-calendar3", label: "Agenda", end: true },
  { path: "/administrador/clientes", icon: "bi-people", label: "Clientes", end: false },
  { path: "/administrador/servicos", icon: "bi-scissors", label: "Servicos", end: false },
  { path: "/administrador/perfil", icon: "bi-person", label: "Perfil", end: false },
] as const;

type AdminNavigationProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const AdminNavigation = ({ collapsed, onToggle }: AdminNavigationProps) => {
  return (
    <nav
      className={`tirr__admin__navigation ${collapsed ? "is-collapsed" : ""}`}
      aria-label="Menu administrativo"
    >
      <button className="tirr__admin__menu-brand"  onClick={onToggle}>
        <span  className="tirr__admin__menu-brand-label">Agenda</span>
      </button>

      <div className="tirr__admin__menu-links">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `tirr__admin__navigation__item ${isActive ? "active" : ""}`
            }
            aria-label={item.label}
          >
            <span className="tirr__admin__navigation__icon" aria-hidden="true">
              <i className={`bi ${item.icon}`} />
            </span>
            <span className="tirr__admin__navigation__label">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="tirr__admin__menu-account">
        <span className="tirr__admin__menu-avatar">A</span>
        <span className="tirr__admin__menu-account-copy"><strong>Administrador</strong><small>Conta principal</small></span>
      </div>
    </nav>
  );
};

export default AdminNavigation;
