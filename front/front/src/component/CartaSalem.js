import { usarBrujaSalem } from "../services";

/**
 * Componente que renderiza la bruja de salem
 * @param  {object} props Cartas
 */
export default function CartaSalem(props) {
    return (
        <div
            className="divCarta"
            onClick={() =>
                props.miturno
                    ? usarBrujaSalem({
                          id_jugador: props.id_jugador,
                          id_partida: props.id_partida,
                      })
                    : null
            }
            style={{ cursor: "pointer" }}
        >
            <img
                className="carta"
                src={`/cartas/BRUJASALEM.png`}
                height="200px"
                alt="Bruja de Salem"
            />
        </div>
    );
}
