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
    cliente.post("/", json={"nombre": "J2"})


def test_no_hay_partidas():
    respuesta = cliente.get("/partidas/")
    assert respuesta.status_code == 200
    assert respuesta.json() == []


def test_partida_con_un_jugador():
    # Creamos partidas
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )

    respuesta = cliente.get("/partidas/")
    assert respuesta.status_code == 200
    response = respuesta.json()[0]
    assert response["id_partida"] == 1
    assert response["nombre"] == "P1"
    assert response["anfitrion"] == "J1"
    assert response["iniciada"] == False
    assert response["turno"] == None
    assert response["cantidad_jugadores"] == 1


# Vemos si no se modifican los atributos y si se actualiza el num de jugadores
def test_partida_con_dos_jugadores():
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J2", "color": "#DB4437", "password": ""}
    )

    respuesta = cliente.get("/partidas/")
    response = respuesta.json()[0]
    assert response["id_partida"] == 1
    assert response["nombre"] == "P1"
    assert response["anfitrion"] == "J1"
    assert response["iniciada"] == False
    assert response["turno"] == None
    assert response["cantidad_jugadores"] == 2


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
