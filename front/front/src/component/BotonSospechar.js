import React from "react";
/**
 * Renderiza el botón que te permite realizar una sospecha
 * @param  {object} props Estado de sospecha
 */
export default function Sospechar(props) {
    return (
        <button
            className={"btn btn-dark"}
            onClick={(e) => props.setSospechando(true)}
        >
            Sospechar
        </button>
    );
}
