/**
 * Componente que renderiza si un jugador no uso la carta de Salem.
 * @param  {props} props
 */
export default function MostrarPerdioCarta(props) {
    return (
        <div className="popup">
            <h1>{props.nombre} no usó la Bruja de Salem</h1>
            <button
                className="btn btn-dark"
                onClick={() => props.setPerdioBruja(null)}
            >
                Aceptar
            </button>
        </div>
    );
}
