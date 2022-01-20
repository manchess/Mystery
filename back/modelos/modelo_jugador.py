from pony.orm import *
from .modelo_partida import db
from fastapi.exceptions import HTTPException
from pydantic import BaseModel


class JugadorDB(db.Entity):
    id_jugador = PrimaryKey(int, auto=True)
    nombre = Required(str, unique=True)
    color = Optional(str)
    partida = Optional("PartidaDB")
    cartas = Set("CartaDB", reverse="jugadores")
    orden = Optional(int)
    posX = Optional(int)
    posY = Optional(int)
    recinto = Optional(str)
    perdio = Required(bool)
    turno = Required(int, default=0)
    sospechas = Required(int, default=0)
    cartas_acusacion = Set("CartaDB", reverse="jugadores_acusacion")


class Jugador(BaseModel):
    nombre: str


class Posicion(BaseModel):
    x: int
    y: int


@db_session
def nuevo_jugador(datos: Jugador):
    """Agrega un nuevo jugador a la DB

    Parametros
    ----------
    datos: Jugador
        nombre: nombre del jugador a crear

    Retorno
    -------
    str
        nombre del jugador creado

    """

    if JugadorDB.exists(nombre=datos.nombre):
        raise HTTPException(status_code=404, detail="Nombre de jugador en uso")

    jugador = JugadorDB(nombre=datos.nombre, perdio=False)

    flush()

    return jugador


@db_session
def actualizar_recinto(id_jugador: int):
    """Actualiza el atributo recinto de un jugador

    Parametros
    ----------
    id_jugador: int
        identificador del jugador

    Retorno
    -------
    dict
        diccionario con nombre de jugador y recinto al que entra

    """

    jugador = JugadorDB[id_jugador]

    posicion = (jugador.posX, jugador.posY)

    dict_recintos = {
        (6, 2): "COCHERA",
        (4, 6): "VESTIBULO",
        (6, 10): "VESTIBULO",
        (3, 13): "VESTIBULO",
        (6, 15): "BODEGA",
        (13, 4): "BIBLIOTECA",
        (15, 6): "PANTEON",
        (13, 10): "PANTEON",
        (16, 13): "PANTEON",
        (13, 16): "LABORATORIO",
        (10, 6): "ALCOBA",
        (10, 13): "SALON",
    }

    recinto = dict_recintos.get(posicion)

    if recinto:
        jugador.recinto = recinto
    else:
        jugador.recinto = ""

    return jugador.to_dict()
