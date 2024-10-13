package com.concu_augusto_sergio.maquinagalton.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class StompMessageController {

    @MessageMapping("/message")
    @SendTo("/topic/messages")
    public String processMessageFromClient(String message) {
        return "Mensaje del servidor: " + message;
    }

}

