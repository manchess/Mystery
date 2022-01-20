from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from modelos import db
from modelos.modelo_partida import *
from modelos.modelo_jugador import *
from modelos.modelo_carta import *
import json
from random import randint

app = FastAPI()

db.bind(provider="sqlite", filename="mistery.sqlite", create_db=True)
db.generate_mapping(create_tables=True)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Nueva partida
@app.post("/nueva-partida/")
def crear_partida(datos: Partida):
    partida = nueva_partida(datos)
    manager.active_connections.update({partida["id_partida"]: []})

    return partida


# Listar partidas
@app.get("/partidas/")
def listar_partidas():
    partidas = devolver_partidas()

    return partidas


# Nuevo jugador
@app.post("/")
def agregar_jugador(datos: Jugador):
    jugador = nuevo_jugador(datos)
    id_jugador = jugador.id_jugador
    return id_jugador


@app.post("/partida/{id_partida}/unirse")
async def unir_jugador(id_partida: int, datos: Unirse):
    datos = unir_a_partida(id_partida, datos)

    return datos


@app.put("/partida/{id_partida}/iniciar")
async def iniciar_partida(id_partida: int):
    iniciar_la_partida(id_partida)

    jugadores = asignar_posiciones(id_partida)

    for jugador in jugadores:
        evento = {
            "evento": "Nueva posicion",
            "nombre": jugador["nombre"],
            "x": jugador["posX"],
            "y": jugador["posY"],
            "recinto": jugador["recinto"],
        }
        await manager.broadcast(id_partida, json.dumps(evento))

    cartas_jugadores = repartir_cartas(id_partida)

    for dicionario in cartas_jugadores:
        for key, value in dicionario.items():
            evento_cartas = {
                "evento": "Reparto de cartas",
                "id_jugador": key,
                "cartas": value,
            }

            await manager.send_personal_message(json.dumps(evento_cartas), key)

    jugadores_ordenados = sorted(jugadores, key=lambda x: x["orden"])
    evento = {
        "evento": "Nuevo turno",
        "turno": 1,
        "nombre": jugadores_ordenados[0]["nombre"],
    }

    await manager.broadcast(id_partida, json.dumps(evento))

    return cartas_jugadores


# Tirar dado
@app.get("/partida/{id_partida}/{id_jugador}/tirardado")
async def tirar_dado(id_partida: int, id_jugador: int):
    numero_dado = randint(1, 6)
    evento = {"evento": "Tiraron el dado", "valor": numero_dado}
    await manager.broadcast(id_partida, json.dumps(evento))

    casilleros_posibles = movimientos_posibles(id_jugador, numero_dado)

    return {"casilleros": casilleros_posibles, "dado": numero_dado}


# Pasar turno
@app.put("/partida/{id_partida}/pasarturno")
async def pasar_turno(id_partida: int):

    nuevo_turno = pasar_el_turno(id_partida)
    siguiente_jugador = obtenerJugador(
        id_partida, str(nuevo_turno["proximo_turno"]), "orden"
    )

    evento = {
        "evento": "Nuevo turno",
        "turno": nuevo_turno["proximo_turno"],
        "nombre": siguiente_jugador.nombre,
    }

    await manager.broadcast(id_partida, json.dumps(evento))

    if not nuevo_turno["uso_bruja"]:
        evento2 = {"evento": "Perdio bruja", "nombre": nuevo_turno["nombre"]}
        await manager.broadcast(id_partida, json.dumps(evento2))

    return nuevo_turno


# Sospechar
@app.get("/partida/{id_partida}/{id_jugador}/sospechar")
async def cartas_para_sospecha(
    id_partida: int, id_jugador: int, victima: str, monstruo: str
):

    resp = cartas_de_sospecha(id_jugador, victima, monstruo)

    # Cartas que coinciden con la sospecha
    resp2 = cartas_coincidentes(
        id_partida, id_jugador, victima, monstruo, resp["recinto"]
    )

    evento = {
        "evento": "Nueva sospecha",
        "nombre": resp["nombre"],
        "id_jugador": id_jugador,
        "cartas": resp["cartas"],
        "nombreResponde": resp2["nombreResponde"],
    }

    await manager.broadcast(id_partida, json.dumps(evento))

    # Enviamos un mensaje al que tiene que responder xq tiene mas de 1 carta
    if len(resp2["cartas"]) > 1:
        evento = {
            "evento": "Responder sospecha",
            "id_jugador": resp2["id_jugador"],
            "nombreResponde": resp2["nombreResponde"],
            "cartas": resp2["cartas"],
        }

        await manager.send_personal_message(json.dumps(evento), resp2["id_responde"])

    # Si hay una sola carta, mandamos mensaje al que sospecho
    else:
        evento = {
            "evento": "Carta de sospecha",
            "nombre": resp2["nombre"],
            "nombreResponde": resp2["nombreResponde"],
            "carta": "NINGUNA" if not resp2["cartas"] else resp2["cartas"],
        }
        await manager.send_personal_message(json.dumps(evento), id_jugador)

    return {"sospecha": resp, "respuesta": resp2}


# Responder sospecha
@app.get("/partida/{id_jugador}/{id_responde}/responder-sospecha")
async def responder_sospecha(id_jugador: int, id_responde: int, carta: str):
    jugador = obtenerJugador(0, str(id_responde), "id")

    evento = {
        "evento": "Carta de sospecha",
        "nombreResponde": jugador.nombre,
        "carta": carta,
    }
    await manager.send_personal_message(json.dumps(evento), id_jugador)


# Mover ficha
@app.put("/partida/{id_partida}/{id_jugador}/moverficha")
async def actualizar_tablero(id_partida: int, id_jugador: int, posicion: Posicion):
    resp = actualizar_posicion(id_jugador, posicion)

    evento = {
        "evento": "Nueva posicion",
        "nombre": resp["jugador"]["nombre"],
        "x": resp["jugador"]["posX"],
        "y": resp["jugador"]["posY"],
        "recinto": resp["jugador"]["recinto"],
    }

    await manager.broadcast(id_partida, json.dumps(evento))

    if resp["cayo_en_trampa"]:
        await pasar_turno(id_partida)

    return resp["jugador"]


# Entrar recinto
@app.put("/partida/{id_partida}/{id_jugador}/entrar-recinto")
async def ingresar_recinto(id_partida: int, id_jugador: int):
    jugador = actualizar_recinto(id_jugador)

    evento = {
        "evento": "Nueva posicion",
        "nombre": jugador["nombre"],
        "x": jugador["posX"],
        "y": jugador["posY"],
        "recinto": jugador["recinto"],
    }

    await manager.broadcast(id_partida, json.dumps(evento))

    return jugador


# Acusar
@app.put("/partida/{id_partida}/{id_jugador}/acusar")
async def cartas_para_acusacion(id_partida: int, id_jugador: int, acusacion: Acusacion):

    resp = verificar_cartas(id_partida, id_jugador, acusacion)

    evento = {
        "evento": "Nueva acusacion",
        "nombre": resp["nombre"],
        "cartas": resp["cartas"],
        "correcta": resp["correcta"],
    }

    await manager.broadcast(id_partida, json.dumps(evento))

    if not resp["correcta"]:
        print("Una acusacion fue incorrecta y pasamos el turno")
        await pasar_turno(id_partida)

    return resp


# Usar Bruja de Salem
@app.put("/partida/{id_partida}/{id_jugador}/usar-bruja-salem")
async def usar_bruja(id_partida: int, id_jugador: int):

    resp = obtener_una_carta_misterio(id_partida, id_jugador)

    evento = {
        "evento": "Bruja Salem",
        "nombre": resp["nombre"],
        "carta_misterio": resp["carta"],
    }

    evento2 = {
        "evento": "Jugo la Bruja",
        "nombre": resp["nombre"],
    }

    await manager.send_personal_message(json.dumps(evento), id_jugador)

    await manager.broadcast(id_partida, json.dumps(evento2))

    return resp["carta"]


# Enviar mensaje al chat
@app.post("/partida/{id_partida}/enviar-mensaje")
async def enviar_mensaje(id_partida: int, mensaje: Mensaje):
    jugador = obtenerJugador(id_partida, mensaje.nombre, "nombre")

    evento = {
        "evento": "Nuevo mensaje",
        "nombre": mensaje.nombre,
        "texto": mensaje.texto,
        "color": jugador.color,
    }

    await manager.broadcast(id_partida, json.dumps(evento))

    return {"nombre": mensaje.nombre, "texto": mensaje.texto}


@app.get("/partida/{id_partida}/sumario")
def enviar_sumario(id_partida: int):
    datos_partida = obtener_sumario(id_partida)

    return datos_partida


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = dict()
        self.active_connection_personal: dict = dict()

    async def connect(self, websocket: WebSocket, id_partida: int, id_jugador: int):
        await websocket.accept()
        self.active_connections[id_partida].append(websocket)
        self.active_connection_personal[id_jugador] = websocket
        jugador = ultimo_jugador(id_partida)
        evento = {"evento": "Nuevo Jugador", "jugador": jugador}
        await self.broadcast(id_partida, json.dumps(evento))

    def disconnect(self, websocket: WebSocket, id_partida: int, id_jugador: int):
        self.active_connections[id_partida].remove(websocket)
        self.active_connection_personal.pop(id_jugador)

    async def broadcast(self, id_partida: int, message: str):
        for connection in self.active_connections[id_partida]:
            await connection.send_text(message)

    async def send_personal_message(self, message: str, id_jugador: int):
        await self.active_connection_personal[id_jugador].send_text(message)


manager = ConnectionManager()


@app.websocket("/partida/{id_partida}/{id_jugador}")
async def unir_partida(websocket: WebSocket, id_partida: int, id_jugador: int):
    await manager.connect(websocket, id_partida, id_jugador)
    try:
        while 1:
            data = await websocket.receive_text()
            pass
    except WebSocketDisconnect:
        manager.disconnect(websocket, id_partida, id_jugador)
        try:
            partida = obtenerPartida(id_partida)
            jugador = obtenerJugador(id_partida, str(id_jugador), "id")
            if partida.iniciada and partida.turno == jugador.orden:
                await pasar_turno(id_partida)
            jugador = abandonar_partida(id_partida, id_jugador)
            evento = {
                "evento": "Jugador desconectado",
                "jugador": jugador["nombre"],
                "cartas": jugador["cartas"],
                "turno": partida.turno,
            }
            await manager.broadcast(id_partida, json.dumps(evento))
        except ObjectNotFound:
            print("No se encontró la partida o el jugador")

    return True


if __name__ == "main":
    if not hay_cartas():
        insertar_cartas_db()

    if not hay_colores():
        insertar_colores_db()
