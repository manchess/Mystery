from fastapi.testclient import TestClient
from main import app
from pony.orm import *
from modelos.modelo_partida import db
from modelos.modelo_carta import hay_cartas, insertar_cartas_db
from modelos.modelo_partida import hay_colores, insertar_colores_db

cliente = TestClient(app)


def setup_module(module):
    if not hay_cartas():
        insertar_cartas_db()

    if not hay_colores():
        insertar_colores_db()

    cliente.post("/", json={"nombre": "J1"})
    cliente.post("/", json={"nombre": "J2"})
    cliente.post("/", json={"nombre": "J3"})
    cliente.post("/", json={"nombre": "J4"})
    cliente.post("/", json={"nombre": "J5"})
    cliente.post("/", json={"nombre": "J6"})
    cliente.post("/", json={"nombre": "J7"})


def test_unir_jugador_ok():
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )

    response = cliente.post(
        "/partida/1/unirse", json={"nombre": "J2", "color": "#DB4437", "password": ""}
    )

    assert response.status_code == 200
    assert response.json()["id_jugador"] == 2
    assert response.json()["id_partida"] == 1
    assert response.json()["anfitrion"] == "J1"
    assert len(response.json()["jugadores"]) == 2


def test_unir_jugador_inexistente():
    response = cliente.post(
        "/partida/1/unirse", json={"nombre": "J10", "color": "#DB4437", "password": ""}
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "No se encontró jugador"}


def test_unir_jugador_partida_llena():

    cliente.post(
        "/partida/1/unirse", json={"nombre": "J3", "color": "#F4B400", "password": ""}
    )
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J4", "color": "#0F9D58", "password": ""}
    )
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J5", "color": "#AB47BC", "password": ""}
    )
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J6", "color": "#26C6DA", "password": ""}
    )

    response = cliente.post(
        "/partida/1/unirse", json={"nombre": "J7", "color": "#F4B400", "password": ""}
    )
    assert response.status_code == 202
    assert response.json() == {"detail": "La partida esta llena"}


def test_unir_a_partida_iniciada(mocker):
    if not hay_cartas():
        insertar_cartas_db()

    mocker.patch(
        "main.ConnectionManager.send_personal_message", return_value=None, autospec=True
    )

    cliente.put("/partida/1/iniciar")
    response = cliente.post(
        "/partida/1/unirse", json={"nombre": "J7", "color": "#F4B400", "password": ""}
    )

    assert response.status_code == 202
    assert response.json() == {"detail": "La partida ya fue iniciada"}


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
