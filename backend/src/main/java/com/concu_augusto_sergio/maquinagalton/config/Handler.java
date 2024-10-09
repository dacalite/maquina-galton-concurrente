package com.concu_augusto_sergio.maquinagalton.config;

import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.*;

@Slf4j //decorador que genera un logger (info, debug, error, etc)
public class Handler implements WebSocketHandler {
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("Sesion establecida: " + session.getId());
    }

    @Override //recibimos mensaje, lo procesamos y enviamos respuesta
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
            String msg = (String) message.getPayload();
            log.info("Mensaje recibido: " + msg);
            session.sendMessage(new TextMessage("Sesion generada: " + session + " con mensaje: " + msg));
            Thread.sleep(1000);
            session.sendMessage(new TextMessage("Acabada sesion: " + msg));
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.info("Error de transporte: {} en sesion: {}", exception.getMessage(), session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        log.info("Sesion cerrada: {}", session.getId());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
