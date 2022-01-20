import { screen, render } from "@testing-library/react";
import Dado from "../component/Dado";

test("el dado muestra el numero asignado", () => {
    render(<Dado numero={3} />);

    expect(screen.getByText("3")).toBeInTheDocument();
});

test("el dado tiene los estilos adecuados", () => {
    render(<Dado numero={3} />);

    const numero = screen.getByTestId("dado");

    expect(numero).toHaveClass("resultadoDado");
});
