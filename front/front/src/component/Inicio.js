import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { asigNombrejugador, nuevoJugador } from "../services";

/**
 * Esta función renderiza el inicio del juego.
 * @returns Renderizado JSX
 */
export default function Inicio() {
    /**
     * Ayuda a redireccionar al jugador hacia la lista de partidas.
     */
    const history = useHistory();
    /**
     * Estado que nos ayuda a guardar el nombre del jugador.
     * @param  {""} nombre Parámetros ingresados por teclado
     * @param  {object} Guarda la cadena de caracteres ingresados
     */
    const [newjugador, setNombre] = useState({
        nombre: "",
    });
    /**
     * Nos permite visualizar los input por teclado del usuario en consola
     * y guardarlos en la constante "newpartida".
     * @param  {Evento} evento Evento generado por input del usuario.
     */
    const controlEvents = (evento) => {
        console.log(evento.target.value);
        setNombre({
            ...newjugador,
            [evento.target.name]: evento.target.value,
        });
    };

    /**
     * Esta función registra un jugador nuevo en la base de datos.
     * @param {Evento} e Evento del click
     */
    const enviarJugador = (e) => {
        e.preventDefault();
        nuevoJugador({ nombre: newjugador.nombre })
            .then((res) => {
                if (res.status === 200) {
                    history.push("/inicio");
                    asigNombrejugador({ nombre: newjugador.nombre });
                } else {
                    alert("Error desconocido. Revise la consola.");
                    console.log(res);
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    alert(
                        "Ya existe un jugador con ese nombre. Por favor elija otro."
                    );
                } else {
                    alert("Error desconocido. Revise la consola.");
                    console.error(err);
                }
            });
    };

    return (
        <div>
            <header id="header">
                <img src={`/logomisterio.png`} className="logo" alt="logo" />
            </header>

            <div
                className="card text-white bg-dark mb-3"
                style={{
                    maxWidth: "500px",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "10px",
                    padding: "10px",
                }}
            >
                <h2 style={{ textAlign: "center", color: "red" }}>Ingresar</h2>
                <form
                    onSubmit={enviarJugador}
                    style={{ display: "flex", columnGap: "10px" }}
                >
                    <input
                        placeholder="Introduce nombre de jugador"
                        autoFocus
                        className="form-control"
                        type="text"
                        name="nombre"
                        onChange={controlEvents}
                        maxLength="20"
                        required
                    />
                    <button className="btn btn-dark" type="submit">
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
}
