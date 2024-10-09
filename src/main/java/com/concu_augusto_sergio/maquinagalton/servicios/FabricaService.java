package com.concu_augusto_sergio.maquinagalton.servicios;

import com.concu_augusto_sergio.maquinagalton.modelos.ComponenteMaquinaGalton;
import com.concu_augusto_sergio.maquinagalton.modelos.EstacionDeTrabajo;

import com.concu_augusto_sergio.maquinagalton.modelos.LineaDeEnsamblaje;
import org.springframework.stereotype.Service;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class FabricaService {

    // Contadores atómicos para los componentes
    private final AtomicInteger contadorClavos = new AtomicInteger(0);
    private final AtomicInteger contadorContenedores = new AtomicInteger(0);
    private final AtomicInteger contadorBolas = new AtomicInteger(0);
    private final AtomicInteger contadorTableros = new AtomicInteger(0);

    // Cola compartida para comunicación entre productor-consumidor
    private final BlockingQueue<ComponenteMaquinaGalton> bufferCompartido = new LinkedBlockingQueue<>(100); // Tamaño máximo del buffer

    public void iniciarProduccion(int niveles, int fabricasClavos, int fabricasContenedores, int fabricasBolas) {
        contadorTableros.set(0);
        contadorClavos.set(0);
        contadorContenedores.set(0);
        contadorBolas.set(0);

        ExecutorService executor = Executors.newFixedThreadPool(10); // Pool de hilos

        // Iniciar la línea de ensamblaje como consumidor
        new Thread(new LineaDeEnsamblaje(bufferCompartido)).start();

        // Fase 1: Producir el tablero
        CountDownLatch fase1Latch = new CountDownLatch(1);
        executor.submit(() -> {
            new EstacionDeTrabajo(ComponenteMaquinaGalton.TABLERO, 1, contadorTableros, bufferCompartido).run();
            fase1Latch.countDown(); // Indicar que la fase 1 ha terminado
        });

        try {
            // Esperar a que la fase 1 termine
            fase1Latch.await();

            // Fase 2: Producir los clavos y contenedores
            CountDownLatch fase2Latch = new CountDownLatch(2); // Esperamos 2 componentes

            int totalClavos = calcularTotalClavos(niveles);
            int contenedores = niveles + 1;

            // Producción de clavos en paralelo
            int clavosPorFabrica = totalClavos / fabricasClavos;
            for (int i = 0; i < fabricasClavos; i++) {
                int inicio = i * clavosPorFabrica;
                int cantidad = (i == fabricasClavos - 1) ? (totalClavos - inicio) : clavosPorFabrica;
                if (cantidad > 0) {
                    executor.submit(() -> {
                        new EstacionDeTrabajo(ComponenteMaquinaGalton.CLAVO, cantidad, contadorClavos, bufferCompartido).run();
                        fase2Latch.countDown(); // Indicar que la producción de clavos ha terminado
                    });
                }
            }

            // Producción de contenedores en paralelo
            int contenedoresPorFabrica = contenedores / fabricasContenedores;
            for (int i = 0; i < fabricasContenedores; i++) {
                int inicio = i * contenedoresPorFabrica;
                int cantidad = (i == fabricasContenedores - 1) ? (contenedores - inicio) : contenedoresPorFabrica;
                if (cantidad > 0) {
                    executor.submit(() -> {
                        new EstacionDeTrabajo(ComponenteMaquinaGalton.CONTENEDOR, cantidad, contadorContenedores, bufferCompartido).run();
                        fase2Latch.countDown(); // Indicar que la producción de contenedores ha terminado
                    });
                }
            }

            // Esperar a que la fase 2 termine
            fase2Latch.await();

            // Fase 3: Producir las bolas
            int bolas = calcularNumeroBolas(niveles);
            int bolasPorFabrica = bolas / fabricasBolas;
            for (int i = 0; i < fabricasBolas; i++) {
                int inicio = i * bolasPorFabrica;
                int cantidad = (i == fabricasBolas - 1) ? (bolas - inicio) : bolasPorFabrica;
                if (cantidad > 0) {
                    executor.submit(() -> new EstacionDeTrabajo(ComponenteMaquinaGalton.BOLA, cantidad, contadorBolas, bufferCompartido).run());
                }
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            // Cerramos el pool de hilos
            executor.shutdown();
        }
    }

    // Método para calcular el número total de clavos en una estructura piramidal
    private int calcularTotalClavos(int niveles) {
        return (niveles * (niveles + 1)) / 2;
    }

    // Método para calcular el número de bolas en función del tamaño del tablero
    private int calcularNumeroBolas(int niveles) {
        return niveles * 5;  // Por ejemplo, 5 bolas por cada nivel
    }
}
