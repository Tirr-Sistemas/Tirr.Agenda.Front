import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Button from "@/presentation/components/Button";
import Icon from "@/presentation/icons/Icon";

describe("presentation primitives", () => {
  it("renders decorative icons outside the accessibility tree", () => {
    const markup = renderToStaticMarkup(<Icon name="calendar-check" />);
    expect(markup).toContain("aria-hidden=\"true\"");
    expect(markup).toContain("class=\"tirr-icon\"");
  });

  it("renders labeled icons as images", () => {
    const markup = renderToStaticMarkup(<Icon name="search" label="Pesquisar" />);
    expect(markup).toContain("role=\"img\"");
    expect(markup).toContain("<title>Pesquisar</title>");
  });

  it("exposes loading buttons as busy and disabled", () => {
    const markup = renderToStaticMarkup(<Button loading icon="plus-lg">Salvar</Button>);
    expect(markup).toContain("aria-busy=\"true\"");
    expect(markup).toContain("disabled=\"\"");
    expect(markup).toContain("tirr__button-spinner");
    expect(markup).toContain("Salvar");
  });
});
