import { screen, render, fireEvent } from "@testing-library/react";
import MostrarPerdioCarta from "../component/MostrarPerdioCarta";

test("Al clickear 'aceptar' se llama correctamente a la funcion: setPerdioBruja", () => {
    const setPerdioBruja = jest.fn();

    render(<MostrarPerdioCarta setPerdioBruja={setPerdioBruja} />);

    const boton = screen.getByRole("button");

    fireEvent.click(boton);

    expect(setPerdioBruja).toHaveBeenCalledWith(null);
});
