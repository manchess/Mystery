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

    # Creo dos jugadores
    cliente.post("/", json={"nombre": "J1"})
    cliente.post("/", json={"nombre": "J2"})

    # Creo la partida con anfitrion J1-id:1
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )

    # uno a la partida 1 al jugador J2-id:2
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J2", "color": "#DB4437", "password": ""}
    )


def test_sospechar(mocker):
    mocker.patch(
        "main.ConnectionManager.send_personal_message", return_value=None, autospec=True
    )

    cliente.put("/partida/1/1/moverficha", json={"x": 6, "y": 2})

    respuesta = cliente.get(
        "/partida/1/1/sospechar?victima=CONDE&monstruo=DRACULA"
    ).json()
    assert respuesta["sospecha"]["cartas"] == ["CONDE", "DRACULA", "COCHERA"]


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
