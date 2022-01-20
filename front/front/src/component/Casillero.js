import { useState } from "react";
import Ficha from "./Ficha";
import { obtNombrejugador, moverFicha } from "../services";

/**
 * Busca las posiciones donde están los jugadores que no están en recintos
 * @param  {Array} jugadores
 * @param  {int} x
 * @param  {int} y
 */
function buscarJugadores(jugadores, x, y) {
    let res = Array.from(jugadores);

    res = res.filter(
        (jugador) =>
            jugador.posX === x && jugador.posY === y && jugador.recinto === ""
    );

    return res;
}
/**
 * Calcula si la posiciones son posibles acceder con la ficha del jugador
 * @param  {Array} posPosibles Posiciones que envía el back
 * @param  {int} x Posición del tablero
 * @param  {int} y Posición del tablero
 */
function esPosicionPosible(posPosibles, x, y) {
    if (posPosibles.findIndex((e) => e.x === x && e.y === y) !== -1) {
        return true;
    }
    return false;
}
/**
 * Obtiene el color de un jugador
 * @param  {object} jugadores, Lista de jugadores
 */
function miColor(jugadores) {
    return jugadores.find((e) => e.nombre === obtNombrejugador()).color;
}

/**
 * Calcula el tamaño adecuado de la ficha en base a la cantidad de jugadores
 * que hay en el casillero.
 * @param {*} jugadores
 * @param {*} x
 * @param {*} y
 * @returns {string}
 */
function getTamañoFicha(jugadores, x, y) {
    let arreglo = buscarJugadores(jugadores, x, y);
    if (arreglo.length > 4) {
        return "12px";
    } else if (arreglo.length > 1) {
        return "18px";
    } else {
        return "30px";
    }
}

/**
 * Renderiza las fichas y las posibles elecciones de casillas para moverse.
 * @param  {object} props Id partida y jugador. Posiciones en el tablero
 */
export default function Casillero(props) {
    const [hovering, setHovering] = useState(false);

    return (
        <div
            className="casillero"
            style={{
                gridColumnStart: props.x + 1,
                gridRowStart: props.y + 1,
                backgroundColor: props.color || "black",
            }}
            onMouseOver={(e) => setHovering(true)}
            onMouseOut={(e) => setHovering(false)}
            data-testid="casillero"
        >
            {buscarJugadores(props.jugadores, props.x, props.y).map((e, i) => (
                <Ficha
                    key={i}
                    color={e.color}
                    tamaño={getTamañoFicha(props.jugadores, props.x, props.y)}
                />
            ))}
            {esPosicionPosible(props.posPosibles, props.x, props.y) ? (
                <div
                    style={{
                        opacity: hovering ? "50%" : "0%",
                        cursor: hovering ? "pointer" : "",
                        position: "absolute",
                        zIndex: 1,
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    data-testid="posPosible"
                    onClick={(e) => {
                        props.setPosPosibles([]);
                        moverFicha({
                            id_partida: props.id_partida,
                            id_jugador: props.id_jugador,
                            x: props.x,
                            y: props.y,
                        });
                    }}
                >
                    <Ficha color={miColor(props.jugadores)} tamaño="30px" />
                </div>
            ) : null}
            {props.extra ? props.extra() : null}
        </div>
    );
}
