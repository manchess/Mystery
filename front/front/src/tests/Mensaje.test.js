import { screen, render } from "@testing-library/react";
import Mensaje from "../component/Mensaje";

test("Se muestra el mensaje y el nombre de quien lo escribio", () => {
    render(<Mensaje nombre="Jugador1" texto="Hola" />);

    expect(screen.getByText(/Jugador1/i)).toBeInTheDocument();
    expect(screen.getByText(/Hola/i)).toBeInTheDocument();
});
