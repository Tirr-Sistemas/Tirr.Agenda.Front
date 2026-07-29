type SchedulerPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

const SchedulerPageHeader = ({ eyebrow, title, description }: SchedulerPageHeaderProps) => (
  <header className="tirr__scheduler-page-header">
    <p className="tirr__scheduler-page-header__eyebrow">{eyebrow}</p>
    <h1>{title}</h1>
    <p className="tirr__scheduler-page-header__description">{description}</p>
  </header>
);

export default SchedulerPageHeader;
