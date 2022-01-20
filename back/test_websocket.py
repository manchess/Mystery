from fastapi.testclient import TestClient
from main import app
from pony.orm import *
from modelos.modelo_partida import db
from modelos.modelo_partida import hay_colores, insertar_colores_db

cliente = TestClient(app)


def setup_module(module):
    if not hay_colores():
        insertar_colores_db()

    cliente.post("/", json={"nombre": "J1"})
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )

    cliente.post("/", json={"nombre": "J2"})
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J2", "color": "#DB4437", "password": ""}
    )


def test_ws():

    with cliente.websocket_connect("/partida/1/2") as ws:
        data = ws.receive_json()
        assert data["evento"] == "Nuevo Jugador"
        assert data["jugador"]["orden"] == 2
        assert data["jugador"]["id_jugador"] == 2
        assert data["jugador"]["color"] == "#DB4437"
        assert data["jugador"]["turno"] == 0


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
