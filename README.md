# Neon Racer IA - Santiago Martinez

Juego de carro el cual se controla con gestos de la mano usando la camara web.

## Que hace el juego

El juego reconoce 4 gestos:
- Mano arriba = acelerar
- Mano izquierda = girar a la izquierda
- Mano derecha = girar a la derecha
- Mano abierta = vuelve a su velocidad inicial 

Tenes que esquivar los autos enemigos y llegar a la meta. Cada nivel es mas dificil que el anterior.
Tambien podes personalizar el color del auto y ponerle calcomanias (franjas, flamas, diseño cyber).

## Tecnologias de IA usadas

- Teachable Machine: para entrenar el reconocimiento de gestos
- TensorFlow.js: para que la IA funcione en el navegador
- A*: para que el carro guia encuentre la mejor ruta
- FSM (maquina de estados): para el comportamiento de los enemigos


## Archivos del proyecto

- index.html - interfaz principal
- style.css - los estilos visuales
- script.js - la camara y reconocimiento de gestos
- logica_juego.js - todo el funcionamiento del juego
- ia_algoritmos.js - la IA de los enemigos (FSM)
- ia_guia.js - el algoritmo A* para el carro guia
- componentes.js - las clases del carro y la meta
- motor_grafico.js - dibuja la carretera y los efectos
- model/ - carpeta con el modelo entrenado de Teachable Machine

## Como correrlo

1. Abrir el archivo index.html en un navegador
2. Permitir el acceso a la camara
3. Esperar a que cargue la IA
4. Hacer gesto de mano arriba para empezar

## Limitaciones

- En lugares con poca luz o contra luz podria haber un pequeño rango de error en el que se vea afectado el reconocimiento  de los gestos, principalemnte derecha o izquierda.


## Posibles mejoras

- Agregar mas muestras en cada clase para minimizar el error
- Que los enemigos sean menos predecibles