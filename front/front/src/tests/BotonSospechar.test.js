import { screen, render, fireEvent } from "@testing-library/react";
import Sospechar from "../component/BotonSospechar";

test("al hacer click en Sospechar, se llama a la funcion setSospechar con el argumento adecuado", () => {
    const setSospechando = jest.fn();

    render(<Sospechar setSospechando={setSospechando} />);

    const boton = screen.getByRole("button");

    fireEvent.click(boton);

    expect(setSospechando).toHaveBeenCalledWith(true);
});
