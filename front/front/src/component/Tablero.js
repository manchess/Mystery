import {
    faArrowDown,
    faArrowLeft,
    faArrowRight,
    faArrowUp,
    faSpider,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Casillero from "./Casillero";
import Recinto from "./Recinto";
/**
 * Calcula los casillero del tablero
 * @param  {int} x Posición del tablero
 * @param  {int} y Posición del tablero
 */
function esCasillero(x, y) {
    return x === 6 || x === 13 || y === 6 || y === 13;
}

const recintos = [
    {
        nombre: "Cochera",
        xInicio: 0,
        yInicio: 0,
        xFin: 7,
        yFin: 7,
        imagen: "cochera",
    },
    {
        nombre: "Alcoba",
        xInicio: 7,
        yInicio: 0,
        xFin: 13,
        yFin: 13,
        imagen: "alcoba",
    },
    {
        nombre: "Biblioteca",
        xInicio: 14,
        yInicio: 0,
        xFin: 19,
        yFin: 13,
        imagen: "biblioteca",
    },
    {
        nombre: "Vestíbulo",
        xInicio: 0,
        yInicio: 7,
        xFin: 7,
        yFin: 13,
        imagen: "vestibulo",
    },
    {
        nombre: "Misterio",
        xInicio: 7,
        yInicio: 7,
        xFin: 13,
        yFin: 13,
        imagen: "logomisterio",
    },
    {
        nombre: "Panteón",
        xInicio: 14,
        yInicio: 7,
        xFin: 19,
        yFin: 13,
        imagen: "panteon",
    },
    {
        nombre: "Bodega",
        xInicio: 0,
        yInicio: 14,
        xFin: 7,
        yFin: 19,
        imagen: "bodega",
    },
    {
        nombre: "Salón",
        xInicio: 7,
        yInicio: 14,
        xFin: 13,
        yFin: 19,
        imagen: "salon",
    },
    {
        nombre: "Laboratorio",
        xInicio: 14,
        yInicio: 14,
        xFin: 19,
        yFin: 19,
        imagen: "laboratorio",
    },
];

const casillerosEspeciales = [
    {
        x: 0,
        y: 6,
        color: "white",
    },
    {
        x: 0,
        y: 13,
        color: "white",
    },
    {
        x: 6,
        y: 0,
        color: "white",
    },
    {
        x: 6,
        y: 19,
        color: "white",
    },
    {
        x: 13,
        y: 0,
        color: "white",
    },
    {
        x: 13,
        y: 19,
        color: "white",
    },
    {
        x: 19,
        y: 6,
        color: "white",
    },
    {
        x: 19,
        y: 13,
        color: "white",
    },
    {
        x: 4,
        y: 6,
        color: "#3F3C29",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowDown} />
        ),
    },
    {
        x: 3,
        y: 13,
        color: "#3F3C29",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowUp} />
        ),
    },
    {
        x: 6,
        y: 10,
        color: "#3F3C29",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowLeft} />
        ),
    },
    {
        x: 6,
        y: 2,
        color: "black",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowLeft} />
        ),
    },
    {
        x: 6,
        y: 15,
        color: "black",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowLeft} />
        ),
    },
    {
        x: 10,
        y: 6,
        color: "#943C29",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowUp} />
        ),
    },
    {
        x: 13,
        y: 4,
        color: "black",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowRight} />
        ),
    },
    {
        x: 13,
        y: 10,
        color: "#3F3C29",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowRight} />
        ),
    },
    {
        x: 13,
        y: 16,
        color: "black",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowRight} />
        ),
    },
    {
        x: 15,
        y: 6,
        color: "#3F3C29",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowDown} />
        ),
    },
    {
        x: 10,
        y: 13,
        color: "#943C29",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowDown} />
        ),
    },
    {
        x: 16,
        y: 13,
        color: "#3F3C29",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faArrowUp} />
        ),
    },
    {
        x: 6,
        y: 4,
        color: "black",
        extra: () => (
            <img
                className="extraCasillero"
                src="/tablero/murcielago.svg"
                style={{ width: "30px" }}
                alt="Murciélago"
            />
        ),
    },
    {
        x: 6,
        y: 14,
        color: "black",
        extra: () => (
            <img
                className="extraCasillero"
                src="/tablero/murcielago.svg"
                style={{ width: "30px" }}
                alt="Murciélago"
            />
        ),
    },
    {
        x: 13,
        y: 3,
        color: "black",
        extra: () => (
            <img
                className="extraCasillero"
                src="/tablero/escorpion.svg"
                style={{ width: "30px" }}
                alt="Escorpión"
            />
        ),
    },
    {
        x: 13,
        y: 14,
        color: "black",
        extra: () => (
            <img
                className="extraCasillero"
                src="/tablero/escorpion.svg"
                style={{ width: "30px" }}
                alt="Escorpión"
            />
        ),
    },
    {
        x: 3,
        y: 6,
        color: "black",
        extra: () => (
            <img
                className="extraCasillero"
                src="/tablero/cobra.svg"
                style={{ width: "30px" }}
                alt="Cobra"
            />
        ),
    },
    {
        x: 14,
        y: 6,
        color: "black",
        extra: () => (
            <img
                className="extraCasillero"
                src="/tablero/cobra.svg"
                style={{ width: "30px" }}
                alt="Cobra"
            />
        ),
    },
    {
        x: 4,
        y: 13,
        color: "black",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faSpider} />
        ),
    },
    {
        x: 15,
        y: 13,
        color: "black",
        extra: () => (
            <FontAwesomeIcon className="extraCasillero" icon={faSpider} />
        ),
    },
    {
        x: 6,
        y: 6,
        color: "black",
        extra: () => (
            <img
                src="/tablero/trampa.svg"
                alt="Trampa"
                height="37px"
                style={{ position: "absolute", transform: "rotate(0.5turn)" }}
            />
        ),
    },
    {
        x: 13,
        y: 6,
        color: "black",
        extra: () => (
            <img
                src="/tablero/trampa.svg"
                alt="Trampa"
                height="37px"
                style={{ position: "absolute", transform: "rotate(0.5turn)" }}
            />
        ),
    },
    {
        x: 6,
        y: 13,
        color: "black",
        extra: () => (
            <img
                src="/tablero/trampa.svg"
                alt="Trampa"
                height="37px"
                style={{ position: "absolute" }}
            />
        ),
    },
    {
        x: 13,
        y: 13,
        color: "black",
        extra: () => (
            <img
                src="/tablero/trampa.svg"
                alt="Trampa"
                height="37px"
                style={{ position: "absolute" }}
            />
        ),
    },
];

/**
 * Obtiene propiedades de casilleros especiales como color o símbolos extra.
 * @param {int} x
 * @param {int} y
 * @returns {object}
 */
const obtCasilleroEspecial = (x, y) =>
    casillerosEspeciales.find((e) => e.x === x && e.y === y);

/**
 * Renderiza el tablero
 * @param  {object} props ID partida y jugador
 */
export default function Tablero(props) {
    return (
        <div className="tableroDiv">
            <div className="tablero">
                {[...Array(20)].map((e, i) =>
                    [...Array(20)].map((e, j) =>
                        esCasillero(i, j) ? (
                            <Casillero
                                key={j}
                                x={i}
                                y={j}
                                jugadores={props.jugadores}
                                posPosibles={props.posPosibles}
                                id_partida={props.id_partida}
                                id_jugador={props.id_jugador}
                                setPosPosibles={props.setPosPosibles}
                                color={
                                    obtCasilleroEspecial(i, j)
                                        ? obtCasilleroEspecial(i, j).color
                                        : null
                                }
                                extra={
                                    obtCasilleroEspecial(i, j)
                                        ? obtCasilleroEspecial(i, j).extra
                                        : null
                                }
                            />
                        ) : null
                    )
                )}
                {recintos.map((e, i) => (
                    <Recinto
                        key={i}
                        jugadores={props.jugadores}
                        nombre={e.nombre}
                        imagen={e.imagen}
                        xInicio={e.xInicio}
                        yInicio={e.yInicio}
                        xFin={e.xFin}
                        yFin={e.yFin}
                    />
                ))}
            </div>
        </div>
    );
}
