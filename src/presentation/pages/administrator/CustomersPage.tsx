import Icon from "@/presentation/icons/Icon";
import { type FormEvent, useMemo, useState } from "react";

import { useAuthStore } from "@/presentation/stores/authStore";
import { useApplication } from "@/presentation/hooks/useApplication";
import { useApiData } from "@/presentation/hooks/useApiData";
import {
  AdminDrawer,
  AdminEmptyRow,
  PageFeedback,
  StatusPill,
} from "@/presentation/components/AdminUi";
import FormField from "@/presentation/components/FormField";
import type { CustomerSummary } from "@/administration/application/dtos";
import { phoneMask } from "@/presentation/utils/maskPhone";
import { useConfirm } from "@/presentation/hooks/useConfirm";

const EMPTY_FORM = { id: "", fullName: "", email: "", phone: "", isActive: true };

/**
 * @description Lista e mantém os clientes usados nos agendamentos administrativos.
 *
 * @returns Elemento React renderizado pelo componente.
 */
const CustomersPage = () => {
  const application = useApplication();
  const confirm = useConfirm();
  const businessId = useAuthStore((state) => state.activeBusiness?.businessId ?? "");
  const canCreate = useAuthStore((state) => state.permissions.includes("customers.post"));
  const canUpdate = useAuthStore((state) => state.permissions.includes("customers.put"));
  const canDelete = useAuthStore((state) => state.permissions.includes("customers.delete"));
  const {
    data: customers,
    loading,
    error,
    reload,
  } = useApiData<CustomerSummary[]>(
    () => application.administration.overview.customers(businessId),
    businessId,
    [],
  );
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [operationError, setOperationError] = useState("");

  /**
   * @description Deriva a coleção visível a partir dos filtros atualmente selecionados.
   *
   * @returns Coleção resultante da operação.
   */
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return customers.filter(
      (item) =>
        !value ||
        `${item.fullName} ${item.email ?? ""} ${item.phone}`.toLowerCase().includes(value),
    );
  }, [customers, query]);

  /**
   * @description Preenche o formul?rio com o registro selecionado para edi??o.
   *
   * @param summary - Valor de summary utilizado pela opera??o.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const edit = async (summary: CustomerSummary) => {
    setBusy(true);
    setOperationError("");
    setDrawerOpen(true);
    try {
      const item = await application.administration.customers.get(businessId, summary.customerId);
      setForm({
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        isActive: item.isActive,
      });
    } catch (caught) {
      setOperationError(
        caught instanceof Error ? caught.message : "Nao foi possivel carregar o cliente.",
      );
    } finally {
      setBusy(false);
    }
  };

  /**
   * @description Valida e envia o formul?rio da p?gina, sincronizando dados e mensagens de erro.
   *
   * @param event - Evento disparado pela interface.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setOperationError("");
    try {
      const input = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/\D/g, ""),
        isActive: form.isActive,
      };
      if (form.id) await application.administration.customers.update(businessId, form.id, input);
      else await application.administration.customers.create(businessId, input);
      setDrawerOpen(false);
      setForm(EMPTY_FORM);
      await reload();
    } catch (caught) {
      setOperationError(
        caught instanceof Error ? caught.message : "Nao foi possivel salvar o cliente.",
      );
    } finally {
      setBusy(false);
    }
  };

  /**
   * @description Confirma e remove o registro selecionado por meio do caso de uso correspondente.
   *
   * @param item - Valor de item utilizado pela opera??o.
   *
   * @returns Promessa resolvida com o resultado da opera??o.
   */
  const remove = async (item: CustomerSummary) => {
    if (
      !(await confirm({
        title: `Excluir ${item.fullName}?`,
        description: "O cadastro do cliente sera removido permanentemente.",
        confirmLabel: "Excluir",
      }))
    )
      return;
    try {
      await application.administration.customers.remove(businessId, item.customerId);
      await reload();
    } catch (caught) {
      setOperationError(
        caught instanceof Error ? caught.message : "Nao foi possivel excluir o cliente.",
      );
    }
  };

  const activeCount = customers.filter((item) => item.isActive).length;
  const appointments = customers.reduce((total, item) => total + item.appointmentCount, 0);

  return (
    <div className="tirr__admin__page">
      <section className="tirr__admin__stats" aria-label="Resumo de clientes">
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon">
            <Icon name="people" />
          </span>
          <div>
            <small>Clientes ativos</small>
            <strong>{activeCount}</strong>
          </div>
        </article>
        <article className="tirr__admin__stat-card">
          <span className="tirr__admin__stat-icon">
            <Icon name="calendar-check" />
          </span>
          <div>
            <small>Agendamentos</small>
            <strong>{appointments}</strong>
          </div>
        </article>
      </section>
      {operationError && (
        <div className="tirr__inline-alert" role="alert">
          <Icon name="exclamation-circle" />
          {operationError}
        </div>
      )}
      <section className="tirr__admin__panel">
        <div className="tirr__admin__panel-header tirr__admin__list-header tirr__customers-header">
          <div>
            <p className="tirr__admin__overline">Base de relacionamento</p>
            <h2>Clientes</h2>
          </div>
          <div className="tirr__admin__toolbar">
            <label className="tirr__admin__search">
              <Icon name="search" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar cliente"
                aria-label="Buscar cliente"
              />
            </label>
            {canCreate && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setDrawerOpen(true);
                }}
              >
                <Icon name="plus-lg" /> Novo cliente
              </button>
            )}
          </div>
        </div>
        <PageFeedback loading={loading} error={error} onRetry={() => void reload()} />
        {!loading && !error && (
          <div className="tirr__admin__data-list">
            {filtered.map((item) => (
              <article key={item.customerId} className="tirr__admin__data-row">
                <span className="tirr__admin__client-avatar">
                  {item.fullName
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="tirr__admin__data-main">
                  <h3>{item.fullName}</h3>
                  <p>{item.email || "Sem e-mail"}</p>
                </div>
                <div>
                  <small>Telefone</small>
                  <span>{phoneMask(item.phone)}</span>
                </div>
                <div>
                  <small>Ultimo servico</small>
                  <span>{item.lastServiceName || "Sem atendimento"}</span>
                </div>
                <div>
                  <small>Agendamentos</small>
                  <span>{item.appointmentCount}</span>
                </div>
                <StatusPill active={item.isActive} />
                <div className="tirr__row-actions">
                  {canUpdate && (
                    <button
                      className="tirr__admin__icon-button"
                      onClick={() => void edit(item)}
                      aria-label={`Editar ${item.fullName}`}
                    >
                      <Icon name="pencil" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      className="tirr__admin__icon-button is-danger"
                      onClick={() => void remove(item)}
                      aria-label={`Excluir ${item.fullName}`}
                    >
                      <Icon name="trash" />
                    </button>
                  )}
                </div>
              </article>
            ))}
            {!filtered.length && <AdminEmptyRow>Nenhum cliente encontrado.</AdminEmptyRow>}
          </div>
        )}
      </section>
      <AdminDrawer
        open={drawerOpen}
        title={form.id ? "Editar cliente" : "Novo cliente"}
        description="Dados de contato usados nos agendamentos."
        onClose={() => setDrawerOpen(false)}
        onSubmit={submit}
        busy={busy}
      >
        <div className="tirr__drawer-fields">
          {operationError && <div className="tirr__inline-alert">{operationError}</div>}
          <FormField
            id="client-name"
            label="Nome completo"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            required
          />
          <FormField
            id="client-email"
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <FormField
            id="client-phone"
            label="Telefone"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: phoneMask(event.target.value) })}
            required
          />
          {form.id && (
            <label className="tirr__toggle-row">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
              />
              <span>
                <strong>Cliente ativo</strong>
                <small>Permite novos agendamentos.</small>
              </span>
            </label>
          )}
        </div>
      </AdminDrawer>
    </div>
  );
};

export default CustomersPage;
