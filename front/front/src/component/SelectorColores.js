import { useState } from "react";
/**
 * Componente que muestra los colores para elegir.
 * @param  {props} props
 */
export default function SelectorColores(props) {
    const [hover, setHover] = useState(-1);
    const [selected, setSelected] = useState(props.color);

    return (
        <>
            <h3>Elige un color:</h3>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    columnGap: "15px",
                }}
            >
                {props.colores.map((e, i) => (
                    <input
                        type="radio"
                        name="color"
                        checked={e === props.color}
                        autoFocus={props.autoFocus && i === 0}
                        required
                        onMouseOver={(e) => setHover(i)}
                        onMouseOut={(e) => setHover(-1)}
                        onClick={() => {
                            setSelected(e);
                            props.setColor(e);
                        }}
                        style={{
                            appearance: "none",
                            height: "40px",
                            width: "40px",
                            borderRadius: "20px",
                            border: "2px solid white",
                            backgroundColor: e,
                            opacity:
                                hover === i || selected === e ? "100%" : "50%",
                            cursor: "pointer",
                        }}
                        key={i}
                    />
                ))}
            </div>
        </>
    );
}
