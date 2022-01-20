from fastapi.testclient import TestClient
from main import app
from pony.orm import *
from modelos.modelo_partida import db, movimientos_posibles
from modelos.modelo_carta import insertar_cartas_db, hay_cartas
from modelos.modelo_partida import hay_colores, insertar_colores_db

cliente = TestClient(app)


def setup_module(module):
    if not hay_cartas():
        insertar_cartas_db()

    if not hay_colores():
        insertar_colores_db()

    # Creo dos jugadores
    cliente.post("/", json={"nombre": "J1"})
    cliente.post("/", json={"nombre": "J2"})

    # Creo la partida con anfitrion J1
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )

    # uno a la P1 al jugador J2
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J2", "color": "#DB4437", "password": ""}
    )

    # Creo otros dos jugadores
    cliente.post("/", json={"nombre": "J3"})
    cliente.post("/", json={"nombre": "J4"})

    # Creo la partida con anfitrion J3
    cliente.post(
        "/nueva-partida/", json={"nombre": "P2", "anfitrion": "J3", "color": "#4285F4"}
    )

    # uno a la P2 al jugador J4
    cliente.post(
        "/partida/2/unirse", json={"nombre": "J4", "color": "#DB4437", "password": ""}
    )


def test_mover_J1(mocker):
    mocker.patch("main.pasar_turno", return_value=None, autospec=True)
    respuesta = cliente.put("/partida/1/1/moverficha", json={"x": 6, "y": 6})

    jugador = respuesta.json()
    assert jugador["id_jugador"] == 1
    assert jugador["posX"] == 6 and jugador["posY"] == 6

    respuesta = movimientos_posibles(1, 1)
    assert respuesta[:4] == [
        {"x": 5, "y": 6},
        {"x": 7, "y": 6},
        {"x": 6, "y": 5},
        {"x": 6, "y": 7},
    ]


# def test_mover_2():
#     with cliente.websocket_connect("/partida/2/3"):
#         with cliente.websocket_connect("/partida/2/4"):
#             respuesta = cliente.put("/partida/2/3/moverficha", json={"x": 10, "y": 13})

#             jugador = respuesta.json()
#             assert jugador["id_jugador"] == 3
#             assert jugador["posX"] == 10 and jugador["posY"] == 13

#             respuesta = movimientos_posibles(3, 5)
#             assert len(respuesta) == 16


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
