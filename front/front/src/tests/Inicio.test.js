import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { nuevoJugador, traerPartidas } from "../services/index";
import userEvent from "@testing-library/user-event";
import Inicio from "../component/Inicio";

jest.mock("../services/index");

test("si el input está vacío, no avanza a la lista de partidas", async () => {
    render(<Inicio />);

    let input = screen.getByRole("textbox");

    fireEvent.click(input);
    fireEvent.keyDown(input, { key: "Enter" });

    expect(nuevoJugador).not.toBeCalled();
});

test("al ingresar un nombre ya existente, salta una alerta", async () => {
    render(<Inicio />);

    global.alert = jest.fn();

    let submit = screen.getByRole("button");

    nuevoJugador.mockResolvedValue(Promise.resolve({ status: 404 }));

    fireEvent.click(submit);

    await waitFor(() => expect(global.alert).toHaveBeenCalled());
});

test("el input no deja ingresar mas de 20 caracteres", async () => {
    render(<Inicio />);

    let input = screen.getByRole("textbox");

    nuevoJugador.mockResolvedValue(
        Promise.resolve({ status: 200, data: null })
    );
    traerPartidas.mockResolvedValue(Promise.resolve({ data: [] }));

    userEvent.type(input, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    expect(input.value.length).toBe(20);
});
