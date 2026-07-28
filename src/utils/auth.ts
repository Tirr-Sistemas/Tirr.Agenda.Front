const COOKIE_NAME = "3A2D728B8926EF6A6B5A6CAF81004E86B817844C";

/**
 * @description
 * Hook responsável por gerenciar autenticação baseada em token via cookie.
 * 
 * Ele centraliza operações como:
 * - Recuperar o token do cookie
 * - Persistir o token no cookie
 * - Remover o token (logout)
 * - Preparar o token vindo da URL (fluxo SSO)
 * - Validar expiração do token (JWT)
 * - Redirecionar para a tela de login
 */
const __AUTH_UTILS__ = () => {

  /**
   * @description
   * Recupera o token armazenado no cookie.
   * 
   * @returns {string | null} Token encontrado ou null caso não exista
   */
  const getToken = (): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  /**
   * @description
   * Salva o token no cookie com expiração de 1 dia.
   * 
   * @param {string} token Token de autenticação
   */
  const setToken = (token: string) => {
    document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
  };

  const createSessionToken = (email: string) => {
    const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        sub: email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      })
    );

    return `${header}.${payload}.local`;
  };

  /**
   * @description
   * Remove o token do cookie, efetivamente deslogando o usuário.
   */
  const removeToken = () => {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  }

  /**
   * @description
   * Valida se o token atual é válido.
   * 
   * - Verifica se existe token
   * - Tenta decodificar como JWT
   * - Valida expiração (`exp`)
   * 
   * @returns {boolean} true se o token for válido, false caso contrário
   */
  const isTokenValid = (): boolean => {
    const token = getToken();

    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (!payload.exp) return true;

      const isExpired = payload.exp * 1000 < Date.now();

      return !isExpired;
    } catch {
      return false;
    }
  };

  /**
   * @description
   * Redireciona o usuário para a página de login.
   * @param appName: nome do aplicativo que será utilizando como identidade na tela do sso
   */
  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  /**
   * @description
   * Realiza o logout do usuário:
   * - Remove o token do cookie
   * - Redireciona para a tela de login
   * @param appName: nome do aplicativo que será utilizando como identidade na tela do sso
   */
  const logout = () => {
    removeToken();
    redirectToLogin();
  };

  return {
    getToken,
    setToken,
    createSessionToken,
    removeToken,
    isTokenValid,
    logout,
    redirectToLogin,
  };
};

const authUtils = __AUTH_UTILS__();

export { authUtils };

