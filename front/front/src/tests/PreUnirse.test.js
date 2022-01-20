import { screen, render, fireEvent } from "@testing-library/react";
import PreUnirse from "../component/PreUnirse";

test("Muestra el nombre de la partida", () => {
    const partida = {
        nombre: "Test",
        anfitrion: "Santi",
        cantidad_jugadores: 1,
        colores: ["red"],
        password: true,
    };

    render(<PreUnirse partida={partida} />);

    expect(screen.getByText(/Test/i)).toBeInTheDocument();
});

test("El boton 'cancelar' resetea todo", () => {
    const partida = {
        nombre: "Test",
        anfitrion: "Santi",
        cantidad_jugadores: 1,
        colores: ["red"],
        password: true,
    };

    const setColor = jest.fn();
    const setPassword = jest.fn();
    const setPrePartida = jest.fn();

    render(
        <PreUnirse
            partida={partida}
            setColor={setColor}
            setPassword={setPassword}
            setPrePartida={setPrePartida}
        />
    );

    const boton = screen.getByText("Cancelar");

    fireEvent.click(boton);

    expect(setColor).toBeCalledWith(null);
    expect(setPassword).toBeCalledWith("");
    expect(setPrePartida).toBeCalledWith(null);
});

test("Boton unirse deshabilitado sino se elige color y poner contraseña", () => {
    const partida = {
        nombre: "Test",
        anfitrion: "Santi",
        cantidad_jugadores: 1,
        colores: ["red"],
        password: true,
    };

    render(<PreUnirse partida={partida} color={null} password="" />);

    const boton = screen.getByText("Unirse");

    expect(boton).toBeDisabled();
});

test("Boton unirse habilitado si se elige color y poner contraseña", () => {
    const partida = {
        nombre: "Test",
        anfitrion: "Santi",
        cantidad_jugadores: 1,
        colores: ["red"],
        password: true,
    };

    render(<PreUnirse partida={partida} color="red" password="hola" />);

    const boton = screen.getByText("Unirse");

    expect(boton).not.toBeDisabled();
});
