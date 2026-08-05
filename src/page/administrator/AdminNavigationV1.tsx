import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";

import { useAuthStore } from "@/auth/authStore";

const ITEMS = [
  { suffix: "", icon: "bi-calendar3", label: "Agenda", permission: "appointments.get" },
  { suffix: "/clientes", icon: "bi-people", label: "Clientes", permission: "customers.get" },
  { suffix: "/catalogo", icon: "bi-grid", label: "Catalogo", permission: "services.get" },
  { suffix: "/equipe", icon: "bi-person-badge", label: "Equipe", permission: "professionals.get" },
  { suffix: "/disponibilidade", icon: "bi-clock-history", label: "Disponibilidade", permission: "availability_rules.get" },
  { suffix: "/configuracoes", icon: "bi-sliders", label: "Configuracoes", permission: "business.get" },
] as const;

type Props = { collapsed: boolean; onToggle: () => void };

const AdminNavigationV1 = ({ collapsed, onToggle }: Props) => {
  const { businessId } = useParams();
  const [moreOpen, setMoreOpen] = useState(false);
  const permissions = useAuthStore((state) => state.permissions);
  const user = useAuthStore((state) => state.user);
  const base = `/administrador/${businessId}`;
  const visible = ITEMS.filter((item) => permissions.includes(item.permission));
  const primary = visible.slice(0, 4);
  const secondary = visible.slice(4);

  useEffect(() => {
    if (!moreOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMoreOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [moreOpen]);

  const link = (item: typeof ITEMS[number], mobile = false) => <NavLink key={`${mobile ? "mobile" : "desktop"}-${item.label}`} to={`${base}${item.suffix}`} end={!item.suffix} className={({ isActive }) => `tirr__admin__navigation__item ${isActive ? "active" : ""}`} aria-label={item.label} title={collapsed && !mobile ? item.label : undefined} onClick={() => setMoreOpen(false)}><span className="tirr__admin__navigation__icon" aria-hidden="true"><i className={`bi ${item.icon}`} /></span><span className="tirr__admin__navigation__label">{item.label}</span></NavLink>;

  return <>
    <nav className={`tirr__admin__navigation tirr__admin__navigation-v1 ${collapsed ? "is-collapsed" : ""}`} aria-label="Menu administrativo">
      <button className="tirr__admin__menu-brand" onClick={onToggle} aria-label={collapsed ? "Expandir menu" : "Recolher menu"}><i className="bi bi-calendar2-check-fill" /><span className="tirr__admin__menu-brand-label">Tirr Agenda</span><i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`} /></button>
      <div className="tirr__admin__menu-links tirr__desktop-links">{visible.map((item) => link(item))}</div>
      <div className="tirr__admin__menu-links tirr__mobile-links">{primary.map((item) => link(item, true))}{secondary.length > 0 && <button className={`tirr__admin__navigation__item ${moreOpen ? "active" : ""}`} onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen}><span className="tirr__admin__navigation__icon"><i className="bi bi-three-dots" /></span><span className="tirr__admin__navigation__label">Mais</span></button>}</div>
      <div className="tirr__admin__menu-account"><span className="tirr__admin__menu-avatar">{user?.fullName?.[0] ?? "U"}</span><span className="tirr__admin__menu-account-copy"><strong>{user?.fullName ?? "Usuario"}</strong><small>{user?.email}</small></span></div>
    </nav>
    {moreOpen && <div className="tirr__admin__more-menu" role="dialog" aria-label="Mais opcoes"><button className="tirr__admin__more-backdrop" onClick={() => setMoreOpen(false)} aria-label="Fechar menu" /><section>{secondary.map((item) => link(item, true))}</section></div>}
  </>;
};

export default AdminNavigationV1;
