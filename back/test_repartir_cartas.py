from fastapi.testclient import TestClient
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
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )

    cliente.post("/", json={"nombre": "J2"})
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J2", "color": "#DB4437", "password": ""}
    )

    cliente.post("/", json={"nombre": "J3"})
    cliente.post(
        "/nueva-partida/",
        json={"nombre": "P2", "anfitrion": "J3", "color": "#4285F4", "password": ""},
    )


def test_repartir_cartas(mocker):
    mocker.patch(
        "main.ConnectionManager.send_personal_message", return_value=None, autospec=True
    )
    respuesta = cliente.put("/partida/1/iniciar")

    assert 9 == len(respuesta.json()[0]["2"])


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
