import { screen, render, fireEvent } from "@testing-library/react";
import Iniciar from "../component/BotonIniciar";
import { iniciarPartida } from "../services/index";

jest.mock("../services/index");

test("cuando hay menos de 2 jugadores en la partida, el boton está desactivado", () => {
    render(<Iniciar cantjugadores={1} />);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
});

test("cuando hay 2 o mas jugadores en la partida, el boton está habilitado", () => {
    render(<Iniciar cantjugadores={2} />);

    const button = screen.getByRole("button");

    expect(button).not.toBeDisabled();
});

test("al clickear el boton Iniciar, se llama a la función iniciarPartida con los argumentos adecuados", () => {
    render(<Iniciar cantjugadores={2} id_partida={1} />);

    iniciarPartida.mockResolvedValue(Promise.resolve(true));

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(iniciarPartida).toHaveBeenCalledWith({ id_partida: 1 });
});
