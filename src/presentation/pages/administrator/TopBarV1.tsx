import Icon from "@/presentation/icons/Icon";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { useAuthStore } from "@/presentation/stores/authStore";
import ThemeToggle from "@/presentation/components/ThemeToggle";
import IconButton from "@/presentation/components/IconButton";

const META = [
  { match: "/clientes", title: "Clientes", description: "Relacionamento, historico e dados de contato." },
  { match: "/catalogo", title: "Catalogo", description: "Servicos, categorias, precos e duracoes." },
  { match: "/equipe", title: "Equipe", description: "Profissionais e acessos ao estabelecimento." },
  { match: "/disponibilidade", title: "Disponibilidade", description: "Jornadas recorrentes e excecoes de horario." },
  { match: "/configuracoes", title: "Configuracoes", description: "Estabelecimento, seguranca e integracoes." },
] as const;

const TopBarV1 = () => {
  const { pathname } = useLocation();
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const businesses = useAuthStore((state) => state.businesses);
  const activeBusiness = useAuthStore((state) => state.activeBusiness);
  const isSwitching = useAuthStore((state) => state.isSwitchingBusiness);
  const selectBusiness = useAuthStore((state) => state.selectBusiness);
  const logout = useAuthStore((state) => state.logout);
  const page = useMemo(() => META.find((item) => pathname.includes(item.match)) ?? { title: "Agenda", description: "Visualize horarios e acompanhe os atendimentos." }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") return setOpen(false);
      if (event instanceof MouseEvent && !switcherRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, [open]);

  const switchBusiness = async (nextId: string) => {
    if (nextId === businessId) return setOpen(false);
    const suffix = pathname.replace(`/administrador/${businessId}`, "");
    const next = await selectBusiness(nextId);
    setOpen(false);
    navigate(`/administrador/${next.businessId}${suffix}`);
  };

  return <header className="tirr__topbar tirr__topbar-v1">
    <div className="tirr__topbar-title"><h1>{page.title}</h1><p>{page.description}</p></div>
    <div className="tirr__topbar-actions">
      <div className="tirr__business-switcher" ref={switcherRef}>
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} disabled={isSwitching}><span className="tirr__business-mark"><Icon name="building" /></span><span><small>Empresa ativa</small><strong>{isSwitching ? "Trocando empresa..." : activeBusiness?.name ?? "Selecionar empresa"}</strong></span>{businesses.length > 1 && <Icon name="chevron-down" />}</button>
        {open && businesses.length > 1 && <div className="tirr__business-menu" role="menu">{businesses.map((item) => <button type="button" key={item.businessId} className={item.businessId === activeBusiness?.businessId ? "active" : ""} onClick={() => void switchBusiness(item.businessId)}><span><strong>{item.name}</strong><small>{item.roles.join(" / ")}</small></span>{item.businessId === activeBusiness?.businessId && <Icon name="check2" />}</button>)}</div>}
      </div>
      <ThemeToggle />
      <IconButton className="tirr__admin__topbar-logout" icon="box-arrow-right" label="Sair" onClick={() => void logout()} />
    </div>
  </header>;
};

export default TopBarV1;
