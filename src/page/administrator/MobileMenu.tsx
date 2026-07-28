import { NavLink } from "react-router";

const MENU_ITEMS = [
  { path: "/administrador", icon: "bi-calendar-event", label: "Agenda", end: true },
  { path: "/administrador/clientes", icon: "bi-people-fill", label: "Clientes", end: false },
  { path: "/administrador/servicos", icon: "bi-tools", label: "Servicos", end: false },
  { path: "/administrador/perfil", icon: "bi-person-circle", label: "Perfil", end: false },
] as const;

const MobileMenu = () => {
  return (
    <nav
      className="tirr__admin__mobile-menu"
      aria-label="Menu administrativo"
    >
      <div className="tirr__admin__menu-brand">
        <span className="tirr__admin__menu-mark"><i className="bi bi-calendar2-check-fill" /></span>
        <span>Tirr Agenda</span>
      </div>

      <div className="tirr__admin__menu-links">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `tirr__admin__mobile-menu__item ${isActive ? "active" : ""}`
            }
            aria-label={item.label}
          >
            <i className={`bi ${item.icon}`} />
            <span className="tirr__admin__mobile-menu__label">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="tirr__admin__menu-account">
        <span className="tirr__admin__menu-avatar">A</span>
        <span><strong>Administrador</strong><small>Conta principal</small></span>
      </div>
    </nav>
  );
};

export default MobileMenu;
