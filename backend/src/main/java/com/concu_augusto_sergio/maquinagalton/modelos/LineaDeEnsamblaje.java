package com.concu_augusto_sergio.maquinagalton.modelos;

import java.util.concurrent.BlockingQueue;

public class LineaDeEnsamblaje implements Runnable {

    private final BlockingQueue<ComponenteMaquinaGalton> bufferCompartido;

    public LineaDeEnsamblaje(BlockingQueue<ComponenteMaquinaGalton> bufferCompartido) {
        this.bufferCompartido = bufferCompartido;
    }

    @Override
    public void run() {
        try {
            while (true) {
                // Extraer un componente del buffer (espera si está vacío)
                ComponenteMaquinaGalton componente = bufferCompartido.take();
                ensamblarComponente(componente);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void ensamblarComponente(ComponenteMaquinaGalton componente) {
        // Simular el tiempo de ensamblaje
        try {
            Thread.sleep(50); // Simular tiempo de ensamblaje
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("Componente ensamblado: " + componente);
    }
}
