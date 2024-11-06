package com.concu_augusto_sergio.maquinagalton.modelos;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class EstacionDeTrabajo implements Runnable {

    private final ComponenteMaquinaGalton componente;
    private final int cantidad;
    private final AtomicInteger contador;
    private final RabbitTemplate rabbitTemplate;

    public EstacionDeTrabajo(ComponenteMaquinaGalton componente, int cantidad, AtomicInteger contador, RabbitTemplate rabbitTemplate) {
        this.componente = componente;
        this.cantidad = cantidad;
        this.contador = contador;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void run() {
        for (int i = 0; i < cantidad; i++) {
            try {
                if (componente == ComponenteMaquinaGalton.BOLA) {
                    TimeUnit.MILLISECONDS.sleep(50);
                } else {
                    TimeUnit.MILLISECONDS.sleep(600);
                }

                int numero = contador.incrementAndGet();
                rabbitTemplate.convertAndSend("componentesQueue", componente);
                System.out.printf("Componente producido y enviado a la cola: %s #%d%n", componente, numero);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}