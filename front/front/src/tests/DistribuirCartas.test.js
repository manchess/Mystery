import { screen, render } from "@testing-library/react";
import DistribuirCartas from "../component/DistribuirCartas";

test("se muestran todas las cartas", () => {
    const cartas = ["ALCOBA", "FRANKENSTEIN", "MAYORDOMO", "CONDE", "CONDESA"];

    render(<DistribuirCartas cartas={cartas} />);

    expect(screen.getAllByRole("img")).toHaveLength(cartas.length);
});
