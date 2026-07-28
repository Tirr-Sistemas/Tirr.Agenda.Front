import { Navigate, Outlet, useLocation } from "react-router";

import { authUtils } from "@/utils/auth";

const RequireAuth = () => {
  const location = useLocation();

  if (!authUtils.isTokenValid()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
