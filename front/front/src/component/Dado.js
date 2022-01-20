/**
 * Obtiene el resultado del dado desde el back.
 * @param {numero} props
 * @returns renderizado HTML.
 */
export default function Dado(props) {
    return (
        <div className="resultadoDado" data-testid="dado">
            {props.numero}
        </div>
    );
}
