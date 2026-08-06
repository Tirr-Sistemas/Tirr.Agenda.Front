import type { ReactNode, SVGAttributes } from "react";

/**
 * @description Nomes suportados pela biblioteca local de ícones SVG.
 */
export type IconName =
  | "arrow-repeat" | "arrow-right" | "box-arrow-right"
  | "building" | "building-x"
  | "calendar2-check-fill" | "calendar2-x" | "calendar3" | "calendar-check" | "calendar-plus" | "calendar-x"
  | "cash-stack" | "check2" | "check2-circle" | "check-circle-fill"
  | "chevron-down" | "chevron-left" | "chevron-right"
  | "clock" | "clock-history" | "copy" | "envelope" | "exclamation-circle"
  | "eye" | "eye-slash" | "grid" | "inbox" | "key" | "key-fill" | "lock"
  | "moon-stars" | "pencil" | "people" | "person" | "person-badge" | "person-x"
  | "plus-lg" | "scissors" | "search" | "shield-check" | "shield-lock" | "shield-x"
  | "slash-circle" | "sliders" | "stars" | "sun" | "tag" | "tags"
  | "three-dots" | "trash" | "x-lg";

/**
 * @description Propriedades do ícone, incluindo tamanho e nome acessível opcional.
 */
type IconProps = Omit<SVGAttributes<SVGElement>, "name"> & {
  name: IconName;
  size?: number;
  label?: string;
};

const calendar = <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></>;
const user = <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>;
const check = <path d="m5 12 4 4L19 6" />;
const close = <path d="m6 6 12 12M18 6 6 18" />;
const shield = <path d="M12 3 20 6v5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z" />;

const GLYPHS: Record<IconName, ReactNode> = {
  "arrow-repeat": <><path d="M20 7h-5V2" /><path d="M4.9 17A8 8 0 0 0 19 14M4 17h5v5" /><path d="M19.1 7A8 8 0 0 0 5 10" /></>,
  "arrow-right": <><path d="M5 12h14" /><path d="m14 6 6 6-6 6" /></>,
  "box-arrow-right": <><path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5" /><path d="M13 8l4 4-4 4M17 12H8" /></>,
  "building": <><path d="M4 21V5l8-3 8 3v16" /><path d="M9 21v-4h6v4M8 7h1M8 11h1M15 7h1M15 11h1M2 21h20" /></>,
  "building-x": <><path d="M4 21V5l8-3 8 3v8M2 21h12" /><path d="m16 16 5 5m0-5-5 5" /></>,
  "calendar2-check-fill": <>{calendar}<path d="m8 15 2.5 2.5L16 12" /></>,
  "calendar2-x": <>{calendar}<path d="m9 14 6 6m0-6-6 6" /></>,
  "calendar3": calendar,
  "calendar-check": <>{calendar}<path d="m8 15 2.5 2.5L16 12" /></>,
  "calendar-plus": <>{calendar}<path d="M12 13v6M9 16h6" /></>,
  "calendar-x": <>{calendar}<path d="m9 14 6 6m0-6-6 6" /></>,
  "cash-stack": <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M17 14h.01" /><circle cx="12" cy="12" r="2.5" /></>,
  "check2": check,
  "check2-circle": <><circle cx="12" cy="12" r="9" />{check}</>,
  "check-circle-fill": <><circle cx="12" cy="12" r="9" />{check}</>,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  "clock": <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  "clock-history": <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
  "copy": <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  "envelope": <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  "exclamation-circle": <><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></>,
  "eye": <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
  "eye-slash": <><path d="m3 3 18 18" /><path d="M10.5 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.2 2.8M6.2 6.2A16 16 0 0 0 2.5 12s3.5 6 9.5 6a10 10 0 0 0 3-.5" /></>,
  "grid": <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  "inbox": <><path d="M4 4h16l2 11v5H2v-5L4 4Z" /><path d="M2 15h5l2 3h6l2-3h5" /></>,
  "key": <><circle cx="8" cy="15" r="4" /><path d="m11 12 8-8M16 7l2 2M14 9l2 2" /></>,
  "key-fill": <><circle cx="8" cy="15" r="4" /><path d="m11 12 8-8M16 7l2 2M14 9l2 2" /></>,
  "lock": <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  "moon-stars": <><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" /><path d="M19 2.5v5M16.5 5h5" /></>,
  "pencil": <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" /><path d="m14 7 3 3" /></>,
  "people": <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5" /></>,
  "person": user,
  "person-badge": <><circle cx="9" cy="7.5" r="3.5" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><circle cx="18" cy="16.5" r="3.5" /><path d="m16.5 16.5 1 1 2-2" /></>,
  "person-x": <>{user}<path d="m16 14 5 5m0-5-5 5" /></>,
  "plus-lg": <path d="M12 5v14M5 12h14" />,
  "scissors": <><circle cx="6" cy="7" r="3" /><circle cx="6" cy="17" r="3" /><path d="m8.5 8.5 11 7.5M8.5 15.5 19.5 8" /></>,
  "search": <><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></>,
  "shield-check": <>{shield}{check}</>,
  "shield-lock": <>{shield}<rect x="9" y="11" width="6" height="5" rx="1" /><path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" /></>,
  "shield-x": <>{shield}{close}</>,
  "slash-circle": <><circle cx="12" cy="12" r="9" /><path d="m5.6 5.6 12.8 12.8" /></>,
  "sliders": <><path d="M4 6h8M16 6h4M4 12h3M11 12h9M4 18h10M18 18h2" /><circle cx="14" cy="6" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="16" cy="18" r="2" /></>,
  "stars": <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" /><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" /></>,
  "sun": <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  "tag": <><path d="M3 12V4h8l10 10-7 7L3 12Z" /><circle cx="8" cy="8" r="1" /></>,
  "tags": <><path d="M3 12V4h8l9 9-6 6L3 12Z" /><path d="M14 5h2l5 5M7 8h.01" /></>,
  "three-dots": <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  "trash": <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" /></>,
  "x-lg": close,
};

/**
 * @description Renderiza um SVG tipado, decorativo por padrão e nomeável via `label`.
 *
 * @param props - Propriedades recebidas pelo componente.
 * @returns Elemento React renderizado pelo componente.
 */
export const Icon = ({ name, size = 20, label, className = "", ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`tirr-icon ${className}`.trim()}
    aria-hidden={label ? undefined : true}
    aria-label={label}
    role={label ? "img" : undefined}
    focusable="false"
    {...props}
  >
    {label && <title>{label}</title>}
    {GLYPHS[name]}
  </svg>
);

export default Icon;
