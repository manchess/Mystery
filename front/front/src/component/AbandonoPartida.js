/**
 * Componente que muestra las cartas de un jugador que abandono la partida
 * @param {object} props nombre y cartas
 */
export default function AbandonoPartida(props) {
    return (
        <div className="popup" style={{ width: "821px" }}>
            <h1>{props.nombre} abandonó la partida</h1>
            <h3>Sus cartas son:</h3>
            <div
                style={{
                    display: "flex",
                    columnGap: "10px",
                    rowGap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {props.cartas.map((e, i) => (
                    <img
                        src={`/cartas/${e}.png`}
                        height="200px"
                        key={i}
                        alt={e}
                    />
                ))}
            </div>
            <button
                className="btn btn-dark"
                onClick={() =>
                    props.setAbandonoPartida((old) =>
                        old.filter((e) => e.nombre !== props.nombre)
                    )
                }
            >
                Aceptar
            </button>
        </div>
    );
}
