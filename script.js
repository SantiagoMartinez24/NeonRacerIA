import { bucleJuego, iniciarEstadoNivel } from './logica_juego.js';

const MODEL_URL = "./model/"; 
let model, webcam, maxPredictions;

const startBtn = document.getElementById("start-btn");
const menuOverlay = document.getElementById("menu-overlay");
const statusText = document.getElementById("status-ia");
const highScoreText = document.getElementById("high-score-val");

window.currentAction = "quieto";
window.isPlaying = false;
window.gameConfig = {
    color: "#0f0",
    diseno: "ninguno",
    ayudaActiva: false
};

// Cargar récord guardado
const savedScore = localStorage.getItem('neonRacerScore') || 1;
highScoreText.innerText = savedScore;

// Sonido de inicio (desactivado)
function playStartSound() {
    // Sonido desactivado
}

function setupMenu() {
    // Selector de color del auto
    document.querySelectorAll('.color-card').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-card').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            window.gameConfig.color = btn.dataset.color;
        });
    });

    // Selector de diseños/decalcomanías
    document.querySelectorAll('.design-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.design-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            window.gameConfig.diseno = btn.dataset.design;
        });
    });

    // Botón para activar/desactivar el carro guía
    const helpBtn = document.getElementById("help-toggle-btn");
    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            window.gameConfig.ayudaActiva = !window.gameConfig.ayudaActiva;
            helpBtn.classList.toggle('active');
            helpBtn.innerText = window.gameConfig.ayudaActiva ? "AYUDA: ON" : "AYUDA: OFF";
            
            helpBtn.style.boxShadow = window.gameConfig.ayudaActiva ? "0 0 15px #0ff" : "none";
        });
    }
}

async function init() {
    try {
        setupMenu();
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        webcam = new tmImage.Webcam(200, 200, true); 
        await webcam.setup(); 
        await webcam.play();
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        
        statusText.innerText = "¡SISTEMA LISTO!";
        startBtn.disabled = false;
        window.requestAnimationFrame(loop);
    } catch (e) { 
        statusText.innerText = "Error IA."; 
        console.error(e);
    }
}

async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        const prediction = await model.predict(webcam.canvas);
        let accion = "quieto";
        let prob = 0;
        for (let i = 0; i < maxPredictions; i++) {
            if (prediction[i].probability > 0.85 && prediction[i].probability > prob) {
                prob = prediction[i].probability;
                accion = prediction[i].className;
            }
        }
        window.currentAction = accion;
        document.getElementById("current-action").innerText = accion;

        // Iniciar juego automáticamente con el gesto "arriba"
        if (!window.isPlaying && accion === "arriba") startGame();
    }
    if (window.isPlaying) bucleJuego();
    window.requestAnimationFrame(loop);
}

function startGame() {
    if (window.isPlaying) return;
    playStartSound();
    iniciarEstadoNivel(1);
    window.isPlaying = true;
    menuOverlay.style.display = "none";
}

startBtn.addEventListener("click", startGame);
init();