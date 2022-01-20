import { screen, render } from "@testing-library/react";
import MostrarAcusacion from "../component/MostrarAcusacion";

test("se muestran el nombre del jugador que acusa y las cartas correspondientes a la misma correctamente", () => {
    const acusar = {
        nombre: "David",
        cartas: ["ALCOBA", "COCHERA", "BIBLIOTECA"],
    };

    render(<MostrarAcusacion acusar={acusar} />);

    expect(screen.getByText("David acusó")).toBeInTheDocument();

    acusar.cartas.forEach((e, i) => {
        let img = screen.getAllByRole("img")[i];
        expect(img).toHaveAttribute("src", `/cartas/${e}.png`);
    });
});

test("si la acusación es correcta, dice que fue acertada", () => {
    let acusar = {
        nombre: "David",
        cartas: ["ALCOBA", "COCHERA", "BIBLIOTECA"],
        correcta: true,
    };

    render(<MostrarAcusacion acusar={acusar} />);

    expect(screen.getByText("David acusó")).toBeInTheDocument();

    expect(screen.getByText("La acusación fue acertada.")).toBeInTheDocument();
});

test("si la acusación es incorrecta, dice que fue errónea", () => {
    let acusar = {
        nombre: "David",
        cartas: ["ALCOBA", "COCHERA", "BIBLIOTECA"],
        correcta: false,
    };

    render(<MostrarAcusacion acusar={acusar} />);

    expect(screen.getByText("David acusó")).toBeInTheDocument();

    expect(screen.getByText("La acusación fue errónea.")).toBeInTheDocument();
});
