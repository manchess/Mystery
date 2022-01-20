/**
 * Componente que renderiza una carta
 * @param  {object} props Cartas
 */
export default function Carta(props) {
    return (
        <div className="divCarta">
            <img
                className="carta"
                src={`/cartas/${props.carta}.png`}
                height="200px"
                alt={props.carta}
            />
        </div>
    );
}
