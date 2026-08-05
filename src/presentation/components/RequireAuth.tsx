import { Navigate, Outlet, useLocation } from "react-router";

import { useAuthStore } from "@/presentation/stores/authStore";
import AsyncState from "./AsyncState";

/**
 * @description Protege rotas administrativas e redireciona sessões não autenticadas.
 *
 * @returns Elemento React renderizado pelo componente.
 */
const RequireAuth = () => {
  const location = useLocation();
  const status = useAuthStore((state) => state.status);

  if (status === "idle" || status === "loading") {
    return <main className="tirr__session-loading"><AsyncState kind="loading" title="Preparando seu painel" description="Validando a sessao e o acesso as empresas." /></main>;
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
