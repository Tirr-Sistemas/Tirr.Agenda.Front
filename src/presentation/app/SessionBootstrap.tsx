import { useEffect } from "react";

import { useAuthStore } from "@/presentation/stores/authStore";

/**
 * @description Inicializa silenciosamente a sessão armazenada quando a aplicação é montada.
 *
 * @returns Elemento React renderizado pelo componente.
 */
const SessionBootstrap = () => {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => { void bootstrap(); }, [bootstrap]);
  return null;
};

export default SessionBootstrap;
