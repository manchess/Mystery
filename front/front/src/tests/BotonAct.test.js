import { fireEvent, screen, render } from "@testing-library/react";
import BotonAct from "../component/BotonAct";

test("al clickear el boton Actualizar, llama a la funcion obtPartidas", () => {
    const obtPartidas = jest.fn();

    render(<BotonAct actpartidas={obtPartidas} />);

    const boton = screen.getByRole("button");

    fireEvent.click(boton);

    expect(obtPartidas).toHaveBeenCalled();
});
