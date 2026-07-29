import type { ReactNode } from "react";

type FixedActionBarProps = {
  children: ReactNode;
};

const FixedActionBar = ({ children }: FixedActionBarProps) => (
  <footer className="tirr__scheduler-action-bar">
    <div className="tirr__scheduler-action-bar__content">{children}</div>
  </footer>
);

export default FixedActionBar;
