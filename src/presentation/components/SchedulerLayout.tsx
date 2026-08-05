import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";

import Header from "./Header";

/**
 * @description Shell da agenda pública que restaura scroll e foco após mudanças de rota.
 *
 * @returns Elemento React renderizado pelo componente.
 */
const SchedulerLayout = () => {
  const location = useLocation();
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    contentRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <div className="tirr__scheduler-layout">
      <Header />
      <main ref={contentRef} className="tirr__scheduler-layout__content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
};

export default SchedulerLayout;
