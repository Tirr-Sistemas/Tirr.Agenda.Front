import Icon from "@/presentation/icons/Icon";
import { type FormEvent, useState } from "react";

import { useAuthStore } from "@/presentation/stores/authStore";
import { useApplication } from "@/presentation/hooks/useApplication";
import { useApiData } from "@/presentation/hooks/useApiData";
import {
  AdminDrawer,
  AdminEmptyRow,
  AdminTabs,
  PageFeedback,
  StatusPill,
} from "@/presentation/components/AdminUi";
import FormField from "@/presentation/components/FormField";
import type { BusinessProfile, OperatingHoursDay } from "@/administration/application/dtos";
import type { ApiKeyCreated, ApiKeyItem } from "@/identity/application/dtos/IdentityManagementDtos";
import { publicSchedulerUrl } from "@/presentation/utils/publicSchedulerUrl";
import { useConfirm } from "@/presentation/hooks/useConfirm";
import SensitiveValueDialog from "@/presentation/components/SensitiveValueDialog";

const DAY_LABEL: Record<string, string> = {
  Sunday: "Domingo",
  Monday: "Segunda",
  Tuesday: "Terca",
  Wednesday: "Quarta",
  Thursday: "Quinta",
  Friday: "Sexta",
  Saturday: "Sabado",
};
const EMPTY_BUSINESS = { name: "", legalName: "", documentNumber: "", slug: "", timeZone: "" };

/**
 * @description Configura empresa, expediente, conta, segurança e integrações.
 *
 * @returns Elemento React renderizado pelo componente.
 */
const SettingsPage = () => {
  const application = useApplication();
  const confirm = useConfirm();
  const businessId = useAuthStore((state) => state.activeBusiness?.businessId ?? "");
  const user = useAuthStore((state) => state.user);
  const permissions = useAuthStore((state) => state.permissions);
  const roles = useAuthStore((state) => state.roles);
  const changePassword = useAuthStore((state) => state.changePassword);
  const logoutAll = useAuthStore((state) => state.logoutAll);
  const [tab, setTab] = useState("business");
  const profile = useApiData<BusinessProfile | null>(
    () => application.administration.overview.profile(businessId),
    businessId,
    null,
  );
  const hours = useApiData<OperatingHoursDay[]>(
    () => application.administration.overview.operatingHours(businessId),
    businessId,
    [],
  );
  const keys = useApiData<ApiKeyItem[]>(
    () =>
      permissions.includes("api_keys.get")
        ? application.identity.execute({ type: "listApiKeys", businessId })
        : Promise.resolve([]),
    `${businessId}:${permissions.join("|")}`,
    [],
  );
  const [businessForm, setBusinessForm] = useState(EMPTY_BUSINESS);
  const [hoursForm, setHoursForm] = useState<OperatingHoursDay[]>([]);
  const [drawer, setDrawer] = useState<"business" | "hours" | "key" | null>(null);
  const [account, setAccount] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
  });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [keyForm, setKeyForm] = useState({
    name: "",
    expiresAtUtc: "",
    permissions: [] as string[],
  });
  const [secret, setSecret] = useState<ApiKeyCreated | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [hoursError, setHoursError] = useState("");
  const [schedulerLinkCopied, setSchedulerLinkCopied] = useState(false);
  const assignablePermissions = permissions.filter((item) => !item.startsWith("api_keys."));
  const apiKeys = Array.isArray(keys.data) ? keys.data : [];

  /**
   * @description Carrega os dados do estabelecimento no formul?rio de configura??es.
   */
  const openBusiness = () => {
    if (!profile.data) return;
    setBusinessForm({
      name: profile.data.name,
      legalName: profile.data.legalName ?? "",
      documentNumber: profile.data.documentNumber ?? "",
      slug: profile.data.slug,
      timeZone: profile.data.timeZone,
    });
    setDrawer("business");
  };
  /**
   * @description Persiste as informa??es gerais do estabelecimento.
   *
   * @param event - Evento disparado pela interface.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const saveBusiness = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      await application.administration.overview.updateProfile(businessId, {
        name: businessForm.name,
        legalName: businessForm.legalName || null,
        documentNumber: businessForm.documentNumber || null,
        slug: businessForm.slug,
        timeZone: businessForm.timeZone,
      });
      setDrawer(null);
      await profile.reload();
      setMessage("Dados do estabelecimento atualizados.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Nao foi possivel salvar.");
    } finally {
      setBusy(false);
    }
  };
  /**
   * @description Normaliza e persiste os hor?rios de funcionamento do estabelecimento.
   *
   * @param event - Evento disparado pela interface.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const saveHours = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const incompleteDay = hoursForm.find(
      (day) => day.isOperating && (!day.opensAt || !day.closesAt),
    );
    if (incompleteDay) {
      setHoursError(
        `Informe abertura e fechamento para ${DAY_LABEL[incompleteDay.dayOfWeek] ?? incompleteDay.dayOfWeek}.`,
      );
      return;
    }

    setHoursError("");
    setBusy(true);
    try {
      await application.administration.overview.replaceOperatingHours(businessId, hoursForm);
      setDrawer(null);
      await hours.reload();
      setMessage("Horario de funcionamento atualizado.");
    } catch (caught) {
      setHoursError(caught instanceof Error ? caught.message : "Nao foi possivel salvar.");
    } finally {
      setBusy(false);
    }
  };
  /**
   * @description Persiste as altera??es do perfil da conta autenticada.
   *
   * @param event - Evento disparado pela interface.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const saveAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      const updated = await application.authentication.execute({
        type: "updateProfile",
        fullName: account.fullName,
        email: account.email,
      });
      useAuthStore.setState({ user: updated });
      setMessage("Perfil atualizado.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Nao foi possivel salvar.");
    } finally {
      setBusy(false);
    }
  };
  /**
   * @description Valida e solicita a altera??o da senha da conta autenticada.
   *
   * @param event - Evento disparado pela interface.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwords.next !== passwords.confirm)
      return setMessage("A confirmacao da nova senha nao confere.");
    setBusy(true);
    try {
      await changePassword(passwords.current, passwords.next);
      setPasswords({ current: "", next: "", confirm: "" });
      setMessage("Senha alterada com sucesso.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Nao foi possivel alterar.");
    } finally {
      setBusy(false);
    }
  };
  /**
   * @description Cria uma nova chave de API e exibe seu valor sens?vel uma ?nica vez.
   *
   * @param event - Evento disparado pela interface.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const createKey = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      const created = await application.identity.execute({
        type: "createApiKey",
        businessId,
        name: keyForm.name.trim(),
        permissions: keyForm.permissions,
        expiresAtUtc: keyForm.expiresAtUtc ? new Date(keyForm.expiresAtUtc).toISOString() : null,
      });
      setSecret(created);
      setDrawer(null);
      setKeyForm({ name: "", expiresAtUtc: "", permissions: [] });
      await keys.reload();
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Nao foi possivel criar.");
    } finally {
      setBusy(false);
    }
  };
  /**
   * @description Rotaciona a chave de API selecionada ap?s confirma??o do usu?rio.
   *
   * @param item - Valor de item utilizado pela opera??o.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const rotate = async (item: ApiKeyItem) => {
    if (
      !(await confirm({
        title: `Rotacionar ${item.name}?`,
        description: "A chave atual deixara de funcionar e um novo segredo sera gerado.",
        confirmLabel: "Rotacionar",
        tone: "primary",
      }))
    )
      return;
    setSecret(
      await application.identity.execute({ type: "rotateApiKey", businessId, id: item.id }),
    );
    await keys.reload();
  };
  /**
   * @description Revoga a chave de API selecionada ap?s confirma??o do usu?rio.
   *
   * @param item - Valor de item utilizado pela opera??o.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const revoke = async (item: ApiKeyItem) => {
    if (
      !(await confirm({
        title: `Revogar ${item.name}?`,
        description: "Integracoes que usam esta chave perderao o acesso imediatamente.",
        confirmLabel: "Revogar",
      }))
    )
      return;
    await application.identity.execute({ type: "revokeApiKey", businessId, id: item.id });
    await keys.reload();
  };
  /**
   * @description Copia o endere?o p?blico de agendamento do estabelecimento ativo.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const copySchedulerLink = async () => {
    try {
      await navigator.clipboard.writeText(publicSchedulerUrl(businessId));
      setSchedulerLinkCopied(true);
      setMessage("Link da agenda copiado.");
    } catch {
      setSchedulerLinkCopied(false);
      setMessage("Nao foi possivel copiar o link. Verifique a permissao do navegador.");
    }
  };

  return (
    <div className="tirr__admin__page">
      <section className="tirr__admin__panel">
        <div className="tirr__admin__panel-header">
          <div>
            <p className="tirr__admin__overline">Preferencias e acesso</p>
            <h2>Configuracoes</h2>
          </div>
          {tab === "integrations" && permissions.includes("api_keys.post") && (
            <button className="btn btn-primary" onClick={() => setDrawer("key")}>
              <Icon name="plus-lg" /> Nova chave
            </button>
          )}
        </div>
        <AdminTabs
          value={tab}
          onChange={setTab}
          items={[
            { value: "business", label: "Estabelecimento", icon: "building" },
            { value: "security", label: "Conta e seguranca", icon: "shield-check" },
            { value: "integrations", label: "Integracoes", icon: "key" },
          ]}
        />
        {message && <div className="tirr__inline-alert">{message}</div>}
        {tab === "business" && (
          <>
            <PageFeedback
              loading={profile.loading || hours.loading}
              error={profile.error || hours.error}
              onRetry={() => void Promise.all([profile.reload(), hours.reload()])}
            />
            {!profile.loading && !profile.error && !profile.data && (
              <AdminEmptyRow
                icon="building-x"
                description="Nao foi possivel encontrar os dados desta empresa."
              >
                Estabelecimento sem perfil
              </AdminEmptyRow>
            )}
            {profile.data && (
              <div className="tirr__settings-grid">
                <section>
                  <div className="tirr__section-heading">
                    <h3>Dados da empresa</h3>
                    <div className="tirr__section-actions">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => void copySchedulerLink()}
                      >
                        <Icon name={schedulerLinkCopied ? "check2" : "copy"} />{" "}
                        {schedulerLinkCopied ? "Link copiado" : "Copiar link da agenda"}
                      </button>
                      {permissions.includes("business.put") && (
                        <button
                          className="tirr__admin__icon-button"
                          onClick={openBusiness}
                          title="Editar"
                          aria-label="Editar dados da empresa"
                        >
                          <Icon name="pencil" />
                        </button>
                      )}
                    </div>
                  </div>
                  <dl className="tirr__details-list">
                    <div>
                      <dt>Nome</dt>
                      <dd>{profile.data.name}</dd>
                    </div>
                    <div>
                      <dt>Razao social</dt>
                      <dd>{profile.data.legalName || "Nao informada"}</dd>
                    </div>
                    <div>
                      <dt>Documento</dt>
                      <dd>{profile.data.documentNumber || "Nao informado"}</dd>
                    </div>
                    <div>
                      <dt>Slug</dt>
                      <dd>{profile.data.slug}</dd>
                    </div>
                    <div>
                      <dt>Fuso horario</dt>
                      <dd>{profile.data.timeZone}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>
                        <StatusPill
                          active={profile.data.status === "active"}
                          label={profile.data.status}
                        />
                      </dd>
                    </div>
                  </dl>
                </section>
                <section>
                  <div className="tirr__section-heading">
                    <h3>Horario de funcionamento</h3>
                    {permissions.includes("availability.put") && (
                      <button
                        className="tirr__admin__icon-button"
                        onClick={() => {
                          setHoursForm(hours.data.map((item) => ({ ...item })));
                          setDrawer("hours");
                        }}
                        title="Editar"
                      >
                        <Icon name="pencil" />
                      </button>
                    )}
                  </div>
                  {hours.data.length ? (
                    <div className="tirr__hours-list">
                      {hours.data.map((item) => (
                        <div key={item.dayOfWeek}>
                          <strong>{DAY_LABEL[item.dayOfWeek]}</strong>
                          <span>
                            {item.isOperating
                              ? `${item.opensAt?.slice(0, 5)} - ${item.closesAt?.slice(0, 5)}`
                              : "Fechado"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <AdminEmptyRow
                      icon="clock"
                      description="Defina os dias e horarios em que o estabelecimento atende."
                    >
                      Horario de funcionamento nao configurado
                    </AdminEmptyRow>
                  )}
                </section>
              </div>
            )}
          </>
        )}
        {tab === "security" && (
          <div className="tirr__settings-grid">
            <form onSubmit={saveAccount}>
              <h3>Perfil global</h3>
              <div className="tirr__drawer-fields">
                <FormField
                  id="account-name"
                  label="Nome completo"
                  value={account.fullName}
                  onChange={(event) => setAccount({ ...account, fullName: event.target.value })}
                  required
                />
                <FormField
                  id="account-email"
                  label="E-mail"
                  type="email"
                  value={account.email}
                  onChange={(event) => setAccount({ ...account, email: event.target.value })}
                  required
                />
                <div className="tirr__readonly-value">
                  <small>Papeis nesta empresa</small>
                  <strong>{roles.length ? roles.join(", ") : "Nenhum papel atribuido"}</strong>
                </div>
                <button className="btn btn-primary" disabled={busy}>
                  Salvar perfil
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => void logoutAll()}
                >
                  Encerrar todas as sessoes
                </button>
              </div>
            </form>
            <form onSubmit={submitPassword}>
              <h3>Alterar senha</h3>
              <div className="tirr__drawer-fields">
                <FormField
                  id="current-password"
                  label="Senha atual"
                  type="password"
                  value={passwords.current}
                  onChange={(event) => setPasswords({ ...passwords, current: event.target.value })}
                  required
                />
                <FormField
                  id="new-password"
                  label="Nova senha"
                  type="password"
                  value={passwords.next}
                  onChange={(event) => setPasswords({ ...passwords, next: event.target.value })}
                  required
                />
                <FormField
                  id="confirm-password"
                  label="Confirmar senha"
                  type="password"
                  value={passwords.confirm}
                  onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })}
                  required
                />
                <button className="btn btn-primary" disabled={busy}>
                  Alterar senha
                </button>
              </div>
            </form>
          </div>
        )}
        {tab === "integrations" && (
          <>
            <PageFeedback
              loading={keys.loading}
              error={keys.error}
              onRetry={() => void keys.reload()}
            />
            <div className="tirr__admin__data-list">
              {apiKeys.map((item) => (
                <article className="tirr__admin__data-row" key={item.id}>
                  <span className="tirr__admin__client-avatar">
                    <Icon name="key" />
                  </span>
                  <div className="tirr__admin__data-main">
                    <h3>{item.name}</h3>
                    <p>
                      {item.prefix}... · {item.permissions.length} permissoes
                    </p>
                  </div>
                  <div>
                    <small>Ultimo uso</small>
                    <span>
                      {item.lastUsedAtUtc
                        ? new Date(item.lastUsedAtUtc).toLocaleString("pt-BR")
                        : "Nunca"}
                    </span>
                  </div>
                  <StatusPill active={item.isActive} />
                  <div className="tirr__row-actions">
                    {permissions.includes("api_keys.put") && item.isActive && (
                      <button
                        className="tirr__admin__icon-button"
                        onClick={() => void rotate(item)}
                        title="Rotacionar"
                      >
                        <Icon name="arrow-repeat" />
                      </button>
                    )}
                    {permissions.includes("api_keys.delete") && item.isActive && (
                      <button
                        className="tirr__admin__icon-button is-danger"
                        onClick={() => void revoke(item)}
                        title="Revogar"
                      >
                        <Icon name="slash-circle" />
                      </button>
                    )}
                  </div>
                </article>
              ))}
              {!keys.loading && !apiKeys.length && (
                <AdminEmptyRow>Nenhuma chave criada.</AdminEmptyRow>
              )}
            </div>
          </>
        )}
      </section>
      <AdminDrawer
        open={drawer === "business"}
        title="Editar estabelecimento"
        onClose={() => setDrawer(null)}
        onSubmit={saveBusiness}
        busy={busy}
      >
        <div className="tirr__drawer-fields">
          <FormField
            id="business-name"
            label="Nome"
            value={businessForm.name}
            onChange={(event) => setBusinessForm({ ...businessForm, name: event.target.value })}
            required
          />
          <FormField
            id="business-legal"
            label="Razao social"
            value={businessForm.legalName}
            onChange={(event) =>
              setBusinessForm({ ...businessForm, legalName: event.target.value })
            }
          />
          <FormField
            id="business-document"
            label="Documento"
            value={businessForm.documentNumber}
            onChange={(event) =>
              setBusinessForm({ ...businessForm, documentNumber: event.target.value })
            }
          />
          <FormField
            id="business-slug"
            label="Slug"
            value={businessForm.slug}
            onChange={(event) => setBusinessForm({ ...businessForm, slug: event.target.value })}
            required
          />
          <FormField
            id="business-timezone"
            label="Fuso horario"
            value={businessForm.timeZone}
            onChange={(event) => setBusinessForm({ ...businessForm, timeZone: event.target.value })}
            required
          />
        </div>
      </AdminDrawer>
      <AdminDrawer
        open={drawer === "hours"}
        title="Horario de funcionamento"
        onClose={() => {
          setDrawer(null);
          setHoursError("");
        }}
        onSubmit={saveHours}
        busy={busy}
      >
        <div className="tirr__drawer-fields">
          {hoursError && (
            <div className="tirr__inline-alert" role="alert">
              <Icon name="exclamation-circle" />
              {hoursError}
            </div>
          )}
          <div className="tirr__hours-editor">
            {hoursForm.map((day, index) => (
              <div key={day.dayOfWeek}>
                <label>
                  <input
                    type="checkbox"
                    checked={day.isOperating}
                    onChange={(event) =>
                      setHoursForm((items) =>
                        items.map((item, itemIndex) =>
                          itemIndex === index
                            ? {
                                ...item,
                                isOperating: event.target.checked,
                                opensAt: item.opensAt || "09:00",
                                closesAt: item.closesAt || "18:00",
                              }
                            : item,
                        ),
                      )
                    }
                  />
                  <strong>{DAY_LABEL[day.dayOfWeek]}</strong>
                </label>
                <input
                  type="time"
                  value={day.opensAt?.slice(0, 5) ?? ""}
                  disabled={!day.isOperating}
                  required={day.isOperating}
                  onChange={(event) =>
                    setHoursForm((items) =>
                      items.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, opensAt: event.target.value } : item,
                      ),
                    )
                  }
                />
                <span>ate</span>
                <input
                  type="time"
                  value={day.closesAt?.slice(0, 5) ?? ""}
                  disabled={!day.isOperating}
                  required={day.isOperating}
                  onChange={(event) =>
                    setHoursForm((items) =>
                      items.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, closesAt: event.target.value } : item,
                      ),
                    )
                  }
                />
              </div>
            ))}
            {!hoursForm.length && (
              <AdminEmptyRow
                icon="clock"
                description="Recarregue a pagina para tentar obter a configuracao da empresa."
              >
                Nenhum dia disponivel para edicao
              </AdminEmptyRow>
            )}
          </div>
        </div>
      </AdminDrawer>
      <AdminDrawer
        open={drawer === "key"}
        title="Nova chave de API"
        description="O segredo sera exibido somente uma vez."
        onClose={() => setDrawer(null)}
        onSubmit={createKey}
        busy={busy}
        submitDisabled={!assignablePermissions.length}
        submitLabel="Criar chave"
      >
        <div className="tirr__drawer-fields">
          <FormField
            id="key-name"
            label="Nome"
            value={keyForm.name}
            onChange={(event) => setKeyForm({ ...keyForm, name: event.target.value })}
            required
          />
          <FormField
            id="key-expiry"
            label="Expira em"
            type="datetime-local"
            value={keyForm.expiresAtUtc}
            onChange={(event) => setKeyForm({ ...keyForm, expiresAtUtc: event.target.value })}
          />
          <fieldset className="tirr__permission-picker">
            <legend>Permissoes</legend>
            {assignablePermissions.map((permission) => (
              <label key={permission}>
                <input
                  type="checkbox"
                  checked={keyForm.permissions.includes(permission)}
                  onChange={(event) =>
                    setKeyForm({
                      ...keyForm,
                      permissions: event.target.checked
                        ? [...keyForm.permissions, permission]
                        : keyForm.permissions.filter((item) => item !== permission),
                    })
                  }
                />
                <span>{permission}</span>
              </label>
            ))}
            {!assignablePermissions.length && (
              <AdminEmptyRow
                icon="shield-x"
                description="Seu papel atual nao possui permissoes delegaveis para uma chave."
              >
                Nenhuma permissao disponivel
              </AdminEmptyRow>
            )}
          </fieldset>
        </div>
      </AdminDrawer>
      <SensitiveValueDialog
        open={Boolean(secret)}
        value={secret?.apiKey ?? ""}
        onClose={() => setSecret(null)}
      />
    </div>
  );
};

export default SettingsPage;
