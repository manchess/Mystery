import React, { useState } from "react";
import BotonEnviarAcusacion from "./BotonEnviarAcusacion";
/**
 * Lista cartas para seleccionar y elegir una sospecha
 * @param  {object} props Id de jugador y de partida
 */
export default function ListadeCartas(props) {
    /**
     * Estado que guarda el nombre de la victima seleccionada
     * @param  {string} "" Nombre de la victima
     */
    const [victima, setVictima] = useState("");
    /**
     * Estado que guarda el nombre del monstruo seleccionado
     * @param  {string} "" Nombre del monstruo
     */
    const [monstruo, setMonstruo] = useState("");

    /**
     * Estado que guarda el nombre del recinto seleccionado
     * @param  {string} "" Nombre del recinto
     */
    const [recinto, setRecinto] = useState("");

    const victimas = [
        {
            nombre: "Conde",
            valor: "CONDE",
        },
        {
            nombre: "Condesa",
            valor: "CONDESA",
        },
        {
            nombre: "Ama de llaves",
            valor: "AMADELLAVES",
        },
        {
            nombre: "Mayordomo",
            valor: "MAYORDOMO",
        },
        {
            nombre: "Doncella",
            valor: "DONCELLA",
        },
        {
            nombre: "Jardinero",
            valor: "JARDINERO",
        },
    ];

    const monstruos = [
        {
            nombre: "Drácula",
            valor: "DRACULA",
        },
        {
            nombre: "Frankenstein",
            valor: "FRANKENSTEIN",
        },
        {
            nombre: "Hombre Lobo",
            valor: "HOMBRELOBO",
        },
        {
            nombre: "Fantasma",
            valor: "FANTASMA",
        },
        {
            nombre: "Momia",
            valor: "MOMIA",
        },
        {
            nombre: "Dr. Jekyll & Mr. Hyde",
            valor: "JEKYLLHYDE",
        },
    ];

    const recintos = [
        {
            nombre: "Cochera",
            valor: "COCHERA",
        },
        {
            nombre: "Alcoba",
            valor: "ALCOBA",
        },
        {
            nombre: "Biblioteca",
            valor: "BIBLIOTECA",
        },
        {
            nombre: "Laboratorio",
            valor: "LABORATORIO",
        },
        {
            nombre: "Panteón",
            valor: "PANTEON",
        },
        {
            nombre: "Salón",
            valor: "SALON",
        },
        {
            nombre: "Bodega",
            valor: "BODEGA",
        },
        {
            nombre: "Vestíbulo",
            valor: "VESTIBULO",
        },
    ];

    return (
        <div className="popup">
            <h1>Acusar</h1>
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                        <select
                            className="form-select form-select-sm"
                            onChange={(e) => setVictima(e.target.value)}
                            defaultValue=""
                        >
                            <option value="">Víctimas</option>
                            {victimas.map((e, key) => (
                                <option value={e.valor} key={key}>
                                    {e.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    {victima !== "" ? (
                        <img
                            style={{ marginTop: "10px" }}
                            src={`/cartas/${victima}.png`}
                            height="200px"
                            alt={victima}
                        />
                    ) : null}
                </div>
                {/* //Monstruos */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                        <select
                            className="form-select form-select-sm"
                            onChange={(e) => setMonstruo(e.target.value)}
                            defaultValue=""
                        >
                            <option value="">Monstruos</option>
                            {monstruos.map((e, key) => (
                                <option value={e.valor} key={key}>
                                    {e.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    {monstruo !== "" ? (
                        <img
                            style={{ marginTop: "10px" }}
                            src={`/cartas/${monstruo}.png`}
                            height="200px"
                            alt={monstruo}
                        />
                    ) : null}
                </div>
                {/* //Recintos */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                        <select
                            className="form-select form-select-sm"
                            onChange={(e) => setRecinto(e.target.value)}
                            defaultValue=""
                        >
                            <option value="">Recintos</option>
                            {recintos.map((e, key) => (
                                <option value={e.valor} key={key}>
                                    {e.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    {recinto !== "" ? (
                        <img
                            style={{ marginTop: "10px" }}
                            src={`/cartas/${recinto}.png`}
                            height="200px"
                            alt={recinto}
                        />
                    ) : null}
                </div>
            </div>
            <div style={{ display: "flex", columnGap: "10px" }}>
                <BotonEnviarAcusacion
                    data={{
                        id_jugador: props.id_jugador,
                        id_partida: props.id_partida,
                        victima: victima,
                        monstruo: monstruo,
                        recinto: recinto,
                    }}
                    setAcusando={props.setAcusando}
                    disabled={
                        victima === "" || monstruo === "" || recinto === ""
                    }
                />
                <button
                    className="btn btn-dark"
                    onClick={(e) => {
                        setMonstruo("");
                        setVictima("");
                        setRecinto("");
                        props.setAcusando(false);
                    }}
                >
                    Cancelar acusación
                </button>
            </div>
        </div>
    );
}
