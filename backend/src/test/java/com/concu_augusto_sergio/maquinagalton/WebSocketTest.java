package com.concu_augusto_sergio.maquinagalton;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WebSocketTest {

    private static final String WS_URL = "ws://localhost:{port}/ws";

    @LocalServerPort
    private int port;

    @Test
    public void testWebSocketConnection() throws Exception {
        WebSocketStompClient stompClient = new WebSocketStompClient(new StandardWebSocketClient());

        // Añadir esta línea para configurar el conversor de mensajes a String
        stompClient.setMessageConverter(new StringMessageConverter());

        // Conectar al servidor WebSocket STOMP
        StompSession session = stompClient.connect(
                WS_URL.replace("{port}", String.valueOf(port)),
                new WebSocketHttpHeaders(),
                new StompSessionHandlerAdapter() {}
        ).get(1, TimeUnit.SECONDS);

        // Enviar un mensaje al servidor
        session.send("/app/message", "Test Message");

        // Suscribirse para recibir una respuesta
        session.subscribe("/topic/responses", new StompSessionHandlerAdapter() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return String.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                assertEquals("Expected Response", payload.toString());
            }
        });

        TimeUnit.SECONDS.sleep(1);
        session.disconnect();
    }
}
