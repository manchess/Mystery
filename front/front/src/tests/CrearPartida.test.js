import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreaPartida from "../component/CrearPartida";
import { nuevaPartida, obtNombrejugador } from "../services/index";

jest.mock("../services/index");

test("el campo nombre es requerido", () => {
    render(<CreaPartida />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("required");
});

test("al ingresar un nombre, no ingresar contraseña y hacer click en Crear, se llama la funcion nuevaPartida", () => {
    nuevaPartida.mockResolvedValue(Promise.resolve(true));

    render(<CreaPartida />);

    const button = screen.getByRole("button");

    const input = screen.getByRole("textbox");

    const color = screen.getAllByRole("radio")[0];

    obtNombrejugador.mockImplementation(() => "David");

    userEvent.type(input, "test");

    fireEvent.click(color);
    fireEvent.click(button);

    expect(nuevaPartida).toHaveBeenCalledWith({
        nombre: "test",
        anfitrion: "David",
        color: "#4285F4",
        password: "",
    });
});

test("al ingresar un nombre, ingresar una contraseña y hacer click en Crear, se llama la funcion nuevaPartida", () => {
    nuevaPartida.mockResolvedValue(Promise.resolve(true));

    render(<CreaPartida />);

    const button = screen.getByRole("button");

    const input = screen.getByRole("textbox");

    const color = screen.getAllByRole("radio")[0];

    const password = screen.getByPlaceholderText(/contraseña/i);

    obtNombrejugador.mockImplementation(() => "David");

    userEvent.type(input, "test");
    userEvent.type(password, "hola");

    fireEvent.click(color);
    fireEvent.click(button);

    expect(nuevaPartida).toHaveBeenCalledWith({
        nombre: "test",
        anfitrion: "David",
        color: "#4285F4",
        password: "hola",
    });
});
