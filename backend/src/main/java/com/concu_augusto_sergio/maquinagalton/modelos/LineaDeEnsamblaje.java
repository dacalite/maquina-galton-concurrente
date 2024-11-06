package com.concu_augusto_sergio.maquinagalton.modelos;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class LineaDeEnsamblaje {

    @RabbitListener(queues = "componentesQueue") // Escucha en la cola de componentes
    public void recibirComponente(ComponenteMaquinaGalton componente) {
        ensamblarComponente(componente);
    }

    private void ensamblarComponente(ComponenteMaquinaGalton componente) {
        // Simular el tiempo de ensamblaje
        try {
            Thread.sleep(50); // Simula el tiempo de ensamblaje
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("Componente ensamblado: " + componente);
    }
}
