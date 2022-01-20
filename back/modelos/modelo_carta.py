import re
from pony.orm import *
from pydantic.main import BaseModel
from .modelo_partida import db, PartidaDB
from .modelo_jugador import JugadorDB
import random
from datetime import datetime

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


class CartaDB(db.Entity):
    id_carta = PrimaryKey(int, auto=True)
    nombre = Required(str, unique=True)
    tipo = Required(str)
    jugadores = Set("JugadorDB", reverse="cartas")
    partidas = Set("PartidaDB")
    jugadores_acusacion = Set("JugadorDB", reverse="cartas_acusacion")


class Acusacion(BaseModel):
    victima: str
    monstruo: str
    recinto: str


@db_session
def hay_cartas():
    """Verifica que haya o no cartas en la base de datos

    Parametros
    ----------
    None

    Retorno
    -------
    None

    """

    return len(list(select(c for c in CartaDB)))


@db_session
def insertar_cartas_db():
    """Crea las cartas del juego misterio

    Parametros
    ----------
    None

    Retorno
    -------
    None

    """

    if hay_cartas():
        return None

    monstruos = [
        "DRACULA",
        "FRANKENSTEIN",
        "HOMBRELOBO",
        "FANTASMA",
        "MOMIA",
        "JEKYLLHYDE",
    ]

    victimas = ["CONDE", "CONDESA", "AMADELLAVES", "MAYORDOMO", "DONCELLA", "JARDINERO"]

    recintos = [
        "ALCOBA",
        "BIBLIOTECA",
        "BODEGA",
        "COCHERA",
        "LABORATORIO",
        "PANTEON",
        "SALON",
        "VESTIBULO",
    ]

    for m in monstruos:
        CartaDB(nombre=m, tipo="MONSTRUO")

    for v in victimas:
        CartaDB(nombre=v, tipo="VICTIMA")

    for r in recintos:
        CartaDB(nombre=r, tipo="RECINTO")

    CartaDB(nombre="BRUJASALEM", tipo="ESPECIAL")


@db_session
def repartir_cartas(id_partida: int):
    """Distribuye las cartas entre los jugadores de la partida
     y se eligen las del sobre Misterio

    Se seleccionan las 3 cartas del sobre Misterio
    y se reparte el resto de cartas a los jugadores

    Parametros
    ----------
    id_partida: int
        Identificador de la partida

    Retorno
    -------
    list
        lista de objetos tipo dict, de la forma

        [{id_jugador: cartas}]

    """

    partida = PartidaDB[id_partida]

    # Obtenemos por separado los distintos tipos de cartas
    # Como las creamos una sola vez a las cartas, los id van a ser fijos
    # 1 ~ 6 cartas de monstruos
    # 7 ~ 12 cartas de victimas
    # 13 ~ 20 cartas de recintos
    # 21 carta de salem

    monstruos = [CartaDB[i] for i in range(1, 7)]
    victimas = [CartaDB[i] for i in range(7, 13)]
    recintos = [CartaDB[i] for i in range(13, 21)]
    salem = CartaDB[21]

    # Mezclamos
    for i in range(3):
        random.shuffle(monstruos)
        random.shuffle(victimas)
        random.shuffle(recintos)

    # Elegimos las cartas del misterio
    monstruo = monstruos[random.randint(0, len(monstruos) - 1)]
    victima = victimas[random.randint(0, len(victimas) - 1)]
    recinto = recintos[random.randint(0, len(recintos) - 1)]

    print(
        f"Las cartas del misterio son: {monstruo.nombre}, {victima.nombre} y {recinto.nombre}"
    )

    # Agregamos las cartas misterio a la partida
    partida.cartas.add([monstruo, victima, recinto])

    # Removemos las cartas de misterio para repartir el resto a los jugadores
    monstruos.remove(monstruo)
    victimas.remove(victima)
    recintos.remove(recinto)

    cartas = [*monstruos, *victimas, *recintos, salem]
    random.shuffle(cartas)

    jugadores = list(partida.jugadores.order_by(desc(JugadorDB.orden)))

    x = 0
    for carta in cartas:

        jugadores[x].cartas.add(carta)

        if x == len(jugadores) - 1:
            x = 0
        else:
            x += 1

    for jugador in jugadores:
        cartasDeJugador = [c.nombre for c in jugador.cartas]

    lista_cartas = []

    for jugador in jugadores:
        cartasDeJugador = [c.nombre for c in jugador.cartas]
        d = {jugador.id_jugador: cartasDeJugador}

        lista_cartas.append(d)

    return lista_cartas


@db_session
def cartas_de_sospecha(id_jugador: int, victima: str, monstruo: str):
    """Muestra las cartas de la sospecha a todos los jugadores

    Parametros
    ----------
    id_jugador: int
        Identificador del jugador
    victima: str
        Una de las cartas de la sospecha
    monstruo: str
        Una de las cartas de la sospecha

    Retorno
    -------
    dict
        nombre: str
            Nombre del jugador que hace la sospecha
        cartas: list
            Terna de cartas de la sospecha
        recinto: str
            Recinto donde se encuentra el jugador al hacer la sospecha

    """

    jugador = JugadorDB[id_jugador]
    jugador.sospechas += 1

    recinto = dict_recintos[(jugador.posX, jugador.posY)]

    cartas = [victima, monstruo, recinto]

    return {"nombre": jugador.nombre, "cartas": cartas, "recinto": recinto}


@db_session
def finalizar_partida(partida: PartidaDB, ganador):
    """Verifica las cartas de la acusacion con las del sobre Misterio

    Parametros
    ----------
    partida: PartidaDB
        Objeto PartidaDB. Es la partida a finalizar
    ganador:
        identificador del jugador
    acusacion: Acusacion
        Victima: str
        Monstruo: str
        Recinto: str

    Retorno
    -------
    dict
        nombre: str
            nombre del jugador que hace la acusación
        cartas: list
            terna de cartas de la acusación
        correcta: bool
            Indica si las cartas de la acusación coinciden con el sobre Misterio

    """

    for jugador in partida.jugadores:
        if jugador == ganador:
            continue

        jugador.perdio = True

    partida.finalizada = True
    partida.turno = None
    partida.tiempo_fin = datetime.now()


@db_session
def verificar_cartas(id_partida: int, id_jugador: int, acusacion: Acusacion):
    """Verifica las cartas de la acusacion con las del sobre Misterio

    Parametros
    ----------
    id_partida: int
        Identificador de la partida
    id_jugador: int
        Identificador del jugador
    acusacion: Acusacion
        Victima: str
        Monstruo: str
        Recinto: str

    Retorno
    -------
    dict
        nombre: str
            Nombre del jugador que hace la acusación
        cartas: list
            Terna de cartas de la acusación
        correcta: bool
            Indica si las cartas de la acusación coinciden con el sobre Misterio

    """

    jugador = JugadorDB[id_jugador]

    partida = PartidaDB[id_partida]

    cartasMisterio = list(select(c.nombre for c in partida.cartas))

    victima = acusacion.victima
    monstruo = acusacion.monstruo
    recinto = acusacion.recinto

    carta_victima = CartaDB.get(nombre=acusacion.victima)
    carta_monstruo = CartaDB.get(nombre=acusacion.monstruo)
    carta_recinto = CartaDB.get(nombre=acusacion.recinto)

    jugador.cartas_acusacion.add([carta_victima, carta_monstruo, carta_recinto])

    if (
        victima in cartasMisterio
        and monstruo in cartasMisterio
        and recinto in cartasMisterio
    ):

        finalizar_partida(partida, jugador)
    else:
        jugador.perdio = True

        cant_noperdieron = count(j for j in partida.jugadores if not j.perdio)
        if cant_noperdieron == 0:
            finalizar_partida(partida, None)

    return {
        "nombre": jugador.nombre,
        "cartas": [victima, monstruo, recinto],
        "correcta": partida.finalizada,
    }


@db_session
def cartas_coincidentes(
    id_partida: int, id_jugador: int, victima: str, monstruo: str, recinto: str
):
    """Verifica si algún jugador tiene una carta que coincida con la sospecha

    Parametros
    ----------
    id_partida: int
        Identificador de la partida
    id_jugador: int
        Identificador del jugador
    victima: str
        Carta de victima
    monstruo: str
        Carta de monstruo
    recinto: str
        Carta de recinto

    Retorno
    -------
    dict
        nombre: str
            Nombre del jugador que hace la sospecha
        id_jugador: int
            Identificador del jugador que hace la sospecha
        nombreResponde: str
            Nombre del jugador que responde la sospecha
        id_responde: int
            Identificador del jugador que responde
        cartas: list
            Lista de cartas que coinciden con la sospecha

    """

    partida = PartidaDB[id_partida]
    jugador = JugadorDB[id_jugador]

    j = None

    lista_jugadores = list(
        select(j for j in partida.jugadores).order_by(JugadorDB.orden)
    )
    idx = lista_jugadores.index(jugador)
    lista_coincidentes = []
    nombre_responde = "Nadie"

    # Si es el ultimo jugador de la lista, tomamos todos los anteriores que son los de su "derecha"
    if idx == len(lista_jugadores) - 1:
        jugadores_de_la_derecha = [*lista_jugadores[:idx]]

    elif lista_jugadores.index(jugador) == 0:
        jugadores_de_la_derecha = [*lista_jugadores[1:]]

    else:
        jugadores_de_la_derecha = [*lista_jugadores[idx + 1 :], *lista_jugadores[:idx]]

    # Vemos los jugadores de la derecha y si alguno tiene una carta de la sospecha
    for j in jugadores_de_la_derecha:

        cartas_jugador = list(select(c.nombre for c in j.cartas))

        if victima in cartas_jugador:
            lista_coincidentes.append(victima)

        if monstruo in cartas_jugador:
            lista_coincidentes.append(monstruo)

        if recinto in cartas_jugador:
            lista_coincidentes.append(recinto)

        # Si ya hay alguien con una carta de la sospecha terminamos
        if len(lista_coincidentes):
            nombre_responde = j.nombre
            break

    return {
        "nombre": jugador.nombre,
        "id_jugador": jugador.id_jugador,
        "nombreResponde": nombre_responde,
        "id_responde": j.id_jugador if j else -1,
        "cartas": lista_coincidentes,
    }


@db_session
def obtener_una_carta_misterio(id_partida: int, id_jugador: int):
    """Obtiene una carta del sobre Misterio

    Parámetros
    ----------
    id_partida: int
        Identificador de la partida
    id_jugador: int
        Identificador del jugador que usa la Bruja de Salem

    Retorno
    -------
    dict
        nombre: str
            Nombre del jugador que usa la Bruja de Salem
        carta: objeto CartaDB
            Una de las 3 cartas del sobre Misterio seleccionada al azar

    """
    jugador = JugadorDB[id_jugador]
    partida = PartidaDB[id_partida]

    nombre = jugador.nombre
    lista = list(select(c.nombre for c in partida.cartas))
    print(lista)
    carta = lista[random.randint(0, 2)]

    jugador.cartas.remove(CartaDB[21])

    return {"nombre": nombre, "carta": carta}
