import { obtDado } from "../services";

/**
 * Botón para lanzar dado y renderizar el resultado.
 * @param {id_partida} props
 * @returns evento click
 */
export default function BotonDado(props) {
    return (
        <button
            className="btn btn-dark"
            onClick={(e) => {
                obtDado({
                    id_partida: props.id_partida,
                    id_jugador: props.id_jugador,
                })
                    .then((res) => props.setPosPosibles(res.data.casilleros))
                    .catch((err) => console.error(err));
            }}
        >
            Lanzar dado
        </button>
    );
}
