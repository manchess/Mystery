/**
 * Renderiza la carta del misterio obtenida por usar la bruja de Salem
 * y informa a los demas jugadores quien la uso.
 * @param  {prosp} props
 */
export default function MostrarCartaMisterio(props) {
    return (
        <div className="popup">
            <h1>{props.jugosalem} uso la bruja de Salem</h1>
            {props.cartamisterio ? (
                <img
                    src={`/cartas/${props.cartamisterio}.png`}
                    height="200px"
                    alt={props.cartamisterio}
                    style={{ marginBottom: "10px" }}
                />
            ) : null}
            <button
                className="btn btn-dark"
                onClick={() => props.setSalem(null)}
            >
                Aceptar
            </button>
        </div>
    );
}
