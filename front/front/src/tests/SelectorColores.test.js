import { screen, render, fireEvent } from "@testing-library/react";
import SelectorColores from "../component/SelectorColores";

test("Estan todos los colores", () => {
    render(<SelectorColores colores={["red", "blue"]} />);

    const colores = screen.getAllByRole("radio");

    expect(colores).toHaveLength(2);
});

test("Llama correctamente a la funcion setColor", () => {
    const setColor = jest.fn();

    render(<SelectorColores colores={["red", "blue"]} setColor={setColor} />);

    const color = screen.getAllByRole("radio")[1];

    fireEvent.click(color);

    expect(setColor).toHaveBeenCalledWith("blue");
});
