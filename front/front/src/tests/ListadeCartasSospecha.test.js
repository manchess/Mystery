import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ListadeCartas from "../component/ListadeCartasSospecha";

test("el boton Enviar Sospecha solo aparece si seleccionamos monstruo y victima", async () => {
    render(<ListadeCartas />);

    const inputVictimas = screen.getAllByRole("combobox")[0];
    const inputMonstruos = screen.getAllByRole("combobox")[1];

    expect(
        screen.queryByRole("button", { name: "Enviar Sospecha" })
    ).toBeDisabled();

    userEvent.selectOptions(inputVictimas, "CONDESA");

    expect(
        screen.queryByRole("button", { name: "Enviar Sospecha" })
    ).toBeDisabled();

    userEvent.selectOptions(inputMonstruos, "DRACULA");

    expect(
        await screen.findByRole("button", { name: "Enviar Sospecha" })
    ).not.toBeDisabled();
});
