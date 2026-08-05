import Button from "@/presentation/components/Button";
import { useTheme } from "@/presentation/providers/themeContext";

/**
 * @description Alterna entre temas claro e escuro com um nome acessível contextual.
 *
 * @param props - Propriedades recebidas pelo componente.
 * @returns Elemento React renderizado pelo componente.
 */
const ThemeToggle = ({ className = "" }: { className?: string; }) => {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
  return <Button variant="ghost" className={`tirr__admin__icon-button tirr__theme-toggle ${className}`.trim()} onClick={toggleTheme} aria-label={nextLabel} title={nextLabel} icon={theme === "dark" ? "sun" : "moon-stars"} />;
};

export default ThemeToggle;
