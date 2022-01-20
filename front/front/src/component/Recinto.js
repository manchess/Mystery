import Ficha from "./Ficha";

/**
 * Busca jugadores que estén en el recinto y devuelve un arreglo
 * con los mismos.
 * @param {Array} jugadores
 * @param {string} recinto
 * @returns {Array}
 */
function buscarJugadoresRecinto(jugadores, recinto) {
    let res = Array.from(jugadores);

    res = res.filter((e) => e.recinto === recinto);

    return res;
}

/**
 * Renderiza un recinto
 * @param {object} props
 */
export default function Recinto(props) {
    return (
        <div
            className="recinto"
            style={{
                gridColumnStart: props.xInicio + 1,
                gridColumnEnd: props.xFin + 1,
                gridRowStart: props.yInicio + 1,
                gridRowEnd: props.yFin + 1,
            }}
        >
            <img
                src={`/tablero/${props.imagen}.png`}
                width="245px"
                alt={props.nombre}
                style={{ position: "absolute" }}
            />
            {buscarJugadoresRecinto(
                props.jugadores,
                props.imagen.toUpperCase()
            ).map((e, key) => (
                <Ficha color={e.color} tamaño="30px" key={key} />
            ))}
        </div>
    );
}
