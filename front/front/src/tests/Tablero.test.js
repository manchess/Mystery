import { screen, render } from "@testing-library/react";
import Tablero from "../component/Tablero";

test("el tablero muestra todos los casilleros", () => {
    render(<Tablero jugadores={[]} posPosibles={[]} />);

    let casilleros = screen.getAllByTestId("casillero");

    expect(casilleros).toHaveLength(20 + 20 + 18 + 18);
});

test("el tablero muestra todos los recintos", () => {
    render(<Tablero jugadores={[]} posPosibles={[]} />);

    expect(screen.getByRole("img", { name: "Cochera" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Alcoba" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Biblioteca" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Vestíbulo" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Panteón" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Bodega" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Salón" })).toBeInTheDocument();
    expect(
        screen.getByRole("img", { name: "Laboratorio" })
    ).toBeInTheDocument();
});
