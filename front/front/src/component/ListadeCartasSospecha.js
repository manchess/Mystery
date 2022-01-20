import React, { useState } from "react";
import BotonEnviarsospecha from "./BotonEnviarsospecha";
/**
 * Lista cartas para seleccionar y elegir una sospecha
 * @param  {object} props Id de jugador y de partida
 */
export default function ListadeCartasSospecha(props) {
    /**
     * Estado que guarda el nombre de la víctima seleccionada
     * @param  {string} "" Nombre de la víctima
     */
    const [victima, setVictima] = useState("");
    /**
     * Estado que guarda el nombre del monstruo seleccionado
     * @param  {string} "" Nombre del monstruo
     */
    const [monstruo, setMonstruo] = useState("");

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

    return (
        <div className="popup">
            <h1>Sospechar</h1>
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
            </div>
            <div style={{ display: "flex", columnGap: "10px" }}>
                <BotonEnviarsospecha
                    data={{
                        id_jugador: props.id_jugador,
                        id_partida: props.id_partida,
                        victima: victima,
                        monstruo: monstruo,
                    }}
                    setSospechando={props.setSospechando}
                    disabled={victima === "" || monstruo === ""}
                />
                <button
                    className="btn btn-dark"
                    onClick={(e) => {
                        setMonstruo("");
                        setVictima("");
                        props.setSospechando(false);
                    }}
                >
                    Cancelar sospecha
                </button>
            </div>
        </div>
    );
}
