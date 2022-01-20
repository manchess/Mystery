import { screen, render, fireEvent } from "@testing-library/react";
import Acusar from "../component/BotonAcusar";

test("al hacer click en Acusar, se llama a la funcion setAcusar con el argumento adecuado", () => {
    const setAcusando = jest.fn();

    render(<Acusar setAcusando={setAcusando} />);

    const boton = screen.getByRole("button");

    fireEvent.click(boton);

    expect(setAcusando).toHaveBeenCalledWith(true);
});
