from fastapi.exceptions import HTTPException
from pony.orm import *
from pony.orm.core import ObjectNotFound
from pydantic import BaseModel
from random import randint, shuffle
from typing import Optional as fOptional
from datetime import datetime


db = Database()


from .modelo_jugador import JugadorDB, Posicion


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


dict_posiciones = {
    "COCHERA": [(6, 2)],
    "VESTIBULO": [(4, 6), (6, 10), (3, 13)],
    "BODEGA": [(6, 15)],
    "BIBLIOTECA": [(13, 4)],
    "PANTEON": [(15, 6), (13, 10), (16, 13)],
    "LABORATORIO": [(13, 16)],
    "ALCOBA": [(10, 6)],
    "SALON": [(10, 13)],
}


class PartidaDB(db.Entity):
    id_partida = PrimaryKey(int, auto=True)
    nombre = Required(str)
    anfitrion = Required(str)
    iniciada = Required(bool)
    jugadores = Set("JugadorDB")
    cartas = Set("CartaDB")
    turno = Optional(int)
    finalizada = Required(bool)
    colores = Set("ColorDB")
    password = Optional(str, default="")
    tiempo_inicio = Optional(datetime)
    tiempo_fin = Optional(datetime)


class ColorDB(db.Entity):
    color = Required(str)
    partidas = Set("PartidaDB")


from .modelo_carta import CartaDB


class Unirse(BaseModel):
    nombre: str
    color: str
    password: fOptional[str] = None


class Partida(BaseModel):
    nombre: str
    anfitrion: str
    color: str
    password: fOptional[str] = ""


class Mensaje(BaseModel):
    nombre: str
    texto: str


@db_session
def obtenerJugador(id_partida: int, dato: str, tipo: str) -> JugadorDB:
    """Obtener un jugador desde la BD

    Parametros
    ----------
    id_partida: int
        Identificador de la partida
    dato: str
        Dato con el que vamos a buscar al jugador
    tipo: str
        Id, orden, nombre las formas en las que podemos buscar

    Retorno
    -------
    JugadorDB
        Instancia de jugador

    """

    if tipo == "id":
        jugador = JugadorDB.get(id_jugador=int(dato))

    elif tipo == "orden":
        partida = PartidaDB[id_partida]
        jugador = select(j for j in partida.jugadores if j.orden == int(dato)).get()

    elif tipo == "nombre":
        jugador = JugadorDB.get(nombre=dato)

    if not jugador:
        raise ObjectNotFound(JugadorDB)

    return jugador


@db_session
def nueva_partida(datos: Partida) -> dict:
    """Agrega una partida nueva a la DB

    Parametros
    ----------
    datos: Partida
        nombre: str
            Nombre de la nueva partida
        anfitrion: str
            Nombre del jugador que crea la partida
        color: str
            Color que va a tener el jugador en la partida
        password: str
            Contraseña de la partida

    Retorno
    -------
    dict
        Diccionario con nombre, anfitrion, color, password, id_partida,
        id_jugador y jugadores

    """

    datos_dict = datos.dict()
    jugadores = []
    colores = list(select(c for c in ColorDB if c.color != datos.color))

    partida = PartidaDB(
        nombre=datos.nombre,
        iniciada=False,
        anfitrion=datos.anfitrion,
        finalizada=False,
        tiempo_inicio=datetime.now(),
        tiempo_fin=datetime.now(),
    )

    flush()

    try:
        jugador = obtenerJugador(partida.id_partida, datos.anfitrion, "nombre")
    except ObjectNotFound:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")

    if datos.password != None:
        partida.password = datos.password

    # Relacionamos los colores a la partida
    for c in colores:
        partida.colores.add(c)

    # Relacionamos al jugador con la partida
    partida.set(jugadores=[jugador])

    # Seteamos el jugador a su estado original
    jugador.set(
        perdio=False,
        turno=0,
        sospechas=0,
        recinto="",
    )

    # Eliminamos del jugador las cartas si es que tiene y las de la acusacion
    for cj in jugador.cartas:
        jugador.cartas.remove(cj)

    for acj in jugador.cartas_acusacion:
        jugador.cartas_acusacion.remove(acj)

    # Orden y color del jugador en la partida
    jugador.set(orden=1, color=datos.color)

    for jugador in partida.jugadores:
        jugadores.append(jugador.to_dict())

    # datos_dict tiene nombre, anfitrion y agregamos todos estos
    datos_dict.update(
        {
            "id_partida": partida.id_partida,
            "id_jugador": jugador.id_jugador,
            "jugadores": jugadores,
        }
    )

    return datos_dict


@db_session
def devolver_partidas():
    """Devuelve una lista con todas las partidas

    Parametros
    ----------
    ninguno

    Retorno
    -------
    list
        lista con todos los datos de las partidas
        (id, nombre, anfitrión, etc)

    """

    partidas = []

    # Obtenemos todas las partidas no iniciadas y las metemos en una lista
    query = select(p for p in PartidaDB if not p.iniciada).order_by(
        PartidaDB.id_partida
    )
    for partida in query:
        colores_disponibles = list(select(c.color for c in partida.colores))
        dict_partidas = {}
        dict_partidas.update({"colores": colores_disponibles})
        dict_partidas.update(partida.to_dict())
        dict_partidas.update({"password": bool(partida.password)})
        numJugadores = len(partida.jugadores)
        dict_partidas.update({"cantidad_jugadores": numJugadores})
        partidas.append(dict_partidas)

    print(partidas)
    return partidas


@db_session
def unir_a_partida(id_partida: int, datos: Unirse):
    """Une a un jugador a una partida dado su nombre y el id de la partida

    Parametros
    ----------
    id_partida: int
        identificador de la partida
    datos: Unirse
        nombre: str
            Nombre del jugador que se unirá a la partida
        color: str
            Color que va a tener el jugador en la partida
        password: str
            Contraseña de la partida

    Retorno
    -------
    dict
        Diccionario con id_jugador, id_partida, anfitrion y lista de jugadores

    """

    try:
        partida = PartidaDB[id_partida]
    except ObjectNotFound:
        raise HTTPException(status_code=405, detail="No se encontró la partida")

    try:
        jugador = obtenerJugador(id_partida, datos.nombre, "nombre")
    except ObjectNotFound:
        raise HTTPException(status_code=404, detail="No se encontró jugador")

    if datos.password != partida.password:
        raise HTTPException(status_code=400, detail="Password incorrecta")

    # Partida iniciada
    if partida.iniciada:
        raise HTTPException(status_code=202, detail="La partida ya fue iniciada")

    # Partida llena
    if len(partida.jugadores) >= 6:
        raise HTTPException(status_code=202, detail="La partida esta llena")

    print(
        f"ANTES DEL SET Colores de partida: {list(select(c.color for c in partida.colores))}"
    )

    # Orden del jugador en la partida y color
    jugador.set(
        orden=max(j.orden for j in partida.jugadores) + 1,
        color=datos.color,
        perdio=False,
        turno=0,
        sospechas=0,
        recinto="",
    )

    # Removemos las cartas del jugador / acusacion
    for cj in jugador.cartas:
        jugador.cartas.remove(cj)

    for acj in jugador.cartas_acusacion:
        jugador.cartas_acusacion.remove(acj)

    print(f"Colores de partida: {list(select(c.color for c in partida.colores))}")

    # Obtenemos el color en la entidad y lo sacamos de los colores disponibles.
    color_de_jugador = select(
        c for c in partida.colores if c.color == datos.color
    ).get()

    print(color_de_jugador)

    partida.colores.remove(color_de_jugador)

    print(
        f"DESPUES Colores de partida: {list(select(c.color for c in partida.colores))}"
    )

    # Relacionamos al jugador con la partida
    partida.jugadores.add(jugador)
    # Obtener jugadores de la partida
    query = partida.jugadores
    # Lista donde metemos todo los jugadores de una partida
    jugadores = []

    for j in query:
        jugadores.append(j.to_dict())

    jugadores.sort(key=lambda x: x.get("orden"))

    commit()

    return {
        "id_jugador": jugador.id_jugador,
        "id_partida": partida.id_partida,
        "anfitrion": partida.anfitrion,
        "jugadores": jugadores,
    }


@db_session
def ultimo_jugador(id_partida: int):
    """Devuelve los datos del jugador que se acaba de unir

    Parametros
    ----------
    id_partida: int
        Identificador de la partida

    Retorno
    -------
    dict
        Diccionario con los datos del jugador que se unió:
            id_jugador: int
                Identificador del jugador
            nombre: str
                Nombre del jugador
            color: str
                Color seleccionado por el jugador
            orden: int
                Orden que se le asigna al entrar a la partida
            posX: int
                Posición 'x' de inicio en el tablero
            posY: int
                Posición 'y' de inicio en el tablero
            recinto: str
                Recinto donde se encuentra el jugador (en un principio, en ninguno)
            perdio: bool
                Si perdió o no
            turno: int
                Cantidad de turnos jugados
            sospechas: int
                Cantidad de sospechas realizadas

    """

    partida = PartidaDB[id_partida]
    query = select(jugadores for jugadores in partida.jugadores).order_by(
        desc(JugadorDB.orden)
    )

    try:
        jugador = list(query)[0]
        return jugador.to_dict()
    except IndexError:
        return None


@db_session
def eliminar_jugador(id_partida: int, id_jugador: int):
    """Elimina a un jugador de la partida

    Parametros
    ----------
    id_partida: int
        Identificador de la partida
    id_jugador: int
        Identificador del jugador

    Retorno
    -------
    str
        nombre del jugador que elimino

    """

    partida = PartidaDB[id_partida]
    jugador = JugadorDB[id_jugador]

    color_jugador = select(c for c in ColorDB if c.color == jugador.color).get()
    partida.colores.add(color_jugador)
    jugador.set(orden=None, color="")
    partida.jugadores.remove(jugador)

    return jugador.nombre


@db_session
def iniciar_la_partida(id_partida: int):
    """'Inicia' la partida (la marca como iniciada) cuando hay al menos 2 jugadores

    Parametros
    ----------
    id_partida: int
        Identificador de la partida

    Retorno
    -------
    None

    """
    try:
        partida = PartidaDB[id_partida]

    except ObjectNotFound:
        raise HTTPException(status_code=404, detail="Partida no encontrada")

    if len(partida.jugadores) < 2:
        raise HTTPException(
            status_code=400, detail="Cantidad insuficiente de jugadores"
        )

    partida.set(iniciada=True, turno=1, tiempo_inicio=datetime.now())


@db_session
def pasar_el_turno(id_partida: int):
    """Pasa el turno al siguiente jugador

    Parametros
    ----------
    id_partida: int
        Identificador de la partida

    Retorno
    -------
    dict
        Diccionario con el que será el próximo turno, el nombre del jugador que
        terminó su turno y si este último usó o no la carta de la Bruja de Salem

        proximo_turno: int
            El próximo turno de la partida
        nombre: str
            Nombre del jugador que terminó su turno
        uso_bruja: bool
            Indica si usó la Bruja de Salem o no

    """

    uso_bruja = True

    partida = PartidaDB[id_partida]
    jugadores = select(j for j in partida.jugadores).sort_by(JugadorDB.orden)

    jugador_del_turno = select(j for j in jugadores if j.orden == partida.turno).get()

    turnos = [j.orden for j in list(jugadores)]
    turnos_np = [j.orden for j in list(jugadores) if not j.perdio]

    if jugador_del_turno.turno == 0 and CartaDB[21] in jugador_del_turno.cartas:
        uso_bruja = False

    jugador_del_turno.turno += 1

    if jugador_del_turno.perdio:
        idx = turnos.index(partida.turno)

        if idx > len(turnos_np) - 1:
            partida.turno = turnos_np[0]
        else:
            partida.turno = turnos_np[idx]

    else:

        idx = turnos_np.index(partida.turno)

        if idx == len(turnos_np) - 1:
            partida.turno = turnos_np[0]
        else:
            partida.turno = turnos_np[idx + 1]

    return {
        "proximo_turno": partida.turno,
        "nombre": jugador_del_turno.nombre,
        "uso_bruja": uso_bruja,
    }


@db_session
def asignar_posiciones(id_partida: int):
    """Pone a los jugadores de una partida en entradas aleatorias en el tablero

    Parametros
    ----------
    id_partida: int
        Identificador de la partida

    Retorno
    -------
    list
        Lista de diccionarios con los datos de cada jugador
            id_jugador: int
                Identificador del jugador
            nombre: str
                Nombre del jugador
            color: str
                Color seleccionado por el jugador
            orden: int
                Orden que se le asigna al entrar a la partida
            posX: int
                Posición 'x' de inicio en el tablero
            posY: int
                Posición 'y' de inicio en el tablero
            recinto: str
                Recinto donde se encuentra el jugador (en un principio, en ninguno)
            perdio: bool
                Si perdió o no
            turno: int
                Cantidad de turnos jugados
            sospechas: int
                Cantidad de sospechas realizadas

    """

    posiciones_de_inicio = [
        (6, 0),
        (13, 0),
        (6, 19),
        (13, 19),
        (0, 6),
        (0, 13),
        (19, 6),
        (19, 13),
    ]

    partida = PartidaDB[id_partida]

    jugadores = list(partida.jugadores)

    shuffle(posiciones_de_inicio)
    shuffle(jugadores)

    for jugador in jugadores:
        posicion = posiciones_de_inicio[randint(0, len(posiciones_de_inicio) - 1)]
        jugador.posX, jugador.posY = posicion
        jugador.recinto = ""
        posiciones_de_inicio.remove(posicion)

    return [j.to_dict() for j in jugadores]


def movimientos_horizontales(
    posX: int,
    posY: int,
    movimientos: int,
    casilleros: list,
    recinto: bool,
    agregar: bool = False,
):
    """Casillas posibles a las que se puede llegar con 'm' movimientos

    Muestra los casilleros a los que puedo ir en una fila del tablero

    Parametros
    ----------
    posX: int
        Posicion horizontal
    posY: int
        Posicion vetical
    movimientos: int
        Num. max. de movimientos que se pueden hacer
    casilleros: list
        Lista de los casilleros a los que me puedo mover
    recinto: bool
        Para saber si un jugador esta en un recinto
    agregar: bool
        Para permitir moverse a la casilla de la trampa contraria o saltarla

    Retorno
    -------
    None

    """

    calcular_especiales = []
    cjto_tmp = set()

    desde = posX - movimientos
    hasta = posX + movimientos

    if desde < 0:
        desde = 0

    if hasta > 19:
        hasta = 19

    # Agregamos como tuplas para pasarlo a un cjto y eliminar asi las
    # posiciones repetidas por los teleports / recintos
    for i in range(desde, hasta + 1):
        pos = (i, posY)
        cjto_tmp.add(pos)

        # Vibora
        if pos == (3, 6) and not {"x": 3, "y": 6} in casilleros:
            mov_restantes = movimientos - abs(3 - posX)
            calcular_especiales.append({"x": 14, "y": 6, "restantes": mov_restantes})
        elif pos == (14, 6) and not {"x": 14, "y": 6} in casilleros:
            mov_restantes = movimientos - abs(14 - posX)
            calcular_especiales.append({"x": 3, "y": 6, "restantes": mov_restantes})

        # Araña
        elif pos == (4, 13) and not {"x": 4, "y": 13} in casilleros:
            mov_restantes = movimientos - abs(4 - posX)
            calcular_especiales.append({"x": 15, "y": 13, "restantes": mov_restantes})
        elif pos == (15, 13) and not {"x": 15, "y": 13} in casilleros:
            mov_restantes = movimientos - abs(15 - posX)
            calcular_especiales.append({"x": 4, "y": 13, "restantes": mov_restantes})

    for x, y in sorted(cjto_tmp, key=lambda x: x[0]):
        casilleros.append({"x": x, "y": y})

    # Si no estoy en un recinto que no muestre como posicion posible
    # la posicion actual
    if not recinto:
        # Agregar es para permitir moverse a la casilla de la trampa contraria
        if not agregar:
            casilleros.remove({"x": posX, "y": posY})

    # Vemos a donde podemos ir si pasamos por las casillas especiales
    for item in calcular_especiales:
        if item["restantes"] > 0:
            calcular_casilleros(
                item["x"], item["y"], item["restantes"], casilleros, recinto, True
            )


def movimientos_verticales(
    posX: int,
    posY: int,
    movimientos: int,
    casilleros: list,
    recinto: bool,
    agregar: bool = False,
):
    """Casillas posibles a las que se puede llegar con 'm' movimientos

    Muestra los casilleros a los que puedo ir en una columna del tablero

    Parametros
    ----------
    posX: int
        Posicion horizontal
    posY: int
        Posicion vetical
    movimientos: int
        Num. max. de casillas que puedo avanzar
    casilleros: list
        Lista de los casilleros a los que me puedo mover
    recinto: bool
        Para saber si un jugador esta en un recinto
    agregar: bool
        Para permitir moverse a la casilla de la trampa contraria o saltarla

    Retorno
    -------
    None

    """

    calcular_especiales = []
    cjto_tmp = set()

    desde = posY - movimientos
    hasta = posY + movimientos

    if desde < 0:
        desde = 0

    if hasta > 19:
        hasta = 19

    for i in range(desde, hasta + 1):
        pos = (posX, i)
        cjto_tmp.add(pos)

        # Murcielagos
        if pos == (6, 4) and not {"x": 6, "y": 4} in casilleros:
            mov_restantes = movimientos - abs(4 - posY)
            calcular_especiales.append({"x": 6, "y": 14, "restantes": mov_restantes})
        elif pos == (6, 14) and not {"x": 6, "y": 14} in casilleros:
            mov_restantes = movimientos - abs(14 - posY)
            calcular_especiales.append({"x": 6, "y": 4, "restantes": mov_restantes})

        # Escorpion
        elif pos == (13, 3) and not {"x": 13, "y": 3} in casilleros:
            mov_restantes = movimientos - abs(3 - posY)
            calcular_especiales.append({"x": 13, "y": 14, "restantes": mov_restantes})
        elif pos == (13, 14) and not {"x": 13, "y": 14} in casilleros:
            mov_restantes = movimientos - abs(14 - posY)
            calcular_especiales.append({"x": 13, "y": 3, "restantes": mov_restantes})

    for x, y in sorted(cjto_tmp, key=lambda x: x[1]):
        casilleros.append({"x": x, "y": y})

    if not recinto:
        # Agregar es para permitir moverse a la casilla de la trampa contraria
        if not agregar:
            casilleros.remove({"x": posX, "y": posY})

    # Vemos a donde podemos ir si pasamos por las casillas especiales
    for item in calcular_especiales:
        if item["restantes"] > 0:
            calcular_casilleros(
                item["x"], item["y"], item["restantes"], casilleros, recinto, True
            )


@db_session
def movimientos_posibles(id_jugador: int, movimientos: int):
    """Casilleros a las que puede ir un jugador dado un numero

    Parametros
    ----------
    id_partida: int
        Identificador de la partida
    movimientos:
        Num. max. de casillas que puedo avanzar

    Retorno
    -------
    list
        Lista de diccionarios con las posiciones a las que se puede llegar

    """

    jugador = JugadorDB[id_jugador]
    casilleros = []

    posX, posY = (jugador.posX, jugador.posY)
    calcular_casilleros(posX, posY, movimientos, casilleros, bool(jugador.recinto))

    # Si un jugador esta en un recinto, calculamos todos los movimientos
    # a los que se puede llegar saliendo por las entradas/salidas del mismo
    recinto = dict_recintos.get((posX, posY))
    if recinto:
        for x, y in dict_posiciones.get(recinto):
            if x == posX and y == posY:
                continue
            calcular_casilleros(x, y, movimientos, casilleros, bool(jugador.recinto))

    # Si esta en una trampa vemos a donde puede moverse saliendo por caulquiera
    posiciones_trampa = [(6, 6), (13, 6), (6, 13), (13, 13)]
    if (posX, posY) in posiciones_trampa:
        for x, y in posiciones_trampa:
            if x == posX and y == posY:
                continue
            calcular_casilleros(x, y, movimientos, casilleros, False)

    return casilleros


def calcular_casilleros(
    posX, posY, movimientos, casilleros, recinto: bool, agregar: bool = False
):
    """Calcula los casilleros a los que se puede llegar en el tablero

    Parametros
    ----------
    posX: int
        Posicion horizonal
    posY: int
        Posicion vertical
    movimientos:
        Num. max. de casillas que puedo avanzar
    casilleros: list
        lista de los casilleros a los que me puedo mover
    recinto: bool
        para saber si un jugador esta en un recinto
    agregar: bool
        Para permitir moverse a la casilla de la trampa contraria o saltarla

    Retorno
    -------
    None

    """

    COL1, COL2 = (6, 13)
    FILA1, FILA2 = (6, 13)
    INTERSECCION1 = 6
    INTERSECCION2 = 13
    INTERSECCIONES = [(FILA1, COL1), (FILA1, COL2), (FILA2, COL1), (FILA2, COL2)]

    # Si estoy en las intersecciones
    if (posX, posY) in INTERSECCIONES:
        movimientos_horizontales(posX, posY, movimientos, casilleros, recinto, agregar)
        movimientos_verticales(posX, posY, movimientos, casilleros, recinto, agregar)

    # Estoy en una de las 2 columnas
    elif posX == INTERSECCION1 or posX == INTERSECCION2:
        movimientos_verticales(posX, posY, movimientos, casilleros, recinto, agregar)

        # Tramo de arriba
        if posY < INTERSECCION1:
            mov_restantes = movimientos - abs(INTERSECCION1 - posY)
            if mov_restantes > 0:
                movimientos_horizontales(
                    posX, INTERSECCION1, mov_restantes, casilleros, recinto, agregar
                )

        # Tramo del centro
        elif posY > INTERSECCION1 and posY < INTERSECCION2:

            mov_restantes = movimientos - abs(INTERSECCION1 - posY)
            if mov_restantes > 0:
                movimientos_horizontales(
                    posX, INTERSECCION1, mov_restantes, casilleros, recinto, agregar
                )

            mov_restantes = movimientos - abs(INTERSECCION2 - posY)
            if mov_restantes > 0:
                movimientos_horizontales(
                    posX, INTERSECCION2, mov_restantes, casilleros, recinto, agregar
                )

        # Tramo de abajo
        elif posY > INTERSECCION2:
            mov_restantes = movimientos - abs(INTERSECCION2 - posY)

            if mov_restantes > 0:
                movimientos_horizontales(
                    posX, INTERSECCION2, mov_restantes, casilleros, recinto, agregar
                )

    # Estoy en una de las 2 filas
    elif posY == INTERSECCION1 or posY == INTERSECCION2:
        movimientos_horizontales(posX, posY, movimientos, casilleros, recinto, agregar)

        # Tramo izquierdo
        if posX < INTERSECCION1:
            mov_restantes = movimientos - abs(INTERSECCION1 - posX)
            if mov_restantes > 0:
                movimientos_verticales(
                    INTERSECCION1, posY, mov_restantes, casilleros, recinto, agregar
                )

        # Tramo del centro
        elif posX > INTERSECCION1 and posX < INTERSECCION2:

            mov_restantes = movimientos - abs(INTERSECCION1 - posX)
            if mov_restantes > 0:
                movimientos_verticales(
                    INTERSECCION1, posY, mov_restantes, casilleros, recinto, agregar
                )

            mov_restantes = movimientos - abs(COL2 - posX)
            if mov_restantes > 0:
                movimientos_verticales(
                    INTERSECCION2, posY, mov_restantes, casilleros, recinto, agregar
                )

        # Tramo derecho
        elif posX > INTERSECCION2:
            mov_restantes = movimientos - abs(INTERSECCION2 - posX)

            if mov_restantes > 0:
                movimientos_verticales(
                    INTERSECCION2, posY, mov_restantes, casilleros, recinto, agregar
                )


@db_session
def actualizar_posicion(id_jugador: int, posicion: Posicion):
    """Actualiza la posición de un jugador en el tablero

    Parametros
    ----------
    id_partida: int
        Identificador de partida
    id_jugador: int
        Identificador de jugador

    posicion: Posicion
        x: int
            Fila en la que se va a ubicar
        y: int
            Columna en la que se va a ubicar

    Retorno
    -------
    dict
        Diccionario con atributos del jugador
        y además si cayó en una trampa o no
            id_jugador: int
                Identificador del jugador
            nombre: str
                Nombre del jugador
            color: str
                Color seleccionado por el jugador
            orden: int
                Orden que se le asigna al entrar a la partida
            posX: int
                Posición 'x' de inicio en el tablero
            posY: int
                Posición 'y' de inicio en el tablero
            recinto: str
                Recinto donde se encuentra el jugador (en un principio, en ninguno)
            perdio: bool
                Si perdió o no
            turno: int
                Cantidad de turnos jugados
            sospechas: int
                Cantidad de sospechas realizadas

            cayo_en_trampa: bool
                Indica si el jugador cayó en una trampa o no


    """

    jugador = JugadorDB[id_jugador]

    jugador.posX = posicion.x
    jugador.posY = posicion.y
    jugador.recinto = ""
    cayo_en_trampa = False

    posiciones_trampa = [(6, 6), (13, 6), (6, 13), (13, 13)]

    if (jugador.posX, jugador.posY) in posiciones_trampa:
        cayo_en_trampa = True

    return {"jugador": jugador.to_dict(), "cayo_en_trampa": cayo_en_trampa}


@db_session
def obtener_sumario(id_partida: int):
    """Devuelve un sumario de la partida:
            Ganador, perdedores, duración, cantidad total de sospechas.

    Parametros
    ----------
    id_partida: int
        Identificador de la partida de la cual se hará un sumario

    Retorno
    -------
    datos_partida: dict
        Diccionario con los datos de la partida

        ganador: dict
            Diccionario con los datos del ganador

            nombre: str
                Nombre del ganador
            cartas: list
                Lista de cartas con las que acusó el ganador
            sospechas: int
                Cantidad de sospechas relizadas por el ganador

        perdedores: list
            Lista de los jugadores que perdieron

            nombre: str
                Nombre del jugador
            cartas: list
                Lista de cartas con las que acusó el jugador
            sospechas: int
                Cantidad de sospechas relizadas por el jugador

    """
    partida = PartidaDB[id_partida]
    jugadores_partida = partida.jugadores
    cartas_misterio = [c.nombre for c in partida.cartas]
    datos_partida = {"ganador": {}, "perdedores": [], "tiempo": 0, "total_sospechas": 0}

    total_sospechas = 0

    for jugador in jugadores_partida:
        total_sospechas += jugador.sospechas

        cartas_acusacion = list(select(c.nombre for c in jugador.cartas_acusacion))

        if jugador.perdio:
            datos_partida["perdedores"].append(
                {
                    "nombre": jugador.nombre,
                    "cartas": cartas_acusacion,
                    "sospechas": jugador.sospechas,
                }
            )
        else:
            datos_partida["ganador"] = {
                "nombre": jugador.nombre,
                "cartas": cartas_acusacion,
                "sospechas": jugador.sospechas,
            }

    sec = (partida.tiempo_fin - partida.tiempo_inicio).seconds
    m, s = divmod(sec, 60)
    h, m = divmod(m, 60)

    datos_partida["tiempo"] = f"{h:d}:{m:02d}:{s:02d}"
    datos_partida["total_sospechas"] = total_sospechas
    datos_partida["cartas_misterio"] = cartas_misterio

    return datos_partida


@db_session
def abandonar_partida(id_partida: int, id_jugador: int):

    partida = PartidaDB[id_partida]
    jugador = JugadorDB[id_jugador]
    cartas_jugador = [c.nombre for c in jugador.cartas]

    if jugador.nombre == partida.anfitrion and not partida.iniciada:

        for j in partida.jugadores:
            eliminar_jugador(id_partida, j.id_jugador)

        partida.delete()
    else:
        eliminar_jugador(id_partida, id_jugador)

    return {"nombre": jugador.nombre, "cartas": cartas_jugador}


@db_session
def insertar_colores_db():
    """Crea los colores de la partida

    Parametros
    ----------
    None

    Retorno
    -------
    None

    """

    if hay_colores():
        return

    colores = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#AB47BC", "#26C6DA"]

    for c in colores:
        ColorDB(color=c)


@db_session
def obtenerPartida(id_partida: int):
    return PartidaDB[id_partida]


@db_session
def hay_colores():
    """Verifica que haya o no colores en la base de datos

    Parametros
    ----------
    None

    Retorno
    -------
    None

    """
    return len(list(select(c for c in ColorDB)))
