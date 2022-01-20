from fastapi.testclient import TestClient
from main import app, verificar_cartas
from pony.orm import *
from modelos.modelo_partida import db, hay_colores, insertar_colores_db
import pytest

cliente = TestClient(app)


def setup_module(module):
    # if not hay_colores():
    #     insertar_colores_db()

    # Creo un jugador
    cliente.post("/", json={"nombre": "J1"})

    # Creo la partida sin contraseña con anfitrion J1-id:1
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )


@pytest.mark.parametrize("entra, sale", [(1, False), (2, False), (3, True)])
def test_acusar(mocker, entra, sale):

    mocker.patch(
        "main.verificar_cartas",
        return_value={
            "nombre": "J" + str(entra),
            "cartas": ["CONDE", "DRACULA", "ALCOBA"],
            "correcta": sale,
        },
        autospec=True,
    )

    mocker.patch("main.pasar_turno", return_value=None, autospec=True)

    resp = cliente.put(
        f"/partida/1/{entra}/acusar",
        json={"victima": "CONDE", "monstruo": "DRACULA", "recinto": "ALCOBA"},
    )
    assert resp.json()["correcta"] == sale


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
