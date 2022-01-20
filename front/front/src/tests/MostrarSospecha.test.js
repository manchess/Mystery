import { screen, render } from "@testing-library/react";
import MostrarSospecha from "../component/MostrarSospecha";

test("se muestran el nombre del jugador que sospecha y las cartas correspondientes a la misma correctamente", () => {
    const sospecha = {
        nombre: "David",
        cartas: ["ALCOBA", "COCHERA", "BIBLIOTECA"],
    };

    render(<MostrarSospecha sospecha={sospecha} />);

    expect(screen.getByText("David sospechó")).toBeInTheDocument();

    sospecha.cartas.forEach((e, i) => {
        let img = screen.getAllByRole("img")[i];
        expect(img).toHaveAttribute("src", `/cartas/${e}.png`);
    });
});

test("se muestra cuando un jugador responde a una sospecha (sin las cartas)", () => {
    const sospecha = {
        nombre: "David",
        cartas: ["ALCOBA", "COCHERA", "BIBLIOTECA"],
        nombreResponde: "Dani",
    };

    render(<MostrarSospecha sospecha={sospecha} />);

    expect(screen.getByText("David sospechó")).toBeInTheDocument();

    sospecha.cartas.forEach((e, i) => {
        let img = screen.getAllByRole("img")[i];
        expect(img).toHaveAttribute("src", `/cartas/${e}.png`);
    });

    expect(screen.getByText("Dani responde")).toBeInTheDocument();
});

test("se muestra cuando un jugador responde a una sospecha (sin las cartas)", () => {
    const sospecha = {
        nombre: "David",
        cartas: ["ALCOBA", "COCHERA", "BIBLIOTECA"],
        nombreResponde: "Dani",
    };

    render(<MostrarSospecha sospecha={sospecha} />);

    expect(screen.getByText("David sospechó")).toBeInTheDocument();

    expect(screen.getByText("Dani responde")).toBeInTheDocument();

    expect(screen.queryAllByRole("img")).toHaveLength(3);
});

test("al jugador que sospechó, se le muestran las cartas de su sospecha y la respuesta", () => {
    const sospecha = {
        nombre: "David",
        cartas: ["ALCOBA", "COCHERA", "BIBLIOTECA"],
        nombreResponde: "Dani",
    };

    const respuestaSospecha = {
        nombreResponde: "Dani",
        carta: "ALCOBA",
    };

    render(
        <MostrarSospecha
            sospecha={sospecha}
            respuestaSospecha={respuestaSospecha}
        />
    );

    expect(screen.getByText("David sospechó")).toBeInTheDocument();

    expect(screen.getByText("Dani responde")).toBeInTheDocument();

    expect(screen.queryAllByRole("img")).toHaveLength(4);
});
