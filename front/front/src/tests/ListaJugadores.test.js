import { screen, render } from "@testing-library/react";
import ListaJugadores from "../component/ListaJugadores";

test("la lista muestra los nombres de los jugadores correctamente", () => {
    const jugadores = [
        {
            nombre: "David",
        },
        {
            nombre: "Santi",
        },
        {
            nombre: "fran",
        },
    ];

    render(<ListaJugadores jugadores={jugadores} />);

    jugadores.forEach((e) =>
        expect(screen.getByText(e.nombre)).toBeInTheDocument()
    );
});

test("la lista muestra los colores de los jugadores correctamente", () => {
    const jugadores = [
        {
            nombre: "David",
            color: "red",
        },
    ];

    render(<ListaJugadores jugadores={jugadores} />);

    const viñeta = screen.getByText("●");

    expect(viñeta).toHaveStyle("color: red");
});

test("la lista muestra los lugares vacios correctamente", () => {
    const jugadores = [
        {
            nombre: "David",
        },
        {
            nombre: "Santi",
        },
        {
            nombre: "fran",
        },
    ];

    render(<ListaJugadores jugadores={jugadores} />);

    expect(screen.getAllByText("Vacío")).toHaveLength(6 - jugadores.length);
});
