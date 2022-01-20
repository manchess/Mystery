/**
 * Renderiza las cartas de una acusacion
 * @param  {object} props Nombre de jugador y cartas de acusacion
 */
export default function MostrarAcusacion(props) {
    return (
        <div className="popup">
            <h1>{props.acusar.nombre} acusó</h1>
            <div
                style={{
                    display: "flex",
                    columnGap: "15px",
                    marginTop: "10px",
                }}
            >
                {props.acusar.cartas.map((e, key) => (
                    <img
                        src={`/cartas/${e}.png`}
                        height="200px"
                        key={key}
                        alt={e}
                    />
                ))}
            </div>
            {props.acusar.correcta ? (
                <>
                    <h2>La acusación fue acertada.</h2>
                    <h2>{props.acusar.nombre} ha ganado la partida!</h2>
                </>
            ) : (
                <>
                    <h2>La acusación fue errónea.</h2>
                    <h2>{props.acusar.nombre} ha perdido la partida.</h2>
                </>
            )}
            <button
                className="btn btn-dark"
                onClick={() => props.setacusar(null)}
            >
                Aceptar
            </button>
        </div>
    );
}
