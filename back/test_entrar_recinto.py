from fastapi.testclient import TestClient
from modelos.modelo_partida import hay_colores, insertar_colores_db
from main import app
from pony.orm import *
from modelos.modelo_partida import db
from modelos.modelo_carta import insertar_cartas_db, hay_cartas
import pytest

cliente = TestClient(app)


def setup_module(module):

    if not hay_cartas():
        insertar_cartas_db()

    if not hay_colores():
        insertar_colores_db()

    # Creo dos jugadores
    cliente.post("/", json={"nombre": "J1"})
    cliente.post("/", json={"nombre": "J2"})
    cliente.post("/", json={"nombre": "J3"})
    cliente.post("/", json={"nombre": "J4"})

    # Creo la partida P1 con anfitrion J1, la partida P2 con el anfitrion J3
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )
    cliente.post(
        "/nueva-partida/", json={"nombre": "P2", "anfitrion": "J3", "color": "#4285F4"}
    )

    # uno a la P1 al jugador J2
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J2", "color": "#DB4437", "password": ""}
    )
    cliente.post(
        "/partida/2/unirse", json={"nombre": "J4", "color": "#DB4437", "password": ""}
    )


@pytest.mark.parametrize("posicion, esperado", [((6, 2), "COCHERA"), ((6, 3), "")])
def test_j1_entra_recinto_cochera(posicion, esperado):
    x, y = posicion

    cliente.put("/partida/1/1/moverficha", json={"x": x, "y": y})

    respuesta = cliente.put("/partida/1/1/entrar-recinto").json()

    assert respuesta["recinto"] == esperado


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
