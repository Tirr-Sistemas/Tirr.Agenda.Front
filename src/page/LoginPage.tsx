import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router";

import { authUtils } from "@/utils/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (authUtils.isTokenValid()) {
    return <Navigate to="/administrador" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Informe e-mail e senha para continuar.");
      return;
    }

    authUtils.setToken(authUtils.createSessionToken(email.trim()));
    navigate("/administrador", { replace: true });
  };

  return (
    <main className="tirr__login">
      <section className="tirr__login__intro" aria-labelledby="login-title">
        <div className="tirr__login__brand" aria-hidden="true">
          <i className="bi bi-calendar2-check-fill" />
        </div>
        <p className="tirr__login__eyebrow">Tirr Agenda</p>
        <h1 id="login-title">Seu dia, bem organizado.</h1>
        <p className="tirr__login__description">
          Gerencie sua agenda, seus clientes e seus servicos em um so lugar.
        </p>
      </section>

      <section className="tirr__login__form-area" aria-labelledby="login-form-title">
        <form className="tirr__login__form" onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <p className="tirr__login__eyebrow">Area administrativa</p>
            <h2 id="login-form-title">Entrar</h2>
            <p className="text-muted font-size-14 mt-2">
              Use seus dados de acesso para continuar.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 font-size-13" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold font-size-14" htmlFor="email">
              E-mail
            </label>
            <div className="input-group">
              <span className="input-group-text" aria-hidden="true">
                <i className="bi bi-envelope" />
              </span>
              <input id="email" className="form-control" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="voce@empresa.com" required />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold font-size-14" htmlFor="password">
              Senha
            </label>
            <div className="input-group">
              <span className="input-group-text" aria-hidden="true">
                <i className="bi bi-lock" />
              </span>
              <input id="password" className="form-control" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Digite sua senha" required />
              <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
              </button>
            </div>
          </div>

          <button className="btn btn-primary w-100 py-2 fw-semibold" type="submit">
            Entrar na agenda
          </button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
