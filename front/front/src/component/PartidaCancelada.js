import { useHistory } from "react-router";

/**
 * Componente que muestra cuando una partida se cancela si
 * el anfitrion abandona .
 */
export default function PartidaCancelada() {
    const history = useHistory();
    return(
        <div className="popup">
            <h1>El anfitrion ha abandonado la partida</h1>
            <button className="btn btn-dark" onClick={(e)=>history.push("/inicio")}>
                Volver al lobby
            </button>
        </div>
    )
}