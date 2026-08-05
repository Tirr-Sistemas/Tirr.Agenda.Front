import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate, useParams } from "react-router";

import { useAuthStore } from "@/presentation/stores/authStore";
import { useApplication } from "@/presentation/hooks/useApplication";
import AccessPage from "@/presentation/pages/AccessPage";
import AdminNavigationV1 from "@/presentation/pages/administrator/AdminNavigationV1";
import TopBarV1 from "@/presentation/pages/administrator/TopBarV1";
import PublicSchedulerPage from "@/presentation/pages/scheduler/PublicSchedulerPage";
import AsyncState from "@/presentation/components/AsyncState";
import RequireAuth from "@/presentation/components/RequireAuth";
import SchedulerLayout from "@/presentation/components/SchedulerLayout";
import { PUBLIC_SCHEDULER_ROUTE, publicSchedulerPath } from "@/presentation/utils/publicSchedulerUrl";

const AgendaPage = lazy(() => import("@/presentation/pages/administrator/AgendaPageV2"));
const AvailabilityPage = lazy(() => import("@/presentation/pages/administrator/AvailabilityPage"));
const CatalogPage = lazy(() => import("@/presentation/pages/administrator/CatalogPage"));
const CustomersPageV1 = lazy(() => import("@/presentation/pages/administrator/CustomersPageV1"));
const SettingsPage = lazy(() => import("@/presentation/pages/administrator/SettingsPageV2"));
const TeamPage = lazy(() => import("@/presentation/pages/administrator/TeamPageV2"));

const AdminEntry = () => {
  const active = useAuthStore((state) => state.activeBusiness);
  if (!active) return <main className="tirr__session-loading"><AsyncState kind="empty" title="Nenhuma empresa disponivel" description="Sua conta nao possui participacao ativa em um estabelecimento." /></main>;
  return <Navigate to={`/administrador/${active.businessId}`} replace />;
};

const PublicSlugEntry = () => {
  const application = useApplication();
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    application.booking.resolveBusiness.execute({ type: "slug", slug })
      .then((item) => navigate(publicSchedulerPath(item.businessId), { replace: true }))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Empresa nao encontrada."));
  }, [application, navigate, slug]);

  return <main className="tirr__session-loading"><AsyncState kind={error ? "error" : "loading"} title={error ? "Nao foi possivel abrir a agenda" : "Abrindo agenda"} description={error || "Identificando a empresa..."} /></main>;
};

const PublicSchedulerEntry = () => {
  const { businessId = "" } = useParams();
  return <PublicSchedulerPage key={businessId} />;
};

const PermissionRoute = ({ permission }: { permission: string }) => {
  const allowed = useAuthStore((state) => state.permissions.includes(permission));
  return allowed ? <Outlet /> : <main className="tirr__admin__page"><AsyncState kind="error" title="Acesso nao permitido" description="Seu papel nesta empresa nao possui permissao para este recurso." /></main>;
};

const AdminLayout = () => {
  const { businessId = "" } = useParams();
  const navigate = useNavigate();
  const businesses = useAuthStore((state) => state.businesses);
  const active = useAuthStore((state) => state.activeBusiness);
  const selectBusiness = useAuthStore((state) => state.selectBusiness);
  const switching = useAuthStore((state) => state.isSwitchingBusiness);
  const [collapsed, setCollapsed] = useState(() => window.localStorage.getItem("tirr-admin-navigation") === "collapsed");

  useEffect(() => {
    window.localStorage.setItem("tirr-admin-navigation", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  useEffect(() => {
    if (!businessId || active?.businessId === businessId) return;
    if (businesses.some((item) => item.businessId === businessId)) void selectBusiness(businessId);
    else if (active) navigate(`/administrador/${active.businessId}`, { replace: true });
  }, [active, businessId, businesses, navigate, selectBusiness]);

  return <div className={`tirr__admin-layout ${collapsed ? "is-navigation-collapsed" : ""}`}>
    <AdminNavigationV1 collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
    <div className="tirr__admin__workspace"><TopBarV1 /><main key={active?.businessId}><Suspense fallback={<PageRouteLoading />}><Outlet /></Suspense></main></div>
    {switching && <div className="tirr__context-switching" role="status"><span /><strong>Trocando empresa...</strong></div>}
  </div>;
};

const PageRouteLoading = () => <div className="tirr__admin__page"><div className="tirr__resource-skeleton" role="status" aria-label="Carregando pagina" /></div>;

const RoutingV1 = () => <Routes>
  <Route path="/login" element={<AccessPage />} />
  <Route element={<SchedulerLayout />}>
    <Route path={PUBLIC_SCHEDULER_ROUTE} element={<PublicSchedulerEntry />} />
    <Route path="/agendar/empresa/:slug" element={<PublicSlugEntry />} />
  </Route>
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route element={<RequireAuth />}>
    <Route path="/administrador" element={<AdminEntry />} />
    <Route path="/administrador/:businessId" element={<AdminLayout />}>
      <Route element={<PermissionRoute permission="appointments.get" />}><Route index element={<AgendaPage />} /></Route>
      <Route element={<PermissionRoute permission="customers.get" />}><Route path="clientes" element={<CustomersPageV1 />} /></Route>
      <Route element={<PermissionRoute permission="services.get" />}><Route path="catalogo" element={<CatalogPage />} /></Route>
      <Route element={<PermissionRoute permission="professionals.get" />}><Route path="equipe" element={<TeamPage />} /></Route>
      <Route element={<PermissionRoute permission="availability_rules.get" />}><Route path="disponibilidade" element={<AvailabilityPage />} /></Route>
      <Route element={<PermissionRoute permission="business.get" />}><Route path="configuracoes" element={<SettingsPage />} /></Route>
    </Route>
  </Route>
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>;

export default RoutingV1;
