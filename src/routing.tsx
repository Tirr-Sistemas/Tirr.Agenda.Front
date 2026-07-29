import { Navigate, Outlet, Route, Routes } from "react-router";
import { useState } from "react";

import { ScheduleRoutes } from "./config";
import ClientsPage from "./page/administrator/ClientsPage";
import Dashboard from "./page/administrator/Dashboard";
import AdminNavigation from "./page/administrator/AdminNavigation";
import ProfilePage from "./page/administrator/ProfilePage";
import ServicesPage from "./page/administrator/ServicesPage";
import LoginPage from "./page/LoginPage";

import ChoiceDataAndTimePage from "./page/scheduler/ChoiceDataAndTimePage";
import ChoiceServicePage from "./page/scheduler/ChoiceServicePage";
import SchedulerProfilePage from "./page/scheduler/ProfilePage";
import ValidationPage from "./page/scheduler/ValidationPage";

import TopBar from "./page/administrator/TopBar";
import RequireAuth from "./shared/RequireAuth";
import SchedulerLayout from "./shared/SchedulerLayout";

/**
 * Layout público
 */
/**
 * Layout administrativo
 */
const AdminLayout = () => {
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);

  return (
    <div className={`tirr__admin-layout ${isNavigationCollapsed ? "is-navigation-collapsed" : ""}`}>
      <AdminNavigation
        collapsed={isNavigationCollapsed}
        onToggle={() => setIsNavigationCollapsed((collapsed) => !collapsed)}
      />
      <div className="tirr__admin__workspace">
        <TopBar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const Routing = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas Públicas */}
      <Route element={<SchedulerLayout />}>
        <Route index element={<Navigate to={ScheduleRoutes.SERVICE} replace />} />

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
