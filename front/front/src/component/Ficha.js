import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
/**
 * Renderiza la ficha de cada jugador
 * @param  {object} props Color de los jugadores
 */
export default function Ficha(props) {
    return (
        <div>
            <FontAwesomeIcon
                icon={faUserSecret}
                style={{
                    color: props.color,
                    fontSize: props.tamaño,
                    position: "relative",
                    zIndex: 1,
                }}
            />
        </div>
    );
}
