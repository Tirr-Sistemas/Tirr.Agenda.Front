import Button from "@/shared/Button";
import { useTheme } from "@/theme/themeContext";

const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
  return <Button variant="ghost" className={`tirr__admin__icon-button tirr__theme-toggle ${className}`.trim()} onClick={toggleTheme} aria-label={nextLabel} title={nextLabel} icon={theme === "dark" ? "bi-sun" : "bi-moon-stars"} />;
};

export default ThemeToggle;
