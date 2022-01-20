import { entrarRecinto } from "../services/index";
import { screen, render, fireEvent } from "@testing-library/react";
import EntrarRecinto from "../component/BotonEntrarRecinto";

jest.mock("../services/index");

test("Al clickear en Entrar al recinto, se llama a la función entrarRecinto con los argumentos adecuados", () => {
    entrarRecinto.mockResolvedValue(Promise.resolve(true));

    render(<EntrarRecinto id_partida={1} id_jugador={2} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(entrarRecinto).toHaveBeenCalledWith({
        id_partida: 1,
        id_jugador: 2,
    });
});
