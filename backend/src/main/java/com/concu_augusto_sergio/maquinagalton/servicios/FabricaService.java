package com.concu_augusto_sergio.maquinagalton.servicios;

import com.concu_augusto_sergio.maquinagalton.modelos.ComponenteMaquinaGalton;
import com.concu_augusto_sergio.maquinagalton.modelos.EstacionDeTrabajo;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class FabricaService {

    @Autowired
    private final RabbitTemplate rabbitTemplate;

    private final AtomicInteger contadorClavos = new AtomicInteger(0);
    private final AtomicInteger contadorContenedores = new AtomicInteger(0);
    private final AtomicInteger contadorBolas = new AtomicInteger(0);
    private final AtomicInteger contadorTableros = new AtomicInteger(0);

    public FabricaService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public int getContadorClavos() {
        return contadorClavos.get();
    }

    public int getContadorContenedores() {
        return contadorContenedores.get();
    }

    public int getContadorBolas() {
        return contadorBolas.get();
    }

    public int getContadorTableros() {
        return contadorTableros.get();
    }

    public void iniciarProduccion(int niveles, int fabricasClavos, int fabricasContenedores, int fabricasBolas) {
        contadorTableros.set(0);
        contadorClavos.set(0);
        contadorContenedores.set(0);
        contadorBolas.set(0);
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(8);

        // Fase 1: Producir el tablero
        CountDownLatch fase1Latch = new CountDownLatch(1);
        scheduler.submit(() -> {
            new EstacionDeTrabajo(ComponenteMaquinaGalton.TABLERO, 1, contadorTableros, rabbitTemplate).run();
            fase1Latch.countDown();
        });

        try {
            fase1Latch.await();

            // Fase 2: Producir clavos y contenedores
            CountDownLatch fase2Latch = new CountDownLatch(fabricasClavos + fabricasContenedores);

            int totalClavos = calcularTotalClavos(niveles);
            int contenedores = niveles + 3;
            int clavosPorFabrica = totalClavos / fabricasClavos;

            for (int i = 0; i < fabricasClavos; i++) {
                int cantidad = (i == fabricasClavos - 1) ? (totalClavos - (i * clavosPorFabrica)) : clavosPorFabrica;
                scheduler.submit(() -> {
                    new EstacionDeTrabajo(ComponenteMaquinaGalton.CLAVO, cantidad, contadorClavos, rabbitTemplate).run();
                    fase2Latch.countDown();
                });
            }

            int contenedoresPorFabrica = contenedores / fabricasContenedores;
            for (int i = 0; i < fabricasContenedores; i++) {
                int cantidad = (i == fabricasContenedores - 1) ? (contenedores - (i * contenedoresPorFabrica)) : contenedoresPorFabrica;
                scheduler.submit(() -> {
                    new EstacionDeTrabajo(ComponenteMaquinaGalton.CONTENEDOR, cantidad, contadorContenedores, rabbitTemplate).run();
                    fase2Latch.countDown();
                });
            }

            fase2Latch.await();

            // Fase 3: Producir las bolas
            int bolas = calcularNumeroBolas(niveles);
            int bolasPorFabrica = bolas / fabricasBolas;
            CountDownLatch fase3Latch = new CountDownLatch(fabricasBolas);
            for (int i = 0; i < fabricasBolas; i++) {
                int cantidad = (i == fabricasBolas - 1) ? (bolas - (i * bolasPorFabrica)) : bolasPorFabrica;
                scheduler.submit(() -> {
                    new EstacionDeTrabajo(ComponenteMaquinaGalton.BOLA, cantidad, contadorBolas, rabbitTemplate).run();
                    fase3Latch.countDown();
                });
            }

            fase3Latch.await();

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            scheduler.shutdown();
        }
    }

    private int calcularTotalClavos(int niveles) {
        return (niveles * (niveles + 1)) / 2;
    }

    private int calcularNumeroBolas(int niveles) {
        return niveles * 100;
    }
}
