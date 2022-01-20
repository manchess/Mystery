import { screen, render, fireEvent } from "@testing-library/react";
import BotonCrear from "../component/BotonCrear";
import { MemoryRouter } from "react-router-dom";

test("el boton Crear Partida redirige a /crear-partida", async () => {
    render(<BotonCrear />, { wrapper: MemoryRouter });

    const button = screen.getByRole("link");

    fireEvent.click(button);

    expect(await screen.findByText(/crear partida/i)).toBeInTheDocument();
});
