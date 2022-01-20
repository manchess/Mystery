import { screen, render, fireEvent } from "@testing-library/react";
import PasarTurno from "../component/BotonPasarTurno";
import { pasarTurno } from "../services/index";

jest.mock("../services/index");

test("al clickear el boton Pasar turno, se llama a la función pasarTurno con los argumentos adecuados", () => {
    render(
        <PasarTurno
            id_partida={1}
            sospechando={jest.fn()}
            acusando={jest.fn()}
        />
    );

    pasarTurno.mockResolvedValue(Promise.resolve(true));

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(pasarTurno).toHaveBeenCalledWith({ id_partida: 1 });
});
