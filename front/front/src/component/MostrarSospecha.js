import { useState } from "react";
import BotonResponderSospecha from "./BotonResponderSospecha";

/**
 * Renderiza las cartas de una sospecha
 * @param  {object} props Nombre de jugador y cartas de sospecha
 */
export default function MostrarSospecha(props) {
    /**
     * Estado que guarda la carta de la respues de una sospecha.
     * @param  {object} null
     */
    const [respuesta, setRespuesta] = useState(null);

    return (
        <div className="popup">
            <h1>{props.sospecha.nombre} sospechó</h1>
            <div
                style={{
                    display: "flex",
                    columnGap: "15px",
                }}
            >
                {props.sospecha.cartas.map((e, key) => (
                    <img
                        src={`/cartas/${e}.png`}
                        height="200px"
                        key={key}
                        alt={e}
                    />
                ))}
            </div>
            <h1>{props.sospecha.nombreResponde} responde</h1>
            {props.respuestaSospecha ? (
                props.respuestaSospecha.carta !== "NINGUNA" ? (
                    <img
                        src={`/cartas/${props.respuestaSospecha.carta}.png`}
                        height="200px"
                        a
                        alt={props.respuestaSospecha.carta}
                    />
                ) : null
            ) : null}
            {props.respondiendoSospecha ? (
                <>
                    <h1>Elige una carta para responder:</h1>
                    <div
                        style={{
                            display: "flex",
                            columnGap: "15px",
                            marginTop: "10px",
                        }}
                    >
                        {props.respondiendoSospecha.cartas.map((e, key) => (
                            <img
                                src={`/cartas/${e}.png`}
                                height="200px"
                                onClick={() => setRespuesta(e)}
                                style={{
                                    cursor: "pointer",
                                    opacity: e === respuesta ? "100%" : "50%",
                                }}
                                alt={e}
                                key={key}
                            />
                        ))}
                    </div>
                    {respuesta ? (
                        <BotonResponderSospecha
                            id_sospechante={props.sospecha.id_jugador}
                            id_responde={props.respondiendoSospecha.id_responde}
                            carta={respuesta}
                            setRespondiendoSospecha={
                                props.setRespondiendoSospecha
                            }
                        />
                    ) : null}
                </>
            ) : null}
        </div>
    );
}
