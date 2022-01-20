import { screen, render, fireEvent } from "@testing-library/react";
import BotonUnirse from "../component/BotonUnirse";

test("al clickear en Unirse, se llama a la funcion setPrePartida con los argumentos adecuados", () => {
    const partida = {
        nombre: "Test",
        anfitrion: "David",
        cantidad_jugadores: 2,
        colores: ["red", "blue"]
    };

    const unirse = jest.fn();
    const setColor = jest.fn();

    render(<BotonUnirse partida={partida} unirse={unirse} setColor={setColor} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(unirse).toHaveBeenCalledWith(partida);
});
