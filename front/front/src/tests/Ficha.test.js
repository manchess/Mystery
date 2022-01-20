import { screen, render } from "@testing-library/react";
import Ficha from "../component/Ficha";

test("la ficha se muestra con el color y tamaño asignados", () => {
    render(<Ficha color="red" tamaño="30px" />);

    const ficha = screen.getByRole("img", { hidden: true });

    expect(ficha).toHaveStyle("color: red");
    expect(ficha).toHaveStyle("font-size: 30px");
});
