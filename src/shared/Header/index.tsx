import ThemeToggle from "@/shared/ThemeToggle";

const Header = () => {
  return (
    <header className="tirr__scheduler-topbar">
      <div className="tirr__scheduler-topbar__content">
        <div className="tirr__scheduler-topbar__brand">
          <span aria-hidden="true"><i className="bi bi-calendar2-check-fill" /></span>
          <strong>Tirr Agenda</strong>
        </div>

        <span className="tirr__scheduler-topbar__context">Agendamento online</span>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
