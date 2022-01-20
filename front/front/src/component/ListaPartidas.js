import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { unirJugador, traerPartidas, obtNombrejugador } from "../services";
import BotonCrear from "./BotonCrear";
import BotonUnirse from "./BotonUnirse";
import BotonAct from "./BotonAct";
import PreUnirse from "./PreUnirse";

/**
 * Muestra una lista con las partidas aún no iniciadas.
 * @returns Renderizado JSX
 */
export default function ListaPartidas() {
    /**
     * Ayuda a redireccionar al jugador a la partida.
     */
    const history = useHistory();
    /**
     * Estado que nos guarda las partidas no iniciadas obtenidas del back.
     * @param  {list} [] Lista de partidas obtenidas del back
     */
    const [partidas, setPartidas] = useState([]);
    /**
     * Estado para guardar los datos antes de unirse a una partida.
     * @param  {object} null
     */
    const [prePartida, setPrePartida] = useState(null);
    /**
     * Estado para guardar el color elegido.
     * @param  {string} null
     */
    const [color, setColor] = useState(null);
    /**
     * Estado que guarda la contraseña ingresada.
     * @param  {string} ""
     */
    const [password, setPassword] = useState("");

    /**
     * Obtiene las partidas desde el back.
     */
    function obtPartidas() {
        traerPartidas()
            .then((res) => {
                console.log(res);
                setPartidas(res.data);
            })
            .catch((err) => {
                alert("No hay partidas. ¡Crea una nueva!");
                console.log(err);
            });
    }

    /**
     * Redirecciona al jugador a la partida y envía al jugador al back.
     * @param {Evento} e
     */
    function Unirsepartida(e) {
        e.preventDefault();
        unirJugador({
            id_partida: prePartida.id_partida,
            nombre: obtNombrejugador(),
            color: color,
            password: password,
        })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    history.push({
                        pathname: `/partidas/${res.data.id_partida}`,
                        state: { ...res.data, nombre: prePartida.nombre },
                    });
                } else if (res.status === 202) {
                    if (res.data.detail === "La partida ya fue iniciada") {
                        alert("La partida ya fue iniciada");
                        obtPartidas();
                    } else if (res.data.detail === "La partida esta llena") {
                        alert("La partida esta completa");
                        obtPartidas();
                    }
                    setPrePartida(null);
                    setColor(null);
                    setPassword("");
                }
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    alert("Contraseña incorrecta!");
                } else if (err.response.status === 405) {
                    alert("La partida no existe");
                } else {
                    alert("Ocurrió un error. Revise la consola.");
                    console.error(err);
                }
            });
    }
    /**
     * Renderiza la lista de partidas actualizada.
     */
    useEffect(() => {
        obtPartidas();
    }, []);

    return (
        <div style={{ maxWidth: "750px", margin: "auto" }}>
            <h1 style={{ color: "white" }}>Unirse a una partida</h1>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {prePartida ? (
                    <PreUnirse
                        partida={prePartida}
                        Unirsepartida={Unirsepartida}
                        setColor={setColor}
                        setPrePartida={setPrePartida}
                        color={color}
                        setPassword={setPassword}
                        password={password}
                    />
                ) : null}
                <table
                    className="tablaPartidas"
                    style={{ marginBottom: "10px" }}
                >
                    <thead>
                        <tr>
                            <th width="40px"></th>
                            <th width="50%">Partida</th>
                            <th>Anfitrión</th>
                            <th width="140px">Cant. Jugadores</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partidas.map((e, key) => (
                            <tr key={key}>
                                <td>
                                    {e.password ? (
                                        <FontAwesomeIcon icon={faLock} />
                                    ) : null}
                                </td>
                                <td>{e.nombre}</td>
                                <td>{e.anfitrion}</td>
                                <td>
                                    <FontAwesomeIcon icon={faUserFriends} />{" "}
                                    {e.cantidad_jugadores}
                                    /6
                                </td>
                                <td>
                                    <BotonUnirse
                                        partida={e}
                                        unirse={setPrePartida}
                                        setColor={setColor}
                                        disabled={e.cantidad_jugadores === 6}
                                    />
                                </td>
                            </tr>
                        ))}
                        {partidas.length === 0 ? (
                            <tr style={{ pointerEvents: "none" }}>
                                <td colSpan={4}>
                                    <i style={{ color: "gray" }}>
                                        No hay partidas
                                    </i>
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
            <div style={{ display: "flex", columnGap: "10px" }}>
                <BotonAct actpartidas={obtPartidas} />
                <BotonCrear />
            </div>
        </div>
    );
}
