import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faTimes } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { obtNombrejugador } from "../services";

/**
 * Lista los jugadores que se unieron a una partida. Llamada en Lobby.js .
 * @param {Jugadores | Turno } props
 * @returns Renderizado JSX
 */
export default function ListaJugadores(props) {
    return (
        <table className="tablaJugadores">
            <tbody>
                {props.jugadores.map((e, index) => (
                    <tr key={index}>
                        <td
                            style={{
                                border:
                                    props.turno === e.orden
                                        ? "5px solid red"
                                        : "",
                            }}
                        >
                            <span style={{ color: e.color }}>●</span>{" "}
                            <span
                                style={{
                                    fontWeight:
                                        e.nombre === obtNombrejugador()
                                            ? "bold"
                                            : "",
                                }}
                            >
                                {e.nombre}
                            </span>{" "}
                            {e.nombre === props.anfitrion ? (
                                <FontAwesomeIcon icon={faCrown} />
                            ) : null}
                            {e.perdio ? (
                                <>
                                    {" "}
                                    <FontAwesomeIcon icon={faTimes} />
                                </>
                            ) : null}
                        </td>
                    </tr>
                ))}
                {[...Array(6 - props.jugadores.length)].map((e, key) => (
                    <tr key={key}>
                        <td style={{ color: "gray" }}>
                            <i>Vacío</i>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
