import React from "react";
/**
 * Renderiza el boton para realizar una acusación.
 * @param  {props} props
 */
export default function Acusar(props) {
    return (
        <button
            className={"btn btn-dark"}
            onClick={(e) => props.setAcusando(true)}
        >
            Acusar
        </button>
    );
}
