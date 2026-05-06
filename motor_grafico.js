/**
 * MOTOR_GRAFICO.JS
 * Renderizado y efectos visuales
 */

export const MotorGrafico = {
    dibujarCarretera: (ctx, canvas, desfase) => {
        // Fondo oscuro
        ctx.fillStyle = "#050510";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cuadrícula de fondo en movimiento
        ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.height; i += 40) {
            let y = (i + desfase * 0.5) % canvas.height;
            ctx.beginPath(); 
            ctx.moveTo(0, y); 
            ctx.lineTo(canvas.width, y); 
            ctx.stroke();
        }

        // Asfalto central
        const anchoCarretera = 320;
        const inicioX = (canvas.width - anchoCarretera) / 2;

        let gradienteAsfalto = ctx.createLinearGradient(inicioX, 0, inicioX + anchoCarretera, 0);
        gradienteAsfalto.addColorStop(0, "#1a1a1a");
        gradienteAsfalto.addColorStop(0.5, "#222222");
        gradienteAsfalto.addColorStop(1, "#1a1a1a");
        ctx.fillStyle = gradienteAsfalto;
        ctx.fillRect(inicioX, 0, anchoCarretera, canvas.height);

        // Bordes neón de la carretera
        ctx.strokeStyle = "#ff00ff";
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff00ff";
        ctx.strokeRect(inicioX, -10, anchoCarretera, canvas.height + 20);
        ctx.shadowBlur = 0;

        // Luces laterales
        ctx.fillStyle = "#0ff";
        for (let i = 0; i < canvas.height + 100; i += 150) {
            let yLuz = (i + desfase * 1.5) % (canvas.height + 100) - 50; 
            ctx.fillRect(20, yLuz, 8, 40);
            ctx.fillRect(canvas.width - 28, yLuz, 8, 40);
        }

        // Líneas divisorias de carriles
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 3;
        ctx.setLineDash([25, 25]);
        ctx.lineDashOffset = -desfase * 1.2; 

        const carriles = [120, 200, 280];
        carriles.forEach(x => {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        });
        ctx.setLineDash([]);
    },

    dibujarGuia: (ctx, guia, estela) => {
        ctx.save();

        // Estela del carro guía
        if (estela.length > 2) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0, 255, 255, 0.4)";
            ctx.lineWidth = 15;
            ctx.lineJoin = "round";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#0ff";
            
            ctx.moveTo(estela[0].x + guia.ancho / 2, estela[0].y + guia.alto);
            for (let i = 1; i < estela.length; i++) {
                ctx.lineTo(estela[i].x + guia.ancho / 2, estela[i].y + guia.alto);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Carro guía con efecto holograma
        ctx.globalAlpha = 0.6;
        guia.dibujar(ctx);
        ctx.globalAlpha = 1.0;

        // Línea de escaneo delante del guía
        ctx.strokeStyle = "#0ff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        let yEscaner = guia.y - 40;
        ctx.moveTo(guia.x - 20, yEscaner);
        ctx.lineTo(guia.x + guia.ancho + 20, yEscaner);
        ctx.stroke();

        ctx.restore();
    },

    dibujarInterfaz: (ctx, nivel, progreso, meta) => {
        // Fondo del HUD
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(45, 10, 160, 65);
        
        ctx.strokeStyle = "#0f0";
        ctx.lineWidth = 2;
        ctx.strokeRect(45, 10, 160, 65);

        // Texto del nivel
        ctx.fillStyle = "#0f0";
        ctx.shadowBlur = 5;
        ctx.shadowColor = "#0f0";
        ctx.font = "bold 18px 'Courier New'";
        ctx.fillText(`NIVEL: ${nivel}`, 55, 35);
        
        // Barra de progreso
        const porcentaje = Math.min((progreso / meta) * 100, 100);
        
        const barraX = 55;
        const barraY = 45;
        const barraAncho = 140;
        const barraAlto = 12;
        
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(0, 255, 0, 0.3)";
        
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(barraX, barraY, barraAncho, barraAlto);
        
        ctx.strokeStyle = "#0f0";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barraX, barraY, barraAncho, barraAlto);
        
        // Color según porcentaje
        let colorGradiente;
        if (porcentaje < 30) {
            colorGradiente = "#00ff00";
        } else if (porcentaje < 70) {
            colorGradiente = "#ffff00";
        } else {
            colorGradiente = "#ff00ff";
        }
        
        let gradienteBarra = ctx.createLinearGradient(barraX, barraY, barraX + barraAncho, barraY);
        gradienteBarra.addColorStop(0, colorGradiente);
        gradienteBarra.addColorStop(1, "#0ff");
        
        ctx.fillStyle = gradienteBarra;
        ctx.fillRect(barraX, barraY, (porcentaje / 100) * barraAncho, barraAlto);
        
        // Brillo interno
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(barraX, barraY, (porcentaje / 100) * barraAncho, 2);
        
        // Porcentaje numérico
        ctx.shadowBlur = 3;
        ctx.shadowColor = "#0f0";
        ctx.font = "bold 10px 'Courier New'";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${Math.floor(porcentaje)}%`, barraX + barraAncho - 28, barraY + 10);
        
        // Icono de rayo al superar 80%
        if (porcentaje > 80) {
            ctx.fillStyle = "#ffff00";
            ctx.font = "10px 'Courier New'";
            ctx.fillText("⚡", barraX + barraAncho - 8, barraY + 10);
        }
        
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
    }
};