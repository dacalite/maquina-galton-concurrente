package com.concu_augusto_sergio.maquinagalton.modelos;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class EstacionDeTrabajo implements Runnable {

    private final ComponenteMaquinaGalton componente;
    private final int cantidad;
    private final AtomicInteger contador;
    private final BlockingQueue<ComponenteMaquinaGalton> bufferCompartido;

    public EstacionDeTrabajo(ComponenteMaquinaGalton componente, int cantidad, AtomicInteger contador, BlockingQueue<ComponenteMaquinaGalton> bufferCompartido) {
        this.componente = componente;
        this.cantidad = cantidad;
        this.contador = contador;
        this.bufferCompartido = bufferCompartido;
    }

    @Override
    public void run() {
        for (int i = 0; i < cantidad; i++) {
            try {
                // Simular el tiempo de producción
                if(componente==ComponenteMaquinaGalton.BOLA){
                    TimeUnit.MILLISECONDS.sleep(50);
                }else{
                    TimeUnit.MILLISECONDS.sleep(600);
                }

                // Incrementar el contador atómico
                int numero = contador.incrementAndGet();

                // Añadir el componente al buffer compartido
                bufferCompartido.put(componente); // Esto bloqueará si el buffer está lleno
                System.out.printf("Componente producido y añadido al buffer: %s #%d%n", componente, numero);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
