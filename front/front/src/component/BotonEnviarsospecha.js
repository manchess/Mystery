import { hacerSospecha } from "../services";
/**
 * Renderiza el botón que envía la sospecha al back
 * @param  {object} props ID jugador y partida, monstruo y víctima
 */
export default function BotonEnviarsospecha(props) {
    return (
        <button
            className={"btn btn-dark"}
            onClick={(e) => {
                hacerSospecha({
                    victima: props.data.victima,
                    monstruo: props.data.monstruo,
                    id_jugador: props.data.id_jugador,
                    id_partida: props.data.id_partida,
                });
                props.setSospechando(false);
            }}
            disabled={props.disabled}
        >
            Enviar Sospecha
        </button>
    );
}
