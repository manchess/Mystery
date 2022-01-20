from fastapi.testclient import TestClient
from main import app
from pony.orm import *
from modelos.modelo_partida import db

cliente = TestClient(app)


def setup_module(module):
    cliente.post("/", json={"nombre": "J1"})
    cliente.post("/", json={"nombre": "J2"})


def test_nueva_partida():
    response = cliente.post(
        "/nueva-partida/",
        json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4", "password": "a"},
    )

    assert response.status_code == 200
    assert response.json()["nombre"] == "P1"
    assert response.json()["anfitrion"] == "J1"
    assert response.json()["jugadores"][0]["color"] == "#4285F4"
    assert response.json()["password"] == "a"


def test_nueva_partida_con_jugador_inexistente():
    response = cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J3", "color": "#4285F4"}
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Jugador no encontrado"


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
