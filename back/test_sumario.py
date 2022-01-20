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

    # Creo un jugadores
    cliente.post("/", json={"nombre": "J1"})

    # Creo la partida sin contraseña con anfitrion J1-id:1
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )


def test_sumario(mocker):
    mocker.patch(
        "main.obtener_sumario",
        return_value={
            "ganador": {
                "nombre": "J1",
                "cartas": ["CONDE", "DRACULA", "ALCOBA"],
                "sospechas": 0,
            },
            "perdedores": [{"nombre": "J2", "cartas": [], "sospechas": 0}],
        },
    )

    resp = cliente.get("/partida/1/sumario").json()

    assert resp["ganador"]["nombre"] == "J1"
    assert len(resp["perdedores"]) == 1


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
