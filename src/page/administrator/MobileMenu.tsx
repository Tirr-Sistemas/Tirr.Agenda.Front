import { NavLink } from "react-router";

const MENU_ITEMS = [
  { path: "/administrador", icon: "bi-calendar-event", label: "Agenda", end: true },
  { path: "/administrador/clientes", icon: "bi-people-fill", label: "Clientes", end: false },
  { path: "/administrador/servicos", icon: "bi-tools", label: "Servicos", end: false },
  { path: "/administrador/perfil", icon: "bi-person-circle", label: "Perfil", end: false },
] as const;

const MobileMenu = () => {
  return (
    <nav className="tirr__admin__mobile-menu shadow-lg flex-1 d-flex align-items-center justify-content-between px-3">
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

          <p className="tirr__admin__mobile-menu__label font-size-12">
            {item.label}
          </p>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileMenu;
