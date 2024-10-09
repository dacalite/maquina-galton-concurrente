package com.concu_augusto_sergio.maquinagalton.modelos;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class EstacionDeTrabajo implements Runnable {

    private ComponenteMaquinaGalton componente;
    private int cantidad;
    private AtomicInteger contador;

    public EstacionDeTrabajo(ComponenteMaquinaGalton componente, int cantidad, AtomicInteger contador) {
        this.componente = componente;
        this.cantidad = cantidad;
        this.contador = contador;
    }

    @Override
    public void run() {
        for (int i = 0; i < cantidad; i++) {
            try {
                // Simular el tiempo de producción
                TimeUnit.MILLISECONDS.sleep(500);

                // Incrementar el contador atómico
                int numero = contador.incrementAndGet();

                // Imprimir el componente producido
                System.out.printf("Componente producido: %s #%d%n", componente, numero);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
