import Icon from "@/presentation/icons/Icon";
import ThemeToggle from "@/presentation/components/ThemeToggle";

const Header = () => (
  <header className="tirr__scheduler-topbar">
    <div className="tirr__scheduler-topbar__content">
      <div className="tirr__scheduler-topbar__brand">
        <span aria-hidden="true"><Icon name="calendar2-check-fill" /></span>
        <strong>Tirr Agenda</strong>
      </div>
      <span className="tirr__scheduler-topbar__context">Agendamento online</span>
      <ThemeToggle />
    </div>
  </header>
);

export default Header;
