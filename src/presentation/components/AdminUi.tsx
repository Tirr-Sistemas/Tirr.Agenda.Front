import { type FormEvent, type KeyboardEvent, type ReactNode, useEffect, useId, useRef } from "react";

import AsyncState from "./AsyncState";
import Button from "./Button";
import Icon, { type IconName } from "@/presentation/icons/Icon";

/**
 * @description Seleciona o feedback adequado para loading, erro ou coleção vazia.
 *
 * @param props - Propriedades recebidas pelo componente.
 * @returns Elemento React renderizado pelo componente.
 */
export const PageFeedback = ({ loading, error, empty, onRetry }: { loading: boolean; error: string; empty?: boolean; onRetry: () => void; }) => {
  if (loading) return <div className="tirr__admin__feedback"><div className="tirr__resource-skeleton" role="status" aria-label="Carregando" /></div>;
  if (error) return <div className="tirr__admin__feedback"><AsyncState kind="error" title="Nao foi possivel carregar os dados" description={error} actionLabel="Tentar novamente" onAction={onRetry} /></div>;
  if (empty) return <div className="tirr__admin__feedback"><AsyncState kind="empty" title="Nenhum registro encontrado" description="Crie o primeiro registro para comecar." /></div>;
  return null;
};

/**
 * @description Tons semânticos utilizados pelos indicadores administrativos.
 */
type StatusTone = "neutral" | "success" | "warning" | "danger" | "info";

/**
 * @description Exibe um estado textual com cor semântica complementar.
 *
 * @param props - Propriedades recebidas pelo componente.
 * @returns Elemento React renderizado pelo componente.
 */
export const StatusPill = ({ active, label, tone }: { active?: boolean; label?: string; tone?: StatusTone; }) => {
  const resolvedTone = tone ?? (active ? "success" : "neutral");
  return <span className={`tirr__admin__status is-${resolvedTone}`}>{label ?? (active ? "Ativo" : "Inativo")}</span>;
};

/**
 *  @description Drawer de formulário com Escape, bloqueio de scroll e contenção de foco.
 *
 * @param props - Propriedades recebidas pelo componente.
 *
 * @returns Elemento React renderizado pelo componente.
 */
export const AdminDrawer = ({ title, description, open, onClose, onSubmit, busy, submitDisabled, children, submitLabel = "Salvar" }: { title: string; description?: string; open: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; busy?: boolean; submitDisabled?: boolean; children: ReactNode; submitLabel?: string; }) => {
  const titleId = useId();
  const panelRef = useRef<HTMLFormElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("input:not(:disabled), select:not(:disabled), button:not(:disabled)")?.focus());
    /**
     * @description Fecha a interface sobreposta quando a tecla Escape ? acionada.
     *
     * @param event - Evento disparado pela interface.
     */
    const closeOnEscape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") onCloseRef.current(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      returnFocusRef.current?.focus();
    };
  }, [open]);

  /**
   * @description Mant?m a navega??o por teclado contida no di?logo enquanto ele estiver aberto.
   *
   * @param event - Evento disparado pela interface.
   */
  const keepFocusInside = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const controls = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])"));
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  if (!open) return null;
  return <div className="tirr__drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}><button className="tirr__drawer-backdrop" type="button" onClick={onClose} aria-label="Fechar" /><form ref={panelRef} className="tirr__drawer-panel" onSubmit={onSubmit} onKeyDown={keepFocusInside}><header><div><h2 id={titleId}>{title}</h2>{description && <p>{description}</p>}</div><Button variant="ghost" className="tirr__admin__icon-button" onClick={onClose} aria-label="Fechar" icon="x-lg" /></header><div className="tirr__drawer-content">{children}</div><footer><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button type="submit" loading={busy} disabled={submitDisabled}>{submitLabel}</Button></footer></form></div>;
};

/**
 *  @description Abas administrativas com navegação por setas e roving tab index.
 *
 * @param props - Propriedades recebidas pelo componente.
 *
 * @returns Elemento React renderizado pelo componente.
 */
export const AdminTabs = ({
  value,
  onChange,
  items,
  label = "Secoes da pagina",
}: {
  value: string;
  onChange: (value: string) => void;
  items: { value: string; label: string; icon?: IconName; }[];
  label?: string;
}) => {
  /**
   * @description Move o foco entre abas com as teclas de dire??o, respeitando a orienta??o do grupo.
   *
   * @param event - Evento disparado pela interface.
   */
  const navigateTabs = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = items.findIndex((item) => item.value === value);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : (currentIndex + direction + items.length) % items.length;
    const next = items[nextIndex];
    onChange(next.value);
    event.currentTarget.querySelectorAll<HTMLElement>("[role='tab']")[nextIndex]?.focus();
  };
  return (
    <div className="tirr__admin-tabs" role="tablist" aria-label={label} onKeyDown={navigateTabs}>
      {items.map((item) => {
        const active = value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className={active ? "active" : ""}
            onClick={() => onChange(item.value)}
          >
            {item.icon && <Icon name={item.icon} size={17} />}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

/**
 *  @description Estado vazio padronizado para listas e seções administrativas.
 *
 * @param props - Propriedades recebidas pelo componente.
 *
 * @returns Elemento React renderizado pelo componente.
 */
export const AdminEmptyRow = ({ children, description, icon = "inbox" }: { children: ReactNode; description?: string; icon?: IconName; }) => <div className="tirr__admin__empty" role="status"><Icon name={icon} size={28} /><p>{children}</p>{description && <small>{description}</small>}</div>;
