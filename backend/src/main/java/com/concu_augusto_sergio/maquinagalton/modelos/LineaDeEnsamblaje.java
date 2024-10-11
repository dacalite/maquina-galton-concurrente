package com.concu_augusto_sergio.maquinagalton.modelos;

import com.concu_augusto_sergio.maquinagalton.config.Handler;
import java.io.IOException;
import java.util.concurrent.BlockingQueue;

public class LineaDeEnsamblaje implements Runnable {

    private final BlockingQueue<ComponenteMaquinaGalton> bufferCompartido;
    private final Handler webSocketHandler;

    public LineaDeEnsamblaje(BlockingQueue<ComponenteMaquinaGalton> bufferCompartido, Handler webSocketHandler) {
        this.bufferCompartido = bufferCompartido;
        this.webSocketHandler = webSocketHandler;
    }

    @Override
    public void run() {
        try {
            while (true) {
                // Extraer un componente del buffer (espera si está vacío)
                ComponenteMaquinaGalton componente = bufferCompartido.take();
                ensamblarComponente(componente);
                webSocketHandler.notificarClientes("Componente extraido del buffer: " + componente.toString());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void ensamblarComponente(ComponenteMaquinaGalton componente) {
        // Simular el tiempo de ensamblaje
        try {
            Thread.sleep(500); // Simular tiempo de ensamblaje
            // Notificar a los clientes conectados vía WebSocket
            webSocketHandler.notificarClientes("Componente ensamblado: " + componente.toString());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("Componente ensamblado: " + componente);
    }
}