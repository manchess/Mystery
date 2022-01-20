import React from "react-router-dom";

/**
 * Botón para unirse a una partida no iniciada.
 * @param {partida | unirse} props Botón por partida.
 * @returns evento click
 */
export default function BotonUnirse(props) {
    return (
        <button
            className="btn btn-dark"
            onClick={(e) => {
                props.setColor(props.partida.colores[0]);
                props.unirse(props.partida);
            }}
            disabled={props.disabled}
        >
            Unirse
        </button>
    );
}
