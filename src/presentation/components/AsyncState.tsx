import Icon, { type IconName } from "@/presentation/icons/Icon";
import Button from "./Button";

/**
 * @description Estados assíncronos suportados pelo componente de feedback.
 */
type AsyncStateKind = "loading" | "error" | "empty" | "success";

/**
 * @description Propriedades do feedback assíncrono reutilizável.
 */
type AsyncStateProps = {
  kind: AsyncStateKind;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const ICONS: Record<AsyncStateKind, IconName> = {
  loading: "arrow-repeat",
  error: "exclamation-circle",
  empty: "calendar-x",
  success: "check2-circle",
};

/**
 * @description Exibe loading, erro, vazio ou sucesso com semântica e ação opcionais.
 *
 * @param props - Propriedades recebidas pelo componente.
 *
 * @returns Elemento React renderizado pelo componente.
 */
const AsyncState = ({ kind, title, description, actionLabel, onAction }: AsyncStateProps) => (
  <section
    className={`tirr__scheduler-async-state is-${kind}`}
    role={kind === "error" ? "alert" : "status"}
  >
    <span className="tirr__scheduler-async-state__icon" aria-hidden="true">
      <Icon name={ICONS[kind]} size={24} />
    </span>
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
    {actionLabel && onAction && (
      <Button variant="secondary" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </section>
);

export default AsyncState;
