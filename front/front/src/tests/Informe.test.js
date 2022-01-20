import { screen, render } from "@testing-library/react";
import Informe from "../component/Informe";

test("Estan todos los montruos, recintos y victimas", () => {
    render(<Informe iniciada={true} />);

    const filas = screen.getAllByRole("textbox");

    expect(filas).toHaveLength(20);
});
