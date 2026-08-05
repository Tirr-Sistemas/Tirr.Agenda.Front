import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from "react";

import Button from "@/presentation/components/Button";
import Icon from "@/presentation/icons/Icon";
import { ConfirmContext, type ConfirmOptions } from "@/presentation/providers/ConfirmContext";

/**
 * @description Confirmação aberta e função usada para resolver sua Promise.
 */
type PendingConfirmation = ConfirmOptions & { readonly resolve: (confirmed: boolean) => void; };
/**
 * @description Orquestra confirmações acessíveis e devolve o foco ao acionador.
 *
 * @param props - Propriedades recebidas pelo componente.
 * @returns Elemento React renderizado pelo componente.
 */
export const ConfirmProvider = ({ children }: { readonly children: ReactNode; }) => {
  const [pending, setPending] = useState<PendingConfirmation | null>(null);
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  /**
   * @description Abre o diálogo de confirmação e devolve uma promessa com a decisão do usuário.
   *
   * @param options - Valor de options utilizado pela operação.
   * @returns Promessa resolvida com o resultado da operação.
   */
  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => {
    returnFocusRef.current = document.activeElement as HTMLElement;
    setPending({ ...options, resolve });
  }), []);

  /**
   * @description Fecha a navegação responsiva e restaura o foco no acionador.
   *
   * @param value - Valor que será processado.
   */
  const close = useCallback((value: boolean) => {
    setPending((current) => {
      current?.resolve(value);
      return null;
    });
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!pending) return;
    confirmRef.current?.focus();
    /**
     * @description Trata a navegação por teclado do diálogo e preserva o foco dentro da interface.
     *
     * @param event - Evento disparado pela interface.
     */
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { close(false); return; }
      if (event.key !== "Tab" || !panelRef.current) return;
      const controls = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), [tabindex]:not([tabindex='-1'])"));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, pending]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <div className="tirr-confirm" role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={`${titleId}-description`}>
          <button type="button" className="tirr-confirm__backdrop" aria-label="Cancelar" onClick={() => close(false)} />
          <section ref={panelRef} className="tirr-confirm__panel">
            <span className={`tirr-confirm__icon is-${pending.tone ?? "danger"}`}><Icon name={pending.tone === "primary" ? "arrow-repeat" : "trash"} size={24} /></span>
            <div><h2 id={titleId}>{pending.title}</h2><p id={`${titleId}-description`}>{pending.description}</p></div>
            <footer>
              <Button variant="secondary" onClick={() => close(false)}>Cancelar</Button>
              <Button ref={confirmRef} variant={pending.tone === "primary" ? "primary" : "danger"} onClick={() => close(true)}>{pending.confirmLabel ?? "Confirmar"}</Button>
            </footer>
          </section>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
