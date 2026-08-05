import type { ReactNode } from "react";

type PageHeaderProps = {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
};

const PageHeader = ({ eyebrow, title, description, actions }: PageHeaderProps) => (
  <header className="tirr-page-header">
    <div>
      {eyebrow && <span className="tirr-page-header__eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {actions && <div className="tirr-page-header__actions">{actions}</div>}
  </header>
);

export default PageHeader;
