import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Icon, { type IconName } from "@/presentation/icons/Icon";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  loading?: boolean;
  icon?: IconName;
  endIcon?: IconName;
  children?: ReactNode;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-outline-secondary",
  danger: "btn-outline-danger",
  ghost: "btn-ghost",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "primary", size = "md", loading = false, icon, endIcon, disabled, className = "", children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={`btn ${VARIANT_CLASS[variant]} ${size === "sm" ? "btn-sm" : ""} ${className}`.trim()}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...props}
  >
    {loading ? <span className="tirr__button-spinner" aria-hidden="true" /> : icon ? <Icon name={icon} size={size === "sm" ? 16 : 18} /> : null}
    {children}
    {!loading && endIcon ? <Icon name={endIcon} size={size === "sm" ? 16 : 18} /> : null}
  </button>
));

Button.displayName = "Button";

export default Button;
