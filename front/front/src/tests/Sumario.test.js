import { screen, render } from "@testing-library/react";
import Sumario from "../component/Sumario";

test("Al terminar la partida se muestran las estadisticas en un sumario", () => {
    const sumario = {
        ganador: {
            nombre: "Santi",
            cartas: ["VESTIBULO", "HOMBRELOBO", "CONDE"],
            sospechas: 3,
        },
        perdedores: [
            {
                nombre: "David",
                cartas: [],
                sospechas: 4,
            },
        ],
        tiempo: "10:02:33",
        total_sospechas: 7,
    };

    render(<Sumario sumario={sumario} />);

    const carta1 = "VESTIBULO";
    const carta2 = "HOMBRELOBO";
    const carta3 = "CONDE";
    const img1 = screen.getByRole("img", { name: "VESTIBULO" });
    const img2 = screen.getByRole("img", { name: "HOMBRELOBO" });
    const img3 = screen.getByRole("img", { name: "CONDE" });

    expect(
        screen.getByRole("heading", { name: "Santi ha ganado la partida" })
    ).toBeInTheDocument();
    expect(img1).toHaveAttribute("src", `/cartas/${carta1}.png`);
    expect(img2).toHaveAttribute("src", `/cartas/${carta2}.png`);
    expect(img3).toHaveAttribute("src", `/cartas/${carta3}.png`);
    expect(
        screen.getByRole("heading", { name: "Además, hizo 3 sospechas" })
    ).toBeInTheDocument();
    expect(
        screen.getByRole("heading", {
            name: "David no acuso. hizo 4 sospechas",
        })
    ).toBeInTheDocument();
    expect(
        screen.getByRole("heading", {
            name: "Se realizaron 7 sospechas en total",
        })
    ).toBeInTheDocument();
    expect(
        screen.getByRole("heading", { name: "La partida duró 10:02:33" })
    ).toBeInTheDocument();
});
