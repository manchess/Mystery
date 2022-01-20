import SuperCheckbox from "./SuperCheckbox";

/**
 * Componente que renderiza un informe.
 *
 */
export default function Informe(props) {
    const victimas = [
        "Conde",
        "Condesa",
        "Ama de llaves",
        "Mayordomo",
        "Doncella",
        "Jardinero",
    ];

    const monstruos = [
        "Drácula",
        "Frankenstein",
        "Hombre Lobo",
        "Fantasma",
        "Momia",
        "Dr. Jekyll & Mr. Hyde",
    ];

    const recintos = [
        "Cochera",
        "Alcoba",
        "Biblioteca",
        "Laboratorio",
        "Panteón",
        "Salón",
        "Bodega",
        "Vestíbulo",
    ];

    return (
        <div
            className="informe"
            style={{ opacity: props.iniciada ? "100%" : "0%" }}
        >
            <h1 style={{ marginBottom: 0 }}>INFORME</h1>
            <div>
                <div className="encabezadoInforme">MONSTRUO</div>
                <div className="cuerpoInforme">
                    {monstruos.map((e, i) => (
                        <div className="itemInforme" key={i}>
                            <div className="nombreItemInforme">{e}</div>
                            <SuperCheckbox />
                            <input className="textboxInforme" />
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className="encabezadoInforme">VÍCTIMA</div>
                <div className="cuerpoInforme">
                    {victimas.map((e, i) => (
                        <div className="itemInforme" key={i}>
                            <div className="nombreItemInforme">{e}</div>
                            <SuperCheckbox />
                            <input className="textboxInforme" />
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className="encabezadoInforme">RECINTO</div>
                <div className="cuerpoInforme">
                    {recintos.map((e, i) => (
                        <div className="itemInforme" key={i}>
                            <div className="nombreItemInforme">{e}</div>
                            <SuperCheckbox />
                            <input className="textboxInforme" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
