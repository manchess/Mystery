import { screen, render, fireEvent } from "@testing-library/react";
import BotonResponderSospecha from "../component/BotonResponderSospecha";
import { responderSospecha } from "../services/index";

jest.mock("../services/index");

test("al clickear en Responder sospecha, se llama a la funcion responderSospecha y a setRespondiendoSospecha con los argumentos adecuados", () => {
    const setRespondiendoSospecha = jest.fn();
    responderSospecha.mockResolvedValue(Promise.resolve(true));

    render(
        <BotonResponderSospecha
            setRespondiendoSospecha={setRespondiendoSospecha}
            id_sospechante={1}
            id_responde={2}
            carta={"MAYORDOMO"}
        />
    );

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(responderSospecha).toHaveBeenCalledWith({
        id_jugador: 1,
        id_responde: 2,
        carta: "MAYORDOMO",
    });

    expect(setRespondiendoSospecha).toHaveBeenCalledWith(null);
});
