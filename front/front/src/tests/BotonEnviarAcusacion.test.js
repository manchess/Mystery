import { hacerAcusacion } from "../services";
import { screen, render, fireEvent } from "@testing-library/react";
import BotonEnviarAcusacion from "../component/BotonEnviarAcusacion";

jest.mock("../services/index");

test("al clickear en enviar acusacion, se llama a la funcion hacerAcusacion y setAcusacion con los argumentos adecuados", () => {
    hacerAcusacion.mockResolvedValue(Promise.resolve(true));

    const setAcusando = jest.fn();

    const data = {
        victima: "CONDESA",
        monstruo: "FRANKENSTEIN",
        recinto: "BIBLIOTECA",
        id_partida: 1,
        id_jugador: 2,
    };

    render(<BotonEnviarAcusacion setAcusando={setAcusando} data={data} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(hacerAcusacion).toHaveBeenCalledWith(data);
});
