from fastapi.testclient import TestClient
from pony.orm.core import ObjectNotFound
from main import app
from pony.orm import *
from modelos.modelo_partida import db
from modelos.modelo_carta import insertar_cartas_db, hay_cartas
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

    # Creo la partida con anfitrion J1 - id:1
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )

    cliente.post(
        "/nueva-partida/",
        json={"nombre": "P2", "anfitrion": "J3", "color": "#4285F4", "password": ""},
    )

    # uno a la partida 1 al jugador J2 - id:2
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J2", "color": "#DB4437", "password": ""}
    )
    # uno a la partida 2 al jugador J4 - id:4 y al jugador J5 - id:5
    cliente.post(
        "/partida/2/unirse", json={"nombre": "J4", "color": "#DB4437", "password": ""}
    )
    cliente.post(
        "/partida/2/unirse", json={"nombre": "J5", "color": "#F4B400", "password": ""}
    )


def test_pasar_turno_en_partida_inexistente():
    try:
        cliente.put("/partida/3/pasarturno")
    except ObjectNotFound:
        pass


def test_pasar_turno(mocker):
    mocker.patch(
        "main.ConnectionManager.send_personal_message", return_value=None, autospec=True
    )

    cliente.put("/partida/1/iniciar")
    respuesta = cliente.put("/partida/1/pasarturno").json()
    assert respuesta["proximo_turno"] == 2
    assert respuesta["nombre"] == "J1"

    respuesta2 = cliente.put("/partida/1/pasarturno").json()
    assert respuesta2["proximo_turno"] == 1


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
