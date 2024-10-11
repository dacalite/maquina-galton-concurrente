package com.concu_augusto_sergio.maquinagalton.controladores;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class StompMessageController {

    @MessageMapping("/message")
    @SendTo("/topic/messages")  // Todos los clientes suscritos a /topic/messages recibirán el mensaje
    public String processMessageFromClient(String message) {
        return "Mensaje del servidor: " + message;  // Este mensaje será enviado a los clientes
    }
}
