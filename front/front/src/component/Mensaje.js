/**
 * Funcion para renderizar el nombre, color y texto del mensaje de un jugador.
 * @param  {object} props
 */
export default function Mensaje(props) {
    return (
        <div className="mensaje">
            <span style={{ fontWeight: "bold", color: props.color }}>
                {props.nombre}
            </span>
            : {props.texto}
        </div>
    );
}
