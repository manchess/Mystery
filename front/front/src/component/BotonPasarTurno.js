import { pasarTurno } from "../services";

/**
 * Botón para finalizar turno.
 * @param {id_partida} props
 * @returns evento click
 */
export default function PasarTurno(props) {
    return (
        <button
            className="btn btn-dark"
            onClick={(e) => {
                pasarTurno({ id_partida: props.id_partida });
                props.sospechando(false);
                props.acusando(false);
            }}
        >
            Pasar turno
        </button>
    );
}
