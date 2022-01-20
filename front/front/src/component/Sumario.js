import { useHistory } from "react-router";
/**
 * Renderiza las estadisticas al finalizar una partida
 * @param {Object} sumario
 */
export default function Sumario({ sumario }) {
    const history = useHistory();

    return (
        <div className="popup">
            {Object.keys(sumario.ganador).length > 0 ? (
                <>
                    <h1>{sumario.ganador.nombre} ha ganado la partida</h1>
                    <div style={{ display: "flex", columnGap: "10px" }}>
                        {sumario.ganador.cartas.map((e, i) => (
                            <img
                                src={`/cartas/${e}.png`}
                                height="200px"
                                key={i}
                                alt={e}
                            />
                        ))}
                    </div>
                    <h3>Además, hizo {sumario.ganador.sospechas} sospechas</h3>
                </>
            ) : (
                <>
                    <h1>Nadie ganó la partida</h1>
                    <h3>Las cartas del Misterio son:</h3>
                    <div style={{ display: "flex", columnGap: "10px" }}>
                        {sumario.cartas_misterio.map((e, i) => (
                            <img
                                src={`/cartas/${e}.png`}
                                height="200px"
                                key={i}
                                alt={e}
                            />
                        ))}
                    </div>
                </>
            )}
            {sumario.perdedores.map((e, i) =>
                e.cartas.length === 0 ? (
                    <h3>
                        {e.nombre} no acuso. hizo {e.sospechas} sospechas
                    </h3>
                ) : (
                    <>
                        <h3>
                            {e.nombre} acusó: {e.cartas.map((e, i) => e + " ")}-
                            hizo {e.sospechas} sospechas
                        </h3>
                    </>
                )
            )}
            <h3>Se realizaron {sumario.total_sospechas} sospechas en total</h3>
            <h3>La partida duró {sumario.tiempo}</h3>
            <button
                className="btn btn-dark"
                onClick={(e) => history.push("/inicio")}
            >
                Volver al inicio
            </button>
        </div>
    );
}
