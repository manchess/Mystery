import { responderSospecha } from "../services";
/**
 * Renderiza el botón para responder la sospecha y enviar la respuesta.
 * @param  {props} props
 */
export default function BotonResponderSospecha(props) {
    return (
        <button
            className="btn btn-dark"
            style={{ marginTop: "15px" }}
            onClick={(e) => {
                props.setRespondiendoSospecha(null);
                responderSospecha({
                    id_jugador: props.id_sospechante,
                    id_responde: props.id_responde,
                    carta: props.carta,
                });
            }}
        >
            Responder sospecha
        </button>
    );
}
