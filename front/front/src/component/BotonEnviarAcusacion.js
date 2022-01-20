import React from "react";
import { hacerAcusacion } from "../services";

/**
 * Renderiza el botón que envía la acusacion al back
 * @param {object} props ID jugador y partida, monstruo, recinto y víctima
 */
export default function BotonEnviarAcusacion(props) {
    return (
        <button
            className={"btn btn-dark"}
            onClick={(e) => {
                props.setAcusando(false);
                hacerAcusacion({
                    victima: props.data.victima,
                    monstruo: props.data.monstruo,
                    recinto: props.data.recinto,
                    id_jugador: props.data.id_jugador,
                    id_partida: props.data.id_partida,
                });
            }}
            disabled={props.disabled}
        >
            Enviar Acusacion
        </button>
    );
}
