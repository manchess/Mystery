from fastapi.testclient import TestClient
from fastapi.exceptions import HTTPException
from pony.orm import core
from modelos.modelo_jugador import nuevo_jugador
from modelos.modelo_jugador import JugadorDB, Jugador
from modelos.modelo_partida import *
from modelos.modelo_carta import *

from main import app
from pony.orm import *

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
    cliente.post("/", json={"nombre": "J5"})

    # Creo la partida sin contraseña con anfitrion J1-id:1
    cliente.post(
        "/nueva-partida/", json={"nombre": "P1", "anfitrion": "J1", "color": "#4285F4"}
    )

    # uno a la partida 1 al jugador J2-id:2
    cliente.post(
        "/partida/1/unirse", json={"nombre": "J2", "color": "#F4B400", "password": ""}
    )


def test_devolver_partidas():

    colores_disp = ["#AB47BC", "#26C6DA", "#0F9D58", "#DB4437"]

    resp = devolver_partidas()

    assert resp[0]["cantidad_jugadores"] == 2
    assert resp[0]["anfitrion"] == "J1"

    # Colores
    for c in colores_disp:
        assert c in resp[0]["colores"]

    assert resp[0]["finalizada"] == False
    assert resp[0]["id_partida"] == 1
    assert resp[0]["iniciada"] == False
    assert resp[0]["nombre"] == "P1"


@db_session
def test_obtener_jugador_ok():

    resp = obtenerJugador(1, "1", "id")
    assert resp == JugadorDB[1]
    assert resp.nombre == "J1"
    assert resp.id_jugador == 1


def test_obtener_jugador_inexistente():

    try:
        obtenerJugador(1, "Jugador", "nombre")
    except core.ObjectNotFound:
        pass


def test_nueva_partida_ok():

    datos = Partida(nombre="P2", anfitrion="J2", color="#4285F4")
    partida = nueva_partida(datos)

    assert partida["nombre"] == "P2"
    assert partida["anfitrion"] == "J2"
    assert partida["color"] == "#4285F4"
    assert partida["id_partida"] == 2
    assert partida["id_jugador"] == 2
    assert len(partida["jugadores"])


def test_nueva_partida_jugador_inexistente():

    datos2 = Partida(nombre="P2", anfitrion="JX", color="#4285F4")
    try:
        nueva_partida(datos2)
    except HTTPException:
        pass


def test_ultimo_jugador():
    resp = ultimo_jugador(1)

    assert resp["id_jugador"] == 1


def test_unir_a_partida_ok():
    datos_unir = Unirse(nombre="J3", color="#AB47BC", password="")
    resp = unir_a_partida(1, datos_unir)
    assert resp["id_jugador"] == 3
    assert resp["id_partida"] == 1
    assert resp["anfitrion"] == "J1"


def test_eliminar_jugador():
    resp = eliminar_jugador(1, 1)

    assert resp == "J1"


def test_eliminar_jugador_que_no_existe():
    try:
        eliminar_jugador(1, 11)
    except core.ObjectNotFound:
        pass


@db_session
def test_unir_a_partida_iniciada():

    # Creamos una partida iniciada
    PartidaDB(
        id_partida=10,
        nombre="p_iniciada",
        anfitrion="J4",
        iniciada=True,
        finalizada=False,
    )
    datos_unir = Unirse(nombre="J5", color="#AB47BC", password="")

    try:
        unir_a_partida(10, datos_unir)
    except HTTPException:
        pass


def test_movimientos_verticales():
    casilleros = []
    casillas_disp = list(range(0, 7))
    casillas_disp.extend(list(range(12, 17)))
    movimientos_verticales(6, 0, 6, casilleros, False, True)

    for d in casilleros:
        assert d["y"] in casillas_disp


@db_session
def test_obtener_partida():
    assert obtenerPartida(1) == PartidaDB[1]


def test_obtener_partida_que_no_existe():
    try:
        obtenerPartida(11)
    except core.ObjectNotFound:
        pass


@db_session
def test_unir_a_partida_llena():

    # Lista de jugadores
    jug_llena = [
        Jugador(nombre="j_1"),
        Jugador(nombre="j_2"),
        Jugador(nombre="j_3"),
        Jugador(nombre="j_4"),
        Jugador(nombre="j_5"),
        Jugador(nombre="j_6"),
    ]

    jugador_7 = nuevo_jugador(Jugador(nombre="j_7"))

    lista_jugadores = []
    for j in jug_llena:
        lista_jugadores.append(nuevo_jugador(j))

    PartidaDB(
        id_partida=11,
        nombre="p_llena",
        anfitrion="j_1",
        iniciada=False,
        finalizada=False,
        jugadores=lista_jugadores,
    )

    datos = Unirse(nombre=jugador_7.nombre, color="#26C6DA")
    try:
        unir_a_partida(11, datos)
    except HTTPException:
        pass


@db_session
def test_pasar_el_turno_ok():
    for i in range(7, 13):
        JugadorDB[i].orden = i - 6
    iniciar_la_partida(11)
    assert len(PartidaDB[11].jugadores) == 6
    resp = pasar_el_turno(11)
    assert resp["proximo_turno"] == 2
    assert resp["nombre"] == "j_1"


@db_session
def test_iniciar_la_partida():
    j30 = JugadorDB(
        id_jugador=30,
        nombre="J30",
        perdio=False,
        turno=0,
        sospechas=0,
    )

    j31 = JugadorDB(id_jugador=31, nombre="J31", perdio=False, turno=0, sospechas=0)

    p30 = PartidaDB(
        id_partida=30,
        nombre="P30",
        anfitrion="J30",
        iniciada=False,
        finalizada=False,
        jugadores=[j30, j31],
    )

    iniciar_la_partida(30)

    assert p30.iniciada == True
    assert p30.turno == 1


def test_asignar_posiciones():
    resp = asignar_posiciones(11)
    for j in resp:
        assert j["posX"] != None and j["posY"] != None


def test_movimientos_horizontales():
    casilleros = []
    resp = movimientos_horizontales(10, 13, 6, casilleros, False, True)
    casillas_disp = [i for i in range(3, 17)]
    for d in casilleros:
        assert d["x"] in casillas_disp


def teardown_module(module):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()
