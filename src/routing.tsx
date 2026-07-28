import { Outlet, Route, Routes } from "react-router";

import { ScheduleRoutes } from "./config";
import ClientsPage from "./page/administrator/ClientsPage";
import Dashboard from "./page/administrator/Dashboard";
import MobileMenu from "./page/administrator/MobileMenu";
import ProfilePage from "./page/administrator/ProfilePage";
import ServicesPage from "./page/administrator/ServicesPage";
import LoginPage from "./page/LoginPage";

import ChoiceDataAndTimePage from "./page/scheduler/ChoiceDataAndTimePage";
import ChoiceServicePage from "./page/scheduler/ChoiceServicePage";
import SchedulerProfilePage from "./page/scheduler/ProfilePage";
import ValidationPage from "./page/scheduler/ValidationPage";

import TopBar from "./page/administrator/TopBar";
import Header from "./shared/Header";
import RequireAuth from "./shared/RequireAuth";

/**
 * Layout público
 */
const PublicLayout = () => (
  <>
    <Header />
    <main className="container py-4">
      <Outlet />
    </main>
  </>
);

/**
 * Layout administrativo
 */
const AdminLayout = () => (
  <div className="tirr__admin-layout">
    <MobileMenu />
    <div className="tirr__admin__workspace">
      <TopBar />
      <main>
        <Outlet />
      </main>
    </div>
  </div>
);

const Routing = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas Públicas */}
      <Route element={<PublicLayout />}>
        <Route index element={<ChoiceServicePage />} />

        <Route
          path={ScheduleRoutes.SERVICE}
          element={<ChoiceServicePage />}
        />

        <Route
          path={ScheduleRoutes.DATE_TIME}
          element={<ChoiceDataAndTimePage />}
        />

        <Route
          path={ScheduleRoutes.PROFILE}
          element={<SchedulerProfilePage />}
        />

        <Route
          path={ScheduleRoutes.CONFIRMATION}
          element={<ValidationPage />}
        />
      </Route>

      {/* Rotas Administrativas */}
      <Route element={<RequireAuth />}>
        <Route path="/administrador" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="servicos" element={<ServicesPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Routing;
