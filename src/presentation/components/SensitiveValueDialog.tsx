import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

import Button from "@/presentation/components/Button";
import Icon from "@/presentation/icons/Icon";

type SensitiveValueDialogProps = {
  readonly open: boolean;
  readonly value: string;
  readonly onClose: () => void;
};

const SensitiveValueDialog = ({ open, value, onClose }: SensitiveValueDialogProps) => {
  const [copied, setCopied] = useState(false);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeRef.current?.focus());
    const handleEscape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
      returnFocusRef.current?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  const keepFocusInside = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const controls = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), [tabindex]:not([tabindex='-1'])"));
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return <div className="tirr__secret-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
    <button className="tirr__secret-dialog__backdrop" type="button" aria-label="Fechar" onClick={onClose} />
    <div ref={panelRef} onKeyDown={keepFocusInside}>
      <span className="tirr__secret-dialog__icon"><Icon name="key-fill" size={26} /></span>
      <div><h2 id={titleId}>Guarde esta chave agora</h2><p>Por seguranca, ela nao sera exibida novamente.</p></div>
      <code>{value}</code>
      <p className="visually-hidden" role="status" aria-live="polite">{copied ? "Chave copiada" : ""}</p>
      <footer>
        <Button variant="secondary" icon={copied ? "check2" : "copy"} onClick={() => void copy()}>{copied ? "Copiada" : "Copiar chave"}</Button>
        <Button ref={closeRef} onClick={onClose}>Ja guardei</Button>
      </footer>
    </div>
  </div>;
};

export default SensitiveValueDialog;
