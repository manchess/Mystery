import { screen, render } from "@testing-library/react";
import Casillero from "../component/Casillero";
import { obtNombrejugador } from "../services/index";

jest.mock("../services/index");

test("el casillero se renderiza con el color asignado", () => {
    render(<Casillero posPosibles={[]} jugadores={[]} color="red" />);

    const casilleroDiv = screen.getByTestId("casillero");

    expect(casilleroDiv).toHaveStyle("background-color: red");
});

test("cuando no se le asigna color, el casillero tiene color negro", () => {
    render(<Casillero posPosibles={[]} jugadores={[]} />);

    const casilleroDiv = screen.getByTestId("casillero");

    expect(casilleroDiv).toHaveStyle("background-color: black");
});

test("los extras del casillero se muestran correctamente", () => {
    const extra = () => <div data-testid="extra"></div>;

    render(<Casillero posPosibles={[]} jugadores={[]} extra={extra} />);

    expect(screen.getByTestId("extra")).toBeInTheDocument();
});

test("los casilleros muestran las fichas en caso de que haya jugadores en ellos", () => {
    const jugadores = [
        {
            nombre: "David",
            color: "red",
            posX: 3,
            posY: 2,
            color: "red",
            recinto: "",
        },
    ];

    render(<Casillero x={3} y={2} posPosibles={[]} jugadores={jugadores} />);

    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
});

test("se muestran las posiciones posibles en los casilleros pertinentes", () => {
    const posPosibles = [{ x: 3, y: 2 }];
    const jugadores = [
        {
            nombre: "David",
            color: "red",
        },
    ];

    obtNombrejugador.mockImplementation(() => "David");

    render(
        <Casillero
            x={3}
            y={2}
            posPosibles={posPosibles}
            jugadores={jugadores}
        />
    );

    expect(screen.getAllByTestId("posPosible")).toHaveLength(1);
});
