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

    cliente.post("/", json={"nombre": "J3"})
    cliente.post("/", json={"nombre": "J4"})

    # Creo otra partida (P2) sin contraseña con anfitrion J3-id:3
    cliente.post(
        "/nueva-partida/", json={"nombre": "P2", "anfitrion": "J3", "color": "#F4B400"}
    )
    # Uno a la partida 2 al jugador J4-id:4
    cliente.post(
        "/partida/2/unirse", json={"nombre": "J4", "color": "#0F9D58", "password": ""}
    )


def test_responder_sospecha_coincidentes(mocker):
    mocker.patch(
        "main.ConnectionManager.send_personal_message", return_value=None, autospec=True
    )
    mocker.patch(
        "main.cartas_coincidentes",
        return_value={
            "nombre": "J1",
            "id_jugador": 1,
            "nombreResponde": "J2",
            "id_responde": 2,
            "cartas": ["COCHERA"],
        },
    )

    cliente.put("/partida/1/1/moverficha", json={"x": 6, "y": 2})

    respuesta = cliente.get(
        "/partida/1/1/sospechar?victima=CONDE&monstruo=DRACULA"
    ).json()
    assert respuesta["respuesta"]["cartas"] == ["COCHERA"]


def test_responder_sospecha_sin_coincidentes(mocker):
    mocker.patch(
        "main.ConnectionManager.send_personal_message", return_value=None, autospec=True
    )
    mocker.patch(
        "main.cartas_coincidentes",
        return_value={
            "nombre": "J3",
            "id_jugador": 3,
            "nombreResponde": "Nadie",
            "id_responde": 4,
            "cartas": [],
        },
    )

    cliente.put("/partida/2/3/moverficha", json={"x": 6, "y": 2})

    respuesta = cliente.get(
        "/partida/2/3/sospechar?victima=CONDE&monstruo=DRACULA"
    ).json()
    assert respuesta["respuesta"]["cartas"] == []


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
