import { render, waitFor, screen } from "@testing-library/react";
import ListaPartidas from "../component/ListaPartidas";
import { traerPartidas, unirJugador } from "../services";

jest.mock("../services/index");

// mockeo el boton crear asi no se queja de que uso <Link> fuera de un <Router>
jest.mock("../component/BotonCrear", () => "a");

test("si no hay partidas, se muestra en la tabla un mensaje indicandolo", async () => {
    traerPartidas.mockResolvedValue(Promise.resolve({ data: [] }));

    render(<ListaPartidas />);

    await waitFor(() => expect(screen.getByText("No hay partidas")));
});

test("la tabla muestra los datos correctamente", async () => {
    traerPartidas.mockResolvedValue(
        Promise.resolve({
            data: [
                {
                    nombre: "Test",
                    anfitrion: "Santi",
                    cantidad_jugadores: 3,
                },
            ],
        })
    );

    unirJugador.mockResolvedValue(
        Promise.resolve({
            status: 200,
            data: {
                id_jugador: 4,
                id_partida: 1,
                anfitrion: "Santi",
                jugadores: [
                    { nombre: "Santi" },
                    { nombre: "Fran" },
                    { nombre: "Dani" },
                    { Nombre: "David" },
                ],
            },
        })
    );

    render(<ListaPartidas />);

    await waitFor(() => expect(screen.getByText("Test")));
    await waitFor(() => expect(screen.getByText("Santi")));
    await waitFor(() => expect(screen.getByText("3/6")));
});
