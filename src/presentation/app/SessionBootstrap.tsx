import { useEffect } from "react";

import { useAuthStore } from "@/presentation/stores/authStore";

const SessionBootstrap = () => {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => { void bootstrap(); }, [bootstrap]);
  return null;
};

export default SessionBootstrap;
