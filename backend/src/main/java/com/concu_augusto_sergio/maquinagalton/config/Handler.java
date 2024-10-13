package com.concu_augusto_sergio.maquinagalton.config;

import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j //decorador que genera un logger (info, debug, error, etc)
@Component
public class Handler extends TextWebSocketHandler {

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("Sesion establecida: " + session.getId());
        sessions.add(session);
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        String msg = (String) message.getPayload();
        // No incluir el objeto session en el mensaje para evitar problemas con toString()
        session.sendMessage(new TextMessage("Sesion generada con mensaje: " + msg));
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
        sessions.remove(session);
    }

    public void notificarClientes(String mensaje) throws IOException {
        for (WebSocketSession session : sessions) {
            if (session.isOpen()){
                session.sendMessage(new TextMessage(mensaje));
                log.info("Mensaje enviado a la sesión: " + session.getId() + " Mensaje: " + mensaje);
            }
        }
    }

}
