/**
 * LOGICA_JUEGO.JS
 * Control del juego, IA de enemigos y carro guía
 */
import { AlgoritmosIA } from './ia_algoritmos.js';
import { IAGuia } from './ia_guia.js'; 
import { Carro } from './componentes.js';
import { MotorGrafico } from './motor_grafico.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let estado = {
    nivel: 1,
    progreso: 0,
    cuadro: 0,
    desfaseCarretera: 0
};

let jugador = new Carro(180, 500, "#0f0", true);
let enemigos = [];

// Variables para el carro guía
let carroGuia = null;
let estelaGuia = []; 
const MAX_ESTELA = 20; 

export function iniciarEstadoNivel(nivelDeseado) {
    estado.nivel = nivelDeseado;
    estado.progreso = 0;
    estado.cuadro = 0;
    enemigos = [];
    estelaGuia = [];
    
    jugador.x = 180;
    jugador.y = 500;
    
    if (window.gameConfig && window.gameConfig.ayudaActiva) {
        carroGuia = new Carro(180, 300, "#0ff"); 
    } else {
        carroGuia = null;
    }
    
    if (window.gameConfig && window.gameConfig.color) {
        jugador.color = window.gameConfig.color;
    } else if (window.selectedColor) {
        jugador.color = window.selectedColor;
    }
}

function spawnEnemigo() {
    const carriles = [60, 140, 220, 300]; 
    const x = carriles[Math.floor(Math.random() * carriles.length)];
    const esAgresivo = Math.random() < 0.7;
    const color = esAgresivo ? "#ff0055" : "#00ffff"; 
    
    const nuevoEnemigo = new Carro(x, -100, color);
    nuevoEnemigo.personalidad = esAgresivo ? "agresivo" : "pasivo";
    nuevoEnemigo.estado = "CRUCERO";
    nuevoEnemigo.velocidad = 2 + (estado.nivel * 0.5); 
    
    enemigos.push(nuevoEnemigo);
}

function verificarColision(a, b) {
    return a.x < b.x + b.ancho && 
           a.x + a.ancho > b.x && 
           a.y < b.y + b.alto && 
           a.y + a.alto > b.y;
}

export function bucleJuego() {
    if (!window.isPlaying) return;

    const config = AlgoritmosIA.obtenerParametrosNivel(estado.nivel);
    MotorGrafico.dibujarCarretera(ctx, canvas, estado.desfaseCarretera);
    
    const comando = window.currentAction;
    
    // Movimiento lateral del jugador
    if (comando === "izquierda" && jugador.x > 45) jugador.x -= 5;
    if (comando === "derecha" && jugador.x < 315) jugador.x += 5;
    
    // Movimiento vertical del jugador (acelerar)
    if (comando === "arriba" && jugador.y > 50) {
        jugador.y -= 3;
        estado.desfaseCarretera += 2;
    } else if (jugador.y < 500) {
        jugador.y += 1;
    }

    // Lógica del carro guía
    if (carroGuia) {
        const decisionGuia = IAGuia.calcularRutaOptima(carroGuia, enemigos);
        
        carroGuia.x += decisionGuia.desvioX;
        carroGuia.y += decisionGuia.nuevaVelocidad;

        if (comando !== "arriba") {
            carroGuia.y += config.velocidadCarretera;
        }

        // Limitar posición del guía
        if (carroGuia.y < 80) {
            carroGuia.y = 80;
        }

        if (carroGuia.y > jugador.y - 120) {
            carroGuia.y = jugador.y - 120;
        }

        estelaGuia.push({ x: carroGuia.x, y: carroGuia.y });
        if (estelaGuia.length > MAX_ESTELA) estelaGuia.shift();

        MotorGrafico.dibujarGuia(ctx, carroGuia, estelaGuia);
    }

    // Generar enemigos
    if (estado.cuadro % Math.floor(config.frecuenciaEnemigos) === 0) {
        spawnEnemigo();
    }

    // Actualizar y dibujar enemigos
    enemigos.forEach((en, i) => {
        const decision = AlgoritmosIA.calcularMovimientoEnemigo(en, jugador, enemigos);
        en.y += decision.nuevaVelocidad;
        en.x += decision.desvioX;
        en.dibujar(ctx);

        if (verificarColision(jugador, en)) {
            reiniciarPartida();
        }
        
        if (en.y > canvas.height) {
            enemigos.splice(i, 1);
        }
    });

    // Progreso del nivel: avanza más rápido al acelerar
    if (comando === "arriba") {
        estado.progreso += 2;
    } else {
        estado.progreso++;
    }
    
    estado.desfaseCarretera += config.velocidadCarretera;

    if (estado.progreso >= config.largoMeta) {
        avanzarNivel();
    }

    jugador.dibujar(ctx);
    MotorGrafico.dibujarInterfaz(ctx, estado.nivel, estado.progreso, config.largoMeta);

    estado.cuadro++;
}

function avanzarNivel() {
    window.isPlaying = false;
    alert(`¡NIVEL ${estado.nivel} COMPLETADO!`);
    estado.nivel++;
    iniciarEstadoNivel(estado.nivel);
    window.isPlaying = true;
}

function reiniciarPartida() {
    window.isPlaying = false;

    const recordActual = localStorage.getItem('neonRacerScore') || 1;
    if (estado.nivel > recordActual) {
        localStorage.setItem('neonRacerScore', estado.nivel);
        const highscoreElement = document.getElementById("high-score-val");
        if(highscoreElement) highscoreElement.innerText = estado.nivel;
    }

    iniciarEstadoNivel(estado.nivel);
    
    const menu = document.getElementById("menu-overlay");
    const statusText = document.getElementById("status-ia");
    if(statusText) statusText.innerText = "¡SISTEMA CRÍTICO! ¿Reintentar?";
    menu.style.display = "flex";
}