package com.concu_augusto_sergio.maquinagalton.modelos;

import com.concu_augusto_sergio.maquinagalton.config.Handler;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.io.IOException;
import java.util.concurrent.BlockingQueue;

public class LineaDeEnsamblaje implements Runnable {

    private final BlockingQueue<ComponenteMaquinaGalton> bufferCompartido;
    private final SimpMessagingTemplate messagingTemplate;

    public LineaDeEnsamblaje(BlockingQueue<ComponenteMaquinaGalton> bufferCompartido, SimpMessagingTemplate messagingTemplate) {
        this.bufferCompartido = bufferCompartido;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void run() {
        try {
            while (true) {
                // Extraer un componente del buffer (espera si está vacío)
                ComponenteMaquinaGalton componente = bufferCompartido.take();
                ensamblarComponente(componente);
                messagingTemplate.convertAndSend("Componente extraido del buffer: " + componente.toString());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void ensamblarComponente(ComponenteMaquinaGalton componente) {
        // Simular el tiempo de ensamblaje
        try {
            Thread.sleep(500); // Simular tiempo de ensamblaje
            // Notificar a los clientes conectados vía WebSocket
            messagingTemplate.convertAndSend("Componente ensamblado: " + componente.toString());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("Componente ensamblado: " + componente);
    }
}