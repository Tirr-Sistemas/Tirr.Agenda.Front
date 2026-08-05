type AsyncStateKind = "loading" | "error" | "empty" | "success";

type AsyncStateProps = {
  kind: AsyncStateKind;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const ICONS: Record<AsyncStateKind, string> = {
  loading: "bi-arrow-repeat",
  error: "bi-exclamation-circle",
  empty: "bi-calendar-x",
  success: "bi-check2-circle",
};

const AsyncState = ({ kind, title, description, actionLabel, onAction }: AsyncStateProps) => (
  <section
    className={`tirr__scheduler-async-state is-${kind}`}
    role={kind === "error" ? "alert" : "status"}
  >
    <span className="tirr__scheduler-async-state__icon" aria-hidden="true">
      <i className={`bi ${ICONS[kind]}`} />
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
import Button from "./Button";
