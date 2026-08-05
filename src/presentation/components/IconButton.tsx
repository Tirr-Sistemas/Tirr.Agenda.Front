import type { ButtonHTMLAttributes } from "react";

import Icon, { type IconName } from "@/presentation/icons/Icon";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  readonly icon: IconName;
  readonly label: string;
  readonly tone?: "neutral" | "danger";
  readonly size?: "sm" | "md";
};

const IconButton = ({ icon, label, tone = "neutral", size = "md", className = "", type = "button", ...props }: IconButtonProps) => (
  <button
    type={type}
    className={`tirr-icon-button is-${tone} is-${size} ${className}`.trim()}
    aria-label={label}
    title={label}
    {...props}
  >
    <Icon name={icon} size={size === "sm" ? 17 : 20} />
  </button>
);

export default IconButton;
