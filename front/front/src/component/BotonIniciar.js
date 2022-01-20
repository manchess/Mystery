import { iniciarPartida } from "../services";

/**
 * Botón para iniciar partida creada.
 * @param {id_partida | cantidadJugadores} props
 * @returns evento click
 */
export default function Iniciar(props) {
    return (
        <button
            className="btn btn-dark"
            disabled={props.cantjugadores < 2}
            onClick={(e) => iniciarPartida({ id_partida: props.id_partida })}
        >
            Iniciar partida
        </button>
    );
}
