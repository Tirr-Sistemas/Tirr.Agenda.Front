import { Component, type PropsWithChildren } from "react";

/**
 * @description Captura falhas não tratadas da árvore React e exibe um estado seguro.
 */
export class ErrorBoundary extends Component<PropsWithChildren, { hasError: boolean; }> {
  public state = { hasError: false };
  /**
   * @description Converte uma falha de renderização em estado seguro para a barreira de erros.
   *
   * @returns Verdadeiro quando a condição avaliada for atendida.
   */
  public static getDerivedStateFromError(): { hasError: boolean; } { return { hasError: true }; }
  /**
   * @description Renderiza o conteúdo protegido ou a experiência de recuperação após uma falha.
   *
   * @returns Resultado produzido pela operação.
   */
  public render(): React.ReactNode { return this.state.hasError ? <main role="alert">Não foi possível carregar a aplicação.</main> : this.props.children; }
}
