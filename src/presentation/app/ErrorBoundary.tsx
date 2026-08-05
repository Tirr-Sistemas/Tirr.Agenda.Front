import { Component, type PropsWithChildren } from "react";

export class ErrorBoundary extends Component<PropsWithChildren, { hasError: boolean }> {
  public state = { hasError: false };
  public static getDerivedStateFromError(): { hasError: boolean } { return { hasError: true }; }
  public render(): React.ReactNode { return this.state.hasError ? <main role="alert">Não foi possível carregar a aplicação.</main> : this.props.children; }
}
