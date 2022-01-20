from fastapi.testclient import TestClient
from fastapi.websockets import WebSocket
from main import app
from pony.orm import *
from modelos.modelo_partida import db

cliente = TestClient(app)


def setup_module(module):
    # Creo dos jugadores
    cliente.post("/", json={"nombre": "J1"})

    # Creo la partida sin contraseña con anfitrion J1-id:1
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )


def test_chat():
    resp = cliente.post(
        "/partida/1/enviar-mensaje", json={"nombre": "J1", "texto": "chat"}
    )

    assert resp.json() == {"nombre": "J1", "texto": "chat"}


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
