from fastapi.testclient import TestClient
from main import app
from pony.orm import *
from modelos.modelo_partida import db

cliente = TestClient(app)


def setup_module(module):
    cliente.post("/", json={"nombre": "J1"})
    cliente.post("/", json={"nombre": "J2"})

    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )


def test_tirar_dado_en_partida_inexistente():
    try:
        cliente.get("/partida/2/tirardado")
    except KeyError:
        pass


def test_tirar_dado():
    respuesta = cliente.get("/partida/1/1/tirardado")

    assert respuesta.status_code == 200
    assert respuesta.json()["dado"] in range(1, 7)


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
