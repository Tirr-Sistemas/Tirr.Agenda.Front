import type { ReactNode } from "react";

/** Conteúdo e ações aceitos pelo cabeçalho de página. */
type PageHeaderProps = {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
};

/** Padroniza título, descrição, contexto e ações principais de uma página. */
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
