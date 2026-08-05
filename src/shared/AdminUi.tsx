import { type FormEvent, type KeyboardEvent, type ReactNode, useEffect, useId, useRef } from "react";

import AsyncState from "./AsyncState";
import Button from "./Button";

export const PageFeedback = ({ loading, error, empty, onRetry }: { loading: boolean; error: string; empty?: boolean; onRetry: () => void }) => {
  if (loading) return <div className="tirr__admin__feedback"><div className="tirr__resource-skeleton" role="status" aria-label="Carregando" /></div>;
  if (error) return <div className="tirr__admin__feedback"><AsyncState kind="error" title="Nao foi possivel carregar os dados" description={error} actionLabel="Tentar novamente" onAction={onRetry} /></div>;
  if (empty) return <div className="tirr__admin__feedback"><AsyncState kind="empty" title="Nenhum registro encontrado" description="Crie o primeiro registro para comecar." /></div>;
  return null;
};

type StatusTone = "neutral" | "success" | "warning" | "danger" | "info";

export const StatusPill = ({ active, label, tone }: { active?: boolean; label?: string; tone?: StatusTone }) => {
  const resolvedTone = tone ?? (active ? "success" : "neutral");
  return <span className={`tirr__admin__status is-${resolvedTone}`}>{label ?? (active ? "Ativo" : "Inativo")}</span>;
};

export const AdminDrawer = ({ title, description, open, onClose, onSubmit, busy, submitDisabled, children, submitLabel = "Salvar" }: { title: string; description?: string; open: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; busy?: boolean; submitDisabled?: boolean; children: ReactNode; submitLabel?: string }) => {
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
    const closeOnEscape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") onCloseRef.current(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      returnFocusRef.current?.focus();
    };
  }, [open]);

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
  return <div className="tirr__drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}><button className="tirr__drawer-backdrop" type="button" onClick={onClose} aria-label="Fechar" /><form ref={panelRef} className="tirr__drawer-panel" onSubmit={onSubmit} onKeyDown={keepFocusInside}><header><div><h2 id={titleId}>{title}</h2>{description && <p>{description}</p>}</div><Button variant="ghost" className="tirr__admin__icon-button" onClick={onClose} aria-label="Fechar" icon="bi-x-lg" /></header><div className="tirr__drawer-content">{children}</div><footer><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button type="submit" loading={busy} disabled={submitDisabled}>{submitLabel}</Button></footer></form></div>;
};

export const AdminTabs = ({ value, onChange, items }: { value: string; onChange: (value: string) => void; items: { value: string; label: string; icon?: string }[] }) => {
  const navigateTabs = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentIndex = items.findIndex((item) => item.value === value);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = items[(currentIndex + direction + items.length) % items.length];
    onChange(next.value);
    event.currentTarget.querySelectorAll<HTMLElement>("[role='tab']")[items.indexOf(next)]?.focus();
  };
  return <div className="tirr__admin-tabs" role="tablist" onKeyDown={navigateTabs}>{items.map((item) => <button key={item.value} type="button" role="tab" aria-selected={value === item.value} tabIndex={value === item.value ? 0 : -1} className={value === item.value ? "active" : ""} onClick={() => onChange(item.value)}>{item.icon && <i className={`bi ${item.icon}`} aria-hidden="true" />}{item.label}</button>)}</div>;
};

export const AdminEmptyRow = ({ children, description, icon = "bi-inbox" }: { children: ReactNode; description?: string; icon?: string }) => <div className="tirr__admin__empty" role="status"><i className={`bi ${icon}`} aria-hidden="true" /><p>{children}</p>{description && <small>{description}</small>}</div>;
