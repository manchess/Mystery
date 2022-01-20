import { screen, render, fireEvent } from "@testing-library/react";
import CartaSalem from "../component/CartaSalem";
import { usarBrujaSalem } from "../services/index";

jest.mock("../services/index");

test("Llama correctamente a la funcion: usarBrujaSalem", () => {
    usarBrujaSalem.mockResolvedValue(Promise.resolve(true));

    render(<CartaSalem miturno={true} id_jugador={1} id_partida={2} />);

    const carta = screen.getByRole("img");

    fireEvent.click(carta);

    expect(usarBrujaSalem).toHaveBeenCalledWith({
        id_jugador: 1,
        id_partida: 2,
    });
});
