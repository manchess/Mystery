import { screen, render } from "@testing-library/react";
import Recinto from "../component/Recinto";

test("muestra la imagen del recinto correctamente", () => {
    render(<Recinto imagen="alcoba" jugadores={[]} />);

    const img = screen.getByRole("img");

    expect(img).toHaveAttribute("src", "/tablero/alcoba.png");
});

test("muestra jugadores dentro del recinto", () => {
    const jugadores = [
        {
            nombre: "David",
            color: "red",
            recinto: "ALCOBA",
        },
        {
            nombre: "Dani",
            color: "blue",
            recinto: "ALCOBA",
        },
    ];

    render(<Recinto imagen="ALCOBA" jugadores={jugadores} />);

    expect(screen.getAllByRole("img", { hidden: true })).toHaveLength(3); // 2 y la imagen del recinto
});
