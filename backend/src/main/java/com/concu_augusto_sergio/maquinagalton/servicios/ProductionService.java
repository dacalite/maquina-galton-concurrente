package com.concu_augusto_sergio.maquinagalton.servicios;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ProductionService {

    private final SimpMessagingTemplate messagingTemplate;

    public ProductionService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendProductionUpdate(String message) {
        messagingTemplate.convertAndSend("/topic/production", message);
    }
}

