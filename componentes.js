/**
 * COMPONENTES.JS
 * Clases de los objetos del juego
 */

export class Carro {
    constructor(x, y, color, esJugador = false) {
        this.x = x;
        this.y = y;
        this.ancho = 40;
        this.alto = 70;
        this.color = color;
        this.velocidad = 0;
        this.esJugador = esJugador;
    }

    dibujar(ctx) {
        ctx.save();

        // Llantas
        ctx.fillStyle = "#050505";
        ctx.fillRect(this.x - 4, this.y + 10, 6, 15);
        ctx.fillRect(this.x + this.ancho - 2, this.y + 10, 6, 15);
        ctx.fillRect(this.x - 4, this.y + 45, 6, 15);
        ctx.fillRect(this.x + this.ancho - 2, this.y + 45, 6, 15);

        // Chasis principal
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.ancho, this.alto, 8); 
        ctx.fill();
        ctx.shadowBlur = 0;

        // Vinilos decorativos (solo jugador)
        if (this.esJugador && window.gameConfig) {
            const diseno = window.gameConfig.diseno;
            ctx.globalAlpha = 0.7;

            if (diseno === "racer") {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(this.x + 12, this.y, 6, this.alto);
                ctx.fillRect(this.x + 22, this.y, 6, this.alto);
            } 
            else if (diseno === "flamas") {
                ctx.fillStyle = "#ffaa00";
                ctx.beginPath();
                ctx.moveTo(this.x + 5, this.y + this.alto);
                ctx.lineTo(this.x + 10, this.y + 35);
                ctx.lineTo(this.x + 20, this.y + 55);
                ctx.lineTo(this.x + 30, this.y + 35);
                ctx.lineTo(this.x + 35, this.y + this.alto);
                ctx.fill();
            }
            else if (diseno === "cyber") {
                ctx.strokeStyle = "#0ff";
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x + 5, this.y + 40, this.ancho - 10, 20);
                ctx.fillStyle = "#0ff";
                ctx.fillRect(this.x + 15, this.y + 45, 10, 10);
            }
            ctx.globalAlpha = 1.0;
        }

        // Vidrios
        ctx.fillStyle = "#111"; 
        ctx.beginPath();
        ctx.roundRect(this.x + 5, this.y + 20, this.ancho - 10, 25, 4);
        ctx.fill();
        
        // Reflejo
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(this.x + 8, this.y + 22, this.ancho - 16, 8);

        // Faros delanteros
        ctx.fillStyle = "#ffffcc";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ffea00";
        ctx.fillRect(this.x + 5, this.y + 2, 8, 5); 
        ctx.fillRect(this.x + this.ancho - 13, this.y + 2, 8, 5);

        // Luces traseras
        ctx.fillStyle = "#ff3333";
        ctx.shadowBlur = 5;
        ctx.shadowColor = "#ff0000";
        ctx.fillRect(this.x + 5, this.y + this.alto - 7, 10, 4); 
        ctx.fillRect(this.x + this.ancho - 15, this.y + this.alto - 7, 10, 4);

        ctx.restore();
    }
}

export class Meta {
    constructor(yObjetivo) {
        this.yObjetivo = yObjetivo;
    }

    dibujar(ctx, canvasAncho) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#0f0";
        ctx.fillRect(45, 0, canvasAncho - 90, 30);
        ctx.strokeStyle = "#0f0";
        ctx.lineWidth = 2;
        ctx.strokeRect(45, 0, canvasAncho - 90, 30);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px 'Courier New'";
        ctx.textAlign = "center";
        ctx.fillText(">>> META <<<", canvasAncho / 2, 20);
        ctx.restore();
    }
}