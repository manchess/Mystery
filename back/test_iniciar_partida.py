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

    # Creo la partida sin contraseña con anfitrion J1-id:1
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )

    # uno a la partida 1 al jugador J2-id:2
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J2", "color": "#DB4437", "password": ""}
    )

    cliente.post("/", json={"nombre": "J3"})
    cliente.post(
        "/nueva-partida/",
        json={"nombre": "P2", "anfitrion": "J3", "color": "#4285F4", "password": ""},
    )


def test_iniciar_partida_ok(mocker):

    mocker.patch(
        "main.ConnectionManager.send_personal_message", return_value=None, autospec=True
    )

    respuesta = cliente.put("/partida/1/iniciar")
    assert respuesta.status_code == 200


def test_iniciar_partida_insuf_jugadores(mocker):
    respuesta = cliente.put("/partida/2/iniciar")
    assert respuesta.status_code == 400
    assert respuesta.json() == {"detail": "Cantidad insuficiente de jugadores"}


def test_iniciar_partida_inexistente(mocker):
    respuesta = cliente.put("/partida/3/iniciar")
    assert respuesta.status_code == 404
    assert respuesta.json() == {"detail": "Partida no encontrada"}


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
