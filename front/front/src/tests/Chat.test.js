import { screen, render } from "@testing-library/react";
import Chat from "../component/Chat";

test("No te deja clickear el boton si no se escribe un mensaje", () => {
    render(<Chat mensajesChat={[]} />);

    const boton = screen.getByRole("button");

    expect(boton).toBeDisabled();
});

test("Se muestra los mensajes", () => {
    const mensaje = {
        nombre: "jugador1",
        texto: "Hola",
        color: "red",
    };

    render(<Chat mensajesChat={[mensaje]} />);

    expect(screen.getByText(/Hola/i)).toBeInTheDocument();
});
