import SelectorColores from "./SelectorColores";
/**
 * Renderiza la opcion de elegir color antes de unirse
 * opcionalmente permite tipear una contraseña si la partida lo solcita.
 * @param  {props} props
 */
export default function PreUnirse(props) {
    return (
        <div className="popup">
            <h1>Unirse a {props.partida.nombre}</h1>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "20px",
                    alignItems: "center",
                }}
            >
                <SelectorColores
                    colores={props.partida.colores}
                    setColor={props.setColor}
                    autoFocus={true}
                    color={props.color}
                />
                {props.partida.password ? (
                    <input
                        type="password"
                        placeholder="Contraseña"
                        required
                        onChange={(e) => props.setPassword(e.target.value)}
                    />
                ) : null}
                <div
                    style={{
                        display: "flex",
                        columnGap: "10px",
                        justifyContent: "center",
                    }}
                >
                    <button
                        className="btn btn-dark"
                        onClick={props.Unirsepartida}
                        disabled={
                            !props.color ||
                            (props.partida.password && !props.password)
                        }
                    >
                        Unirse
                    </button>
                    <button
                        className="btn btn-dark"
                        onClick={(e) => {
                            props.setColor(null);
                            props.setPassword("");
                            props.setPrePartida(null);
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
