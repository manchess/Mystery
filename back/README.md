# Proyecto: Juego de mesa misterio.
Backend.

El juego Misterio consta de jugadores o detectives que intentan adivinar quién eliminó a quién y dónde sucedió.  
Es decir, en cada partida el jugador intenta obtener la mayor información posible para revelar el misterio.  
Las reglas y componentes se pueden encontrar en estos documentos:  
[Reglas](https://drive.google.com/file/d/1Dc82tRtRMHCxIUQZPUz01Fsz5ZtrTuJ_/view).

Estas reglas fueron adaptadas a un juego virtual (web), al cual se agrega la funcionalidad de un chat entre los jugadores de una partida.

## Funcionalidades implementadas.
* Crear un usuario.
* Crear una partida, con o sin contraseña.
* Mostrar partidas abiertas.
* Unirse a una partida abierta.
* Iniciar una partida.
* Definir y mostrar el orden de los jugadores.
* Tirar los dados y pasar el turno al siguiente jugador.
* Distribuir cartas.
* Mover la ficha.
* Entrar en un recinto.
* Sospechar.
* Acusar.
* Usar carta Bruja de Salem.
* Caer en una casilla especial.
* Caer en una trampa.
* Anotar en informe.
* Elegir color del jugador.
* Chat.
* Ver estadisticas al final de una partida.

### Ejecutar
Para ejecutar la aplicacion usar: **python -m uvicorn main:app --reload**

### Test
Para correr los tests usar: **pytest**
