from fastapi.testclient import TestClient
from main import app
from pony.orm import *
from modelos.modelo_partida import db

cliente = TestClient(app)


def test_nuevo_jugador():
    respuesta = cliente.post("/", json={"nombre": "J1"}).json()

    assert respuesta == 1


def test_jugador_existente():
    respuesta = cliente.post("/", json={"nombre": "J1"})
    assert respuesta.status_code == 404
    assert respuesta.json() == {"detail": "Nombre de jugador en uso"}


def test_nombre_jugador_vacio():
    try:
        cliente.post("/", json={"nombre": ""})
    except ValueError:
        pass


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
