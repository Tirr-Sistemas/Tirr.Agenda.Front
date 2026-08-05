import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  loading?: boolean;
  icon?: string;
  children?: ReactNode;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-outline-secondary",
  danger: "btn-outline-danger",
  ghost: "btn-ghost",
};

const Button = ({ variant = "primary", size = "md", loading = false, icon, disabled, className = "", children, ...props }: ButtonProps) => (
  <button
    type="button"
    className={`btn ${VARIANT_CLASS[variant]} ${size === "sm" ? "btn-sm" : ""} ${className}`.trim()}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...props}
  >
    {loading ? <span className="tirr__button-spinner" aria-hidden="true" /> : icon ? <i className={`bi ${icon}`} aria-hidden="true" /> : null}
    {children}
  </button>
);

export default Button;
