/**
 * Máquina de Estados Finitos (FSM) para enemigos
 */

export const AlgoritmosIA = {
    calcularMovimientoEnemigo: (enemigo, jugador, otrosEnemigos) => {
        let decision = { nuevaVelocidad: enemigo.velocidad, desvioX: 0 };

        const distanciaY = jugador.y - enemigo.y;
        const distanciaX = jugador.x - enemigo.x;

        // Transiciones de estado
        if (enemigo.personalidad === "agresivo") {
            if (distanciaY > 0 && distanciaY < 250 && Math.abs(distanciaX) < 100) {
                enemigo.estado = "ATAQUE";
            } else if (distanciaY <= 0) {
                enemigo.estado = "RECUPERACION";
            } else {
                enemigo.estado = "CRUCERO";
            }
        }

        // Acciones por estado
        switch (enemigo.estado) {
            case "ATAQUE":
                decision.desvioX = jugador.x > enemigo.x ? 0.9 : -0.9;
                decision.nuevaVelocidad += 0.03;
                break;

            case "RECUPERACION":
                if (enemigo.x < 180) decision.desvioX = 0.3;
                if (enemigo.x > 220) decision.desvioX = -0.3;
                break;

            case "CRUCERO":
            default:
                decision.desvioX = 0;
                break;
        }

        // Evitar colisiones entre enemigos
        otrosEnemigos.forEach(otro => {
            if (otro !== enemigo) {
                const dy = Math.abs(enemigo.y - otro.y);
                const dx = Math.abs(enemigo.x - otro.x);
                if (dy < 80 && dx < 35) {
                    decision.nuevaVelocidad *= 0.90;
                    decision.desvioX = enemigo.x > otro.x ? 0.5 : -0.5; 
                }
            }
        });

        return decision;
    },

    obtenerParametrosNivel: (nivel) => {
        return {
            velocidadCarretera: 2 + nivel,
            frecuenciaEnemigos: Math.max(120 - (nivel * 10), 40),
            largoMeta: 1000 + (nivel * 500) 
        };
    }
};
