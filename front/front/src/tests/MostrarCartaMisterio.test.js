import { screen, render } from "@testing-library/react";
import MostrarCartaMisterio from "../component/MostrarCartaMisterio";

test("Se muestra correctamente la carta del sobre misterio", () => {
    render(
        <MostrarCartaMisterio jugosalem="Jugador1" cartamisterio="ALCOBA" />
    );

    const imagen = screen.getByRole("img");

    expect(imagen).toHaveAttribute("src", `/cartas/ALCOBA.png`);
});
