package com.concu_augusto_sergio.maquinagalton.servicios;

import com.concu_augusto_sergio.maquinagalton.modelos.ComponenteMaquinaGalton;
import com.concu_augusto_sergio.maquinagalton.modelos.EstacionDeTrabajo;
import com.concu_augusto_sergio.maquinagalton.modelos.LineaDeEnsamblaje;
import org.springframework.stereotype.Service;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class FabricaService {

    // Contadores atómicos para los componentes
    private final AtomicInteger contadorClavos = new AtomicInteger(0);
    private final AtomicInteger contadorContenedores = new AtomicInteger(0);
    private final AtomicInteger contadorBolas = new AtomicInteger(0);
    private final AtomicInteger contadorTableros = new AtomicInteger(0);

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

    private final BlockingQueue<ComponenteMaquinaGalton> bufferCompartido = new LinkedBlockingQueue<>(10); // Buffer de tamaño 10
    private ScheduledExecutorService scheduler;

    public void iniciarProduccion(int niveles, int fabricasClavos, int fabricasContenedores, int fabricasBolas) {
        // Reiniciar contadores
        contadorTableros.set(0);
        contadorClavos.set(0);
        contadorContenedores.set(0);
        contadorBolas.set(0);
        scheduler = Executors.newScheduledThreadPool(8);

        // Iniciar la línea de ensamblaje
        new Thread(new LineaDeEnsamblaje(bufferCompartido)).start();

        // Fase 1: Producir el tablero
        CountDownLatch fase1Latch = new CountDownLatch(1);
        scheduler.submit(() -> {
            new EstacionDeTrabajo(ComponenteMaquinaGalton.TABLERO, 1, contadorTableros, bufferCompartido).run();
            fase1Latch.countDown(); // Indicar que la fase 1 ha terminado
        });

        try {
            // Esperar a que la fase 1 termine
            fase1Latch.await();

            // Fase 2: Producir los clavos y contenedores
            CountDownLatch fase2Latch = new CountDownLatch(fabricasClavos + fabricasContenedores); // Contar las fábricas de clavos y contenedores

            int totalClavos = calcularTotalClavos(niveles);
            int contenedores = niveles + 3;

            // Encolar tareas de producción de clavos
            int clavosPorFabrica = totalClavos / fabricasClavos;
            for (int i = 0; i < fabricasClavos; i++) {
                int inicio = i * clavosPorFabrica;
                int cantidad = (i == fabricasClavos - 1) ? (totalClavos - inicio) : clavosPorFabrica;
                if (cantidad > 0) {
                    scheduler.submit(() -> {
                        new EstacionDeTrabajo(ComponenteMaquinaGalton.CLAVO, cantidad, contadorClavos, bufferCompartido).run();
                        fase2Latch.countDown(); // Indicar que la producción de clavos ha terminado
                    });
                }
            }

            // Encolar tareas de producción de contenedores
            int contenedoresPorFabrica = contenedores / fabricasContenedores;
            for (int i = 0; i < fabricasContenedores; i++) {
                int inicio = i * contenedoresPorFabrica;
                int cantidad = (i == fabricasContenedores - 1) ? (contenedores - inicio) : contenedoresPorFabrica;
                if (cantidad > 0) {
                    scheduler.submit(() -> {
                        new EstacionDeTrabajo(ComponenteMaquinaGalton.CONTENEDOR, cantidad, contadorContenedores, bufferCompartido).run();
                        fase2Latch.countDown(); // Indicar que la producción de contenedores ha terminado
                    });
                }
            }

            // Esperar a que la fase 2 termine
            fase2Latch.await();

            // Fase 3: Producir las bolas
            int bolas = calcularNumeroBolas(niveles);
            System.out.printf("BOLAS TOTALES: " + bolas);
            int bolasPorFabrica = bolas / fabricasBolas;
            CountDownLatch fase3Latch = new CountDownLatch(fabricasBolas); // Esperar a que todas las fábricas de bolas terminen
            for (int i = 0; i < fabricasBolas; i++) {
                int inicio = i * bolasPorFabrica;
                int cantidad = (i == fabricasBolas - 1) ? (bolas - inicio) : bolasPorFabrica;
                if (cantidad > 0) {
                    scheduler.submit(() -> {
                        new EstacionDeTrabajo(ComponenteMaquinaGalton.BOLA, cantidad, contadorBolas, bufferCompartido).run();
                        fase3Latch.countDown(); // Indicar que la producción de bolas ha terminado
                    });
                }
            }

            // Esperar a que la fase 3 termine
            fase3Latch.await();

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            // Cerramos el scheduler
            scheduler.shutdown();
        }
    }

    // Método para calcular el número total de clavos en una estructura piramidal
    private int calcularTotalClavos(int niveles) {
        return (niveles * (niveles + 1)) / 2;
    }

    // Método para calcular el número de bolas en función del tamaño del tablero
    private int calcularNumeroBolas(int niveles) {
        return niveles * 100;  // Por ejemplo, 5 bolas por cada nivel
    }
}
