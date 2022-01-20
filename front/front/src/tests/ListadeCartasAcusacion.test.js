import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ListadeCartas from "../component/ListadeCartasAcusacion";

test("el boton Enviar Acusacion es utilizable si seleccionamos monstruo, recinto y victima", async () => {
    render(<ListadeCartas />);

    const inputVictimas = screen.getAllByRole("combobox")[0];
    const inputMonstruos = screen.getAllByRole("combobox")[1];
    const inputRecintos = screen.getAllByRole("combobox")[2];

    expect(
        screen.queryByRole("button", { name: "Enviar Acusacion" })
    ).toBeDisabled();

    userEvent.selectOptions(inputVictimas, "CONDESA");

    expect(
        screen.queryByRole("button", { name: "Enviar Acusacion" })
    ).toBeDisabled();

    userEvent.selectOptions(inputMonstruos, "DRACULA");

    expect(
        screen.queryByRole("button", { name: "Enviar Acusacion" })
    ).toBeDisabled();

    userEvent.selectOptions(inputRecintos, "BIBLIOTECA");

    expect(
        await screen.findByRole("button", { name: "Enviar Acusacion" })
    ).not.toBeDisabled();
});
