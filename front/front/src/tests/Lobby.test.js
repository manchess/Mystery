import { screen, render, fireEvent } from "@testing-library/react";
import { Router, Route, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import Lobby from "../component/Lobby";
import WS from "jest-websocket-mock";
import { obtNombrejugador, obtDado, hacerSospecha } from "../services/index";
import userEvent from "@testing-library/user-event";

jest.mock("../services/index");

test("el lobby muestra el nombre y los jugadores de la partida", () => {
    const history = createMemoryHistory();
    const state = {
        nombre: "Test",
        jugadores: [
            {
                nombre: "David",
                color: "red",
            },
        ],
    };

    history.push("/partidas/1", state);

    render(
        <Router history={history}>
            <Switch>
                <Route path="/partidas/:id">
                    <Lobby />
                </Route>
            </Switch>
        </Router>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("David")).toBeInTheDocument();
});

test("cuando entra un jugador a la partida, se muestra en la lista de jugadores", async () => {
    const server = new WS("ws://localhost:8000/partida/1/1");

    const history = createMemoryHistory();
    const state = {
        nombre: "Test",
        jugadores: [
            {
                nombre: "David",
                color: "red",
            },
        ],
        id_jugador: 1,
    };

    history.push("/partidas/1", state);

    render(
        <Router history={history}>
            <Switch>
                <Route path="/partidas/:id">
                    <Lobby />
                </Route>
            </Switch>
        </Router>
    );

    await server.connected;

    server.send(
        JSON.stringify({
            evento: "Nuevo Jugador",
            jugador: {
                nombre: "Santi",
                color: "blue",
            },
        })
    );

    expect(await screen.findByText("Santi")).toBeInTheDocument();

    server.close();
});

test("cuando es el turno del jugador, se muestra el boton Lanzar dado", async () => {
    const server = new WS("ws://localhost:8000/partida/1/1");

    const history = createMemoryHistory();
    const state = {
        nombre: "Test",
        jugadores: [
            {
                nombre: "David",
                color: "red",
                orden: 1,
            },
        ],
        id_jugador: 1,
    };

    history.push("/partidas/1", state);

    obtNombrejugador.mockImplementation(() => "David");

    render(
        <Router history={history}>
            <Switch>
                <Route path="/partidas/:id">
                    <Lobby />
                </Route>
            </Switch>
        </Router>
    );

    await server.connected;

    server.send(
        JSON.stringify({
            evento: "Nuevo turno",
            turno: 1,
        })
    );

    expect(await screen.findByText("Lanzar dado")).toBeInTheDocument();

    server.close();
});

test("cuando el jugador esta en la entrada de un recinto, se muestra el boton Entrar al recinto", async () => {
    const server = new WS("ws://localhost:8000/partida/1/1");

    const history = createMemoryHistory();
    const state = {
        nombre: "Test",
        jugadores: [
            {
                nombre: "David",
                color: "red",
                orden: 1,
            },
        ],
        id_jugador: 1,
    };

    history.push("/partidas/1", state);

    obtNombrejugador.mockImplementation(() => "David");

    render(
        <Router history={history}>
            <Switch>
                <Route path="/partidas/:id">
                    <Lobby />
                </Route>
            </Switch>
        </Router>
    );

    await server.connected;

    server.send(
        JSON.stringify({
            evento: "Nuevo turno",
            turno: 1,
        })
    );

    server.send(
        JSON.stringify({
            evento: "Tiraron el dado",
            valor: 5,
        })
    );

    server.send(
        JSON.stringify({
            evento: "Nueva posicion",
            nombre: "David",
            x: 4,
            y: 6,
            recinto: "",
        })
    );

    expect(await screen.findByText("Entrar al recinto")).toBeInTheDocument();

    server.close();
});

test("cuando el jugador esta un recinto, se muestra el boton Sospechar", async () => {
    const server = new WS("ws://localhost:8000/partida/1/1");

    const history = createMemoryHistory();
    const state = {
        nombre: "Test",
        jugadores: [
            {
                nombre: "David",
                color: "red",
                orden: 1,
            },
        ],
        id_jugador: 1,
    };

    history.push("/partidas/1", state);

    obtNombrejugador.mockImplementation(() => "David");

    render(
        <Router history={history}>
            <Switch>
                <Route path="/partidas/:id">
                    <Lobby />
                </Route>
            </Switch>
        </Router>
    );

    await server.connected;

    server.send(
        JSON.stringify({
            evento: "Nuevo turno",
            turno: 1,
        })
    );

    server.send(
        JSON.stringify({
            evento: "Tiraron el dado",
            valor: 5,
        })
    );

    server.send(
        JSON.stringify({
            evento: "Nueva posicion",
            nombre: "David",
            x: 4,
            y: 6,
            recinto: "COCHERA",
        })
    );

    expect(await screen.findByText("Sospechar")).toBeInTheDocument();

    server.close();
});

test("al hacer click en Sospechar, se muestra el selector de Monstruo y Victima", async () => {
    const server = new WS("ws://localhost:8000/partida/1/1");

    const history = createMemoryHistory();
    const state = {
        nombre: "Test",
        jugadores: [
            {
                nombre: "David",
                color: "red",
                orden: 1,
            },
        ],
        id_jugador: 1,
    };

    history.push("/partidas/1", state);

    obtNombrejugador.mockImplementation(() => "David");

    render(
        <Router history={history}>
            <Switch>
                <Route path="/partidas/:id">
                    <Lobby />
                </Route>
            </Switch>
        </Router>
    );

    await server.connected;

    server.send(
        JSON.stringify({
            evento: "Nuevo turno",
            turno: 1,
        })
    );

    server.send(
        JSON.stringify({
            evento: "Tiraron el dado",
            valor: 5,
        })
    );

    server.send(
        JSON.stringify({
            evento: "Nueva posicion",
            nombre: "David",
            x: 4,
            y: 6,
            recinto: "COCHERA",
        })
    );

    const button = await screen.findByText("Sospechar");

    fireEvent.click(button);

    expect(await screen.findAllByRole("combobox")).toHaveLength(2);

    server.close();
});

test("al hacer click en Enviar sospecha, desaparecen los selectores de monstruo y víctima", async () => {
    const server = new WS("ws://localhost:8000/partida/1/1");

    const history = createMemoryHistory();
    const state = {
        nombre: "Test",
        jugadores: [
            {
                nombre: "David",
                color: "red",
                orden: 1,
            },
        ],
        id_jugador: 1,
    };

    history.push("/partidas/1", state);

    obtNombrejugador.mockImplementation(() => "David");

    render(
        <Router history={history}>
            <Switch>
                <Route path="/partidas/:id">
                    <Lobby />
                </Route>
            </Switch>
        </Router>
    );

    await server.connected;

    server.send(
        JSON.stringify({
            evento: "Nuevo turno",
            turno: 1,
        })
    );

    server.send(
        JSON.stringify({
            evento: "Tiraron el dado",
            valor: 5,
        })
    );

    server.send(
        JSON.stringify({
            evento: "Nueva posicion",
            nombre: "David",
            x: 4,
            y: 6,
            recinto: "COCHERA",
        })
    );

    const button = await screen.findByText("Sospechar");

    fireEvent.click(button);

    hacerSospecha.mockResolvedValue(Promise.resolve(true));

    const inputVictimas = screen.getAllByRole("combobox")[0];
    const inputMonstruos = screen.getAllByRole("combobox")[1];

    userEvent.selectOptions(inputVictimas, "CONDESA");
    userEvent.selectOptions(inputMonstruos, "DRACULA");

    const button2 = await screen.findByText("Enviar Sospecha");

    fireEvent.click(button2);

    expect(screen.queryAllByRole("combobox")).toHaveLength(0);

    server.close();
});

test("al clickear en Lanzar dado, se muestra el numero que salió", async () => {
    const server = new WS("ws://localhost:8000/partida/1/1");

    const history = createMemoryHistory();
    const state = {
        nombre: "Test",
        jugadores: [
            {
                nombre: "David",
                color: "red",
                orden: 1,
            },
        ],
        id_jugador: 1,
    };

    history.push("/partidas/1", state);

    obtNombrejugador.mockImplementation(() => "David");

    render(
        <Router history={history}>
            <Switch>
                <Route path="/partidas/:id">
                    <Lobby />
                </Route>
            </Switch>
        </Router>
    );

    await server.connected;

    server.send(
        JSON.stringify({
            evento: "Nuevo turno",
            turno: 1,
        })
    );

    obtDado.mockImplementation(() => {
        server.send(
            JSON.stringify({
                evento: "Tiraron el dado",
                valor: 5,
            })
        );
        return Promise.resolve({ casilleros: [] });
    });

    const button = await screen.findByText("Lanzar dado");

    fireEvent.click(button);

    expect(await screen.findByText("5")).toBeInTheDocument();

    server.close();
});
