import { screen, render, fireEvent } from "@testing-library/react";
import BotonDado from "../component/BotonDado";
import { obtDado } from "../services/index";

jest.mock("../services/index");

test("al clickear Lanzar dado, se llama a la función obtDado con los argumentos adecuados", () => {
    obtDado.mockResolvedValue(Promise.resolve({ data: { casilleros: [] } }));

    render(
        <BotonDado id_partida={1} id_jugador={2} setPosPosibles={() => true} />
    );

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(obtDado).toHaveBeenCalledWith({ id_partida: 1, id_jugador: 2 });
});
