import Icon from "@/presentation/icons/Icon";
import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router";

import { useAuthStore } from "@/presentation/stores/authStore";
import ThemeToggle from "@/presentation/components/ThemeToggle";

/**
 * @description Modos suportados pelo formulário de acesso.
 */
type Mode = "login" | "register";
/**
 * @description Converte o nome da empresa em um slug seguro para o primeiro cadastro.
 *
 * @param value - Nome informado pelo usuário.
 * @returns Slug normalizado, sem acentos e separadores inválidos.
 */
const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * @description Página de login e criação da primeira conta administrativa.
 *
 * @returns Elemento React renderizado pelo componente.
 */
const AccessPage = () => {
  const navigate = useNavigate();
  const status = useAuthStore((state) => state.status);
  const activeBusiness = useAuthStore((state) => state.activeBusiness);
  const login = useAuthStore((state) => state.login);
  const registerAccount = useAuthStore((state) => state.register);
  const storeError = useAuthStore((state) => state.error);
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({ fullName: "", businessName: "", email: "", password: "" });

  if (status === "authenticated" && activeBusiness)
    return <Navigate to={`/administrador/${activeBusiness.businessId}`} replace />;

  /**
   * @description Atualiza um campo do formul?rio de acesso e limpa a mensagem de erro anterior.
   *
   * @param field - Valor de field utilizado pela opera??o.
   *
   * @param value - Valor que ser? processado.
   */
  const setValue = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
  };

  /**
   * @description Valida e envia o formul?rio, refletindo o estado ass?ncrono e eventuais falhas.
   *
   * @param event - Evento disparado pela interface.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values.email.trim() || !values.password)
      return setError("Informe e-mail e senha para continuar.");
    if (mode === "register" && (!values.fullName.trim() || !values.businessName.trim()))
      return setError("Informe seu nome e o nome da empresa.");
    setIsSubmitting(true);
    setError("");
    try {
      if (mode === "register") {
        await registerAccount({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          password: values.password,
          businessName: values.businessName.trim(),
          businessSlug: slugify(values.businessName),
          timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo",
        });
      }
      const selected = await login(values.email, values.password);
      if (!selected) return setError("Sua conta ainda nao participa de uma empresa ativa.");
      navigate(`/administrador/${selected.businessId}`, { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel concluir o acesso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="tirr__login">
      <ThemeToggle className="tirr__login__theme-toggle" />
      <section className="tirr__login__intro" aria-labelledby="login-title">
        <div className="tirr__login__brand" aria-hidden="true">
          <Icon name="calendar2-check-fill" />
        </div>
        <p className="tirr__login__eyebrow">Tirr Agenda</p>
        <h1 id="login-title">Seu dia, bem organizado.</h1>
        <p className="tirr__login__description">
          Gerencie agenda, clientes, equipe e disponibilidade em um so lugar.
        </p>
      </section>
      <section className="tirr__login__form-area" aria-labelledby="login-form-title">
        <form className="tirr__login__form" onSubmit={handleSubmit} noValidate>
          <div className="tirr__login__mode-switch" aria-label="Tipo de acesso">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Entrar
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Criar conta
            </button>
          </div>
          <div className="mb-4">
            <p className="tirr__login__eyebrow">Area administrativa</p>
            <h2 id="login-form-title">{mode === "login" ? "Boas-vindas" : "Primeiro acesso"}</h2>
            <p className="tirr__login__support mt-2">
              {mode === "login"
                ? "Use seus dados para continuar."
                : "Crie sua conta e a primeira empresa."}
            </p>
          </div>
          {(error || storeError) && (
            <div className="alert alert-danger tirr__login__alert py-2" role="alert">
              {error || storeError}
            </div>
          )}
          {mode === "register" && (
            <>
              <label className="tirr__login__field" htmlFor="fullName">
                <span>Nome completo</span>
                <input
                  id="fullName"
                  className="form-control"
                  value={values.fullName}
                  onChange={(event) => setValue("fullName", event.target.value)}
                  autoComplete="name"
                />
              </label>
              <label className="tirr__login__field" htmlFor="businessName">
                <span>Nome da empresa</span>
                <input
                  id="businessName"
                  className="form-control"
                  value={values.businessName}
                  onChange={(event) => setValue("businessName", event.target.value)}
                  autoComplete="organization"
                />
              </label>
            </>
          )}
          <div className="tirr__login__field">
            <label htmlFor="email">E-mail</label>
            <div className="input-group">
              <span className="input-group-text" aria-hidden="true">
                <Icon name="envelope" />
              </span>
              <input
                id="email"
                className="form-control"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => setValue("email", event.target.value)}
                placeholder="voce@empresa.com"
              />
            </div>
          </div>
          <div className="tirr__login__field">
            <label htmlFor="password">Senha</label>
            <div className="input-group">
              <span className="input-group-text" aria-hidden="true">
                <Icon name="lock" />
              </span>
              <input
                id="password"
                className="form-control"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={values.password}
                onChange={(event) => setValue("password", event.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                <Icon name={showPassword ? "eye-slash" : "eye"} />
              </button>
            </div>
          </div>
          <button
            className="btn btn-primary w-100 py-2 fw-semibold"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Aguarde..."
              : mode === "login"
                ? "Entrar na agenda"
                : "Criar conta e entrar"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default AccessPage;
