import { type FormEvent, useState } from "react";

import { useAuthStore } from "@/auth/authStore";
import { useApiData } from "@/hook/useApiData";
import { AdminDrawer, AdminEmptyRow, AdminTabs, PageFeedback, StatusPill } from "@/shared/AdminUi";
import FormField from "@/shared/FormField";
import { categoriesApi, overviewApi, servicesApi } from "@/service/api";
import type { ServiceCategory, ServiceSummary } from "@/service/api";
import { formatToBRL } from "@/utils/formatToBRL";

type Tab = "services" | "categories";
const EMPTY_SERVICE = { id: "", serviceCategoryId: "", name: "", description: "", durationInMinutes: 30, price: 0, isActive: true };
const EMPTY_CATEGORY = { id: "", name: "", description: "", isActive: true };

const CatalogPage = () => {
  const businessId = useAuthStore((state) => state.activeBusiness?.businessId ?? "");
  const permissions = useAuthStore((state) => state.permissions);
  const [tab, setTab] = useState<Tab>("services");
  const servicesState = useApiData<ServiceSummary[]>(() => overviewApi.services(businessId), businessId, []);
  const categoriesState = useApiData<ServiceCategory[]>(() => categoriesApi.list(businessId), businessId, []);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
  const [drawer, setDrawer] = useState<"service" | "category" | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const editService = async (summary: ServiceSummary) => {
    setDrawer("service"); setBusy(true); setMessage("");
    try { const item = await servicesApi.get(businessId, summary.serviceId); setServiceForm({ id: item.id, serviceCategoryId: item.serviceCategoryId, name: item.name, description: item.description ?? "", durationInMinutes: item.durationInMinutes, price: item.price, isActive: item.isActive }); }
    catch (caught) { setMessage(caught instanceof Error ? caught.message : "Nao foi possivel carregar o servico."); }
    finally { setBusy(false); }
  };

  const editCategory = async (summary: ServiceCategory) => {
    setDrawer("category"); setBusy(true); setMessage("");
    try { const item = await categoriesApi.get(businessId, summary.id); setCategoryForm({ id: item.id, name: item.name, description: item.description ?? "", isActive: item.isActive }); }
    catch (caught) { setMessage(caught instanceof Error ? caught.message : "Nao foi possivel carregar a categoria."); }
    finally { setBusy(false); }
  };

  const saveService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const input = { serviceCategoryId: serviceForm.serviceCategoryId, name: serviceForm.name.trim(), description: serviceForm.description.trim() || null, durationInMinutes: Number(serviceForm.durationInMinutes), price: Number(serviceForm.price), isActive: serviceForm.isActive };
      if (serviceForm.id) await servicesApi.update(businessId, serviceForm.id, input);
      else await servicesApi.create(businessId, input);
      setDrawer(null); setServiceForm(EMPTY_SERVICE); await servicesState.reload();
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Nao foi possivel salvar o servico."); }
    finally { setBusy(false); }
  };

  const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const input = { name: categoryForm.name.trim(), description: categoryForm.description.trim() || null, isActive: categoryForm.isActive };
      if (categoryForm.id) await categoriesApi.update(businessId, categoryForm.id, input);
      else await categoriesApi.create(businessId, input);
      setDrawer(null); setCategoryForm(EMPTY_CATEGORY); await Promise.all([categoriesState.reload(), servicesState.reload()]);
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Nao foi possivel salvar a categoria."); }
    finally { setBusy(false); }
  };

  const removeService = async (item: ServiceSummary) => { if (!window.confirm(`Excluir ${item.name}?`)) return; try { await servicesApi.remove(businessId, item.serviceId); await servicesState.reload(); } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Nao foi possivel excluir."); } };
  const removeCategory = async (item: ServiceCategory) => { if (!window.confirm(`Excluir ${item.name}?`)) return; try { await categoriesApi.remove(businessId, item.id); await categoriesState.reload(); } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Nao foi possivel excluir."); } };
  const categoryName = (id: string) => categoriesState.data.find((item) => item.id === id)?.name ?? "Sem categoria";

  return <div className="tirr__admin__page">
    {message && <div className="tirr__inline-alert" role="alert"><i className="bi bi-exclamation-circle" />{message}</div>}
    <section className="tirr__admin__panel"><div className="tirr__admin__panel-header"><div><p className="tirr__admin__overline">Oferta de atendimento</p><h2>Catalogo</h2></div>{tab === "services" && permissions.includes("services.post") && <button className="btn btn-primary" onClick={() => { setServiceForm({ ...EMPTY_SERVICE, serviceCategoryId: categoriesState.data.find((item) => item.isActive)?.id ?? "" }); setDrawer("service"); }}><i className="bi bi-plus-lg" /> Novo servico</button>}{tab === "categories" && permissions.includes("service_categories.post") && <button className="btn btn-primary" onClick={() => { setCategoryForm(EMPTY_CATEGORY); setDrawer("category"); }}><i className="bi bi-plus-lg" /> Nova categoria</button>}</div>
      <AdminTabs value={tab} onChange={(value) => setTab(value as Tab)} items={[{ value: "services", label: "Servicos", icon: "bi-scissors" }, { value: "categories", label: "Categorias", icon: "bi-tags" }]} />
      {tab === "services" && <><PageFeedback loading={servicesState.loading || categoriesState.loading} error={servicesState.error || categoriesState.error} onRetry={() => void Promise.all([servicesState.reload(), categoriesState.reload()])} /><div className="tirr__service-grid-v1">{servicesState.data.map((item) => <article className="tirr__admin__service-card" key={item.serviceId}><header><span className="tirr__service-symbol"><i className="bi bi-stars" /></span><StatusPill active={item.isActive} /></header><div><small>{categoryName(item.serviceCategoryId)}</small><h3>{item.name}</h3><p>{item.description || "Sem descricao"}</p></div><dl><div><dt>Duracao</dt><dd>{item.durationInMinutes} min</dd></div><div><dt>Valor</dt><dd>{formatToBRL(item.price)}</dd></div><div><dt>Agendamentos</dt><dd>{item.appointmentCount}</dd></div></dl><footer>{permissions.includes("services.put") && <button className="btn btn-outline-secondary btn-sm" onClick={() => void editService(item)}><i className="bi bi-pencil" /> Editar</button>}{permissions.includes("services.delete") && <button className="tirr__admin__icon-button is-danger" onClick={() => void removeService(item)} aria-label="Excluir"><i className="bi bi-trash" /></button>}</footer></article>)}{!servicesState.loading && !servicesState.data.length && <AdminEmptyRow>Nenhum servico cadastrado.</AdminEmptyRow>}</div></>}
      {tab === "categories" && <><PageFeedback loading={categoriesState.loading} error={categoriesState.error} onRetry={() => void categoriesState.reload()} /><div className="tirr__admin__data-list">{categoriesState.data.map((item) => <article className="tirr__admin__data-row" key={item.id}><span className="tirr__admin__client-avatar"><i className="bi bi-tag" /></span><div className="tirr__admin__data-main"><h3>{item.name}</h3><p>{item.description || "Sem descricao"}</p></div><StatusPill active={item.isActive} /><div className="tirr__row-actions">{permissions.includes("service_categories.put") && <button className="tirr__admin__icon-button" onClick={() => void editCategory(item)} aria-label="Editar"><i className="bi bi-pencil" /></button>}{permissions.includes("service_categories.delete") && <button className="tirr__admin__icon-button is-danger" onClick={() => void removeCategory(item)} aria-label="Excluir"><i className="bi bi-trash" /></button>}</div></article>)}{!categoriesState.loading && !categoriesState.data.length && <AdminEmptyRow>Nenhuma categoria cadastrada.</AdminEmptyRow>}</div></>}
    </section>
    <AdminDrawer open={drawer === "service"} title={serviceForm.id ? "Editar servico" : "Novo servico"} description="Defina categoria, duracao e preco base." onClose={() => setDrawer(null)} onSubmit={saveService} busy={busy} submitDisabled={!categoriesState.data.some((item) => item.isActive || item.id === serviceForm.serviceCategoryId)}><div className="tirr__drawer-fields">{message && <div className="tirr__inline-alert">{message}</div>}<label className="tirr__form-field"><span>Categoria</span><select className="form-select" value={serviceForm.serviceCategoryId} onChange={(event) => setServiceForm({ ...serviceForm, serviceCategoryId: event.target.value })} required><option value="">Selecione</option>{categoriesState.data.filter((item) => item.isActive || item.id === serviceForm.serviceCategoryId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>{!categoriesState.loading && !categoriesState.data.some((item) => item.isActive || item.id === serviceForm.serviceCategoryId) && <AdminEmptyRow icon="bi-tags" description="Crie e ative uma categoria antes de cadastrar um servico.">Nenhuma categoria disponivel</AdminEmptyRow>}<FormField id="service-name" label="Nome" value={serviceForm.name} onChange={(event) => setServiceForm({ ...serviceForm, name: event.target.value })} required /><FormField id="service-description" label="Descricao" value={serviceForm.description} onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })} /><div className="tirr__field-grid"><FormField id="service-duration" label="Duracao (min)" type="number" min={1} value={serviceForm.durationInMinutes} onChange={(event) => setServiceForm({ ...serviceForm, durationInMinutes: Number(event.target.value) })} required /><FormField id="service-price" label="Valor" type="number" min={0} step="0.01" value={serviceForm.price} onChange={(event) => setServiceForm({ ...serviceForm, price: Number(event.target.value) })} required /></div>{serviceForm.id && <label className="tirr__toggle-row"><input type="checkbox" checked={serviceForm.isActive} onChange={(event) => setServiceForm({ ...serviceForm, isActive: event.target.checked })} /><span><strong>Servico ativo</strong><small>Disponivel para novos agendamentos.</small></span></label>}</div></AdminDrawer>
    <AdminDrawer open={drawer === "category"} title={categoryForm.id ? "Editar categoria" : "Nova categoria"} description="Organize os servicos do catalogo." onClose={() => setDrawer(null)} onSubmit={saveCategory} busy={busy}><div className="tirr__drawer-fields"><FormField id="category-name" label="Nome" value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} required /><FormField id="category-description" label="Descricao" value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} />{categoryForm.id && <label className="tirr__toggle-row"><input type="checkbox" checked={categoryForm.isActive} onChange={(event) => setCategoryForm({ ...categoryForm, isActive: event.target.checked })} /><span><strong>Categoria ativa</strong><small>Visivel no catalogo.</small></span></label>}</div></AdminDrawer>
  </div>;
};

export default CatalogPage;
