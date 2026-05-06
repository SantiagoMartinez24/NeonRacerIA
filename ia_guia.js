/**
 * IA_GUIA.JS
 * Algoritmo de búsqueda de trayectoria con análisis de costos por carril
 */

export const IAGuia = {
    calcularRutaOptima: (guia, enemigos) => {
        const carriles = [60, 140, 220, 300];
        let carrilActualIndex = 0;
        let minDif = Infinity;

        // Localizar carril actual del guía
        carriles.forEach((c, i) => {
            if (Math.abs(c - guia.x) < minDif) {
                minDif = Math.abs(c - guia.x);
                carrilActualIndex = i;
            }
        });

        // Costos por carril y detección de peligros
        let costos = [0, 0, 0, 0];
        let peligroInmediato = false;
        
        let enemigoIzquierda = false;
        let enemigoDerecha = false;
        let distanciaEnemigoIzquierda = Infinity;
        let distanciaEnemigoDerecha = Infinity;

        enemigos.forEach(en => {
            const distanciaY = guia.y - en.y;
            const distanciaX = Math.abs(guia.x - en.x);

            // Escaneo frontal
            if (en.y < guia.y && en.y > guia.y - 450) {
                let indexEnemigo = Math.round((en.x - 60) / 80);
                if (indexEnemigo >= 0 && indexEnemigo <= 3) {
                    costos[indexEnemigo] += (450 - Math.abs(distanciaY));
                }
            }

            // Detección lateral
            if (Math.abs(distanciaY) < 60 && distanciaX < 90) {
                peligroInmediato = true;
                
                if (en.x < guia.x) {
                    enemigoIzquierda = true;
                    distanciaEnemigoIzquierda = Math.min(distanciaEnemigoIzquierda, distanciaX);
                } else {
                    enemigoDerecha = true;
                    distanciaEnemigoDerecha = Math.min(distanciaEnemigoDerecha, distanciaX);
                }
                
                let indexLateral = Math.round((en.x - 60) / 80);
                if (indexLateral >= 0 && indexLateral <= 3) {
                    costos[indexLateral] += 500;
                }
            }
        });

        // Evasión lateral: moverse al lado opuesto del enemigo
        if (enemigoIzquierda && !enemigoDerecha) {
            if (carrilActualIndex < 3) {
                costos[carrilActualIndex] += 100;
                costos[carrilActualIndex + 1] -= 50;
                
                if (carrilActualIndex + 2 <= 3) {
                    costos[carrilActualIndex + 2] -= 30;
                }
            } else {
                costos[carrilActualIndex] += 80;
            }
        }
        
        if (enemigoDerecha && !enemigoIzquierda) {
            if (carrilActualIndex > 0) {
                costos[carrilActualIndex] += 100;
                costos[carrilActualIndex - 1] -= 50;
                
                if (carrilActualIndex - 2 >= 0) {
                    costos[carrilActualIndex - 2] -= 30;
                }
            } else {
                costos[carrilActualIndex] += 80;
            }
        }
        
        // Ambos lados ocupados: huir hacia el lado más seguro
        if (enemigoIzquierda && enemigoDerecha) {
            peligroInmediato = true;
            
            if (distanciaEnemigoIzquierda < distanciaEnemigoDerecha) {
                if (carrilActualIndex < 3) {
                    costos[carrilActualIndex] += 150;
                    costos[carrilActualIndex + 1] -= 80;
                }
            } else {
                if (carrilActualIndex > 0) {
                    costos[carrilActualIndex] += 150;
                    costos[carrilActualIndex - 1] -= 80;
                }
            }
        }

        // Seleccionar carril con menor costo
        let mejorCarrilIndex = carrilActualIndex;
        let menorCosto = costos[carrilActualIndex];

        for (let i = 0; i < carriles.length; i++) {
            if (costos[i] < menorCosto - 20) {
                menorCosto = costos[i];
                mejorCarrilIndex = i;
            }
        }

        // Velocidad base
        let vBase = -2.5; 

        if (peligroInmediato || costos[mejorCarrilIndex] > 100) {
            vBase = -5.0;
        }

        let decision = { 
            desvioX: 0, 
            nuevaVelocidad: vBase,
            objetivoX: carriles[mejorCarrilIndex] 
        };

        const diferenciaX = decision.objetivoX - guia.x;

        if (Math.abs(diferenciaX) > 4) {
            decision.desvioX = diferenciaX > 0 ? 5 : -5; 
        } else {
            guia.x = decision.objetivoX;
        }

        return decision;
    }
};