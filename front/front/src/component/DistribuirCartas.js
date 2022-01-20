import Carta from "./Carta";
import CartaSalem from "./CartaSalem";
/**
 * Reparte las cartas a los jugadores
 * @param  {object} props Cartas obtenidas del back
 */
export default function DistribuirCartas(props) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
            }}
        >
            {props.cartas.map((e, index) =>
                e === "BRUJASALEM" ? (
                    <CartaSalem
                        miturno={props.miturno}
                        key={index}
                        id_partida={props.id_partida}
                        id_jugador={props.id_jugador}
                    />
                ) : (
                    <Carta carta={e} key={index} />
                )
            )}
        </div>
    );
}
