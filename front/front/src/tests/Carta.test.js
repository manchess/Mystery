import { screen, render } from "@testing-library/react";
import Carta from "../component/Carta";

test("se muestra la imagen adecuada de la carta, con el estilo correcto", () => {
    const carta = "DRACULA";

    render(<Carta carta={carta} />);

    const img = screen.getByRole("img");

    expect(img).toHaveAttribute("src", `/cartas/${carta}.png`);
    expect(img).toHaveAttribute("height", "200px");
    expect(img).toHaveClass("carta");
});
