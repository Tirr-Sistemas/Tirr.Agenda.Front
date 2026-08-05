import type { ButtonHTMLAttributes } from "react";

import Icon, { type IconName } from "@/presentation/icons/Icon";

/**
 * @description Propriedades de uma ação compacta representada somente por ícone.
 */
type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  readonly icon: IconName;
  readonly label: string;
  readonly tone?: "neutral" | "danger";
  readonly size?: "sm" | "md";
};

/**
 * @description Botão de ícone que exige nome acessível e oferece tom de perigo.
 *
 * @param props - Propriedades recebidas pelo componente.
 * @returns Elemento React renderizado pelo componente.
 */
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
