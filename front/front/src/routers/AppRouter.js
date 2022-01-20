import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CrearPartida from "../component/CrearPartida";
import Inicio from "../component/Inicio";
import ListaPartidas from "../component/ListaPartidas";
import Lobby from "../component/Lobby";
/**
 * Establece los path donde se renderizan las componentes.
 */
export default function Approuter() {
    return (
        <Router>
            <Switch>
                <Route path="/inicio">
                    <ListaPartidas />
                </Route>
                <Route path="/partidas/:id">
                    <Lobby />
                </Route>
                <Route path="/crear-partida">
                    <CrearPartida />
                </Route>
                <Route path="/">
                    <Inicio />
                </Route>
                <Route path="/*">
                    <h1>404 Not Found</h1>
                </Route>
            </Switch>
        </Router>
    );
}
