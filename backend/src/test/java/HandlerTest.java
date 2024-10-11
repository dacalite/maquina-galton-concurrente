import static org.mockito.Mockito.*;

import com.concu_augusto_sergio.maquinagalton.config.Handler;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import static org.mockito.Mockito.verify;

public class HandlerTest {

    @Test
    public void testSendMessage() throws Exception {
        // Crear mock del WebSocketSession
        WebSocketSession session = Mockito.mock(WebSocketSession.class);

        // Instanciar el handler
        Handler handler = new Handler();

        // Crear el mensaje que envías
        TextMessage message = new TextMessage("Hello");

        // Simular el envío del mensaje
        handler.handleMessage(session, message);

        // Verificar que los mensajes fueron enviados, sin usar session en la concatenación
        verify(session).sendMessage(new TextMessage("Sesion generada con mensaje: Hello"));
        verify(session).sendMessage(new TextMessage("Acabada sesion: Hello"));
    }
}


