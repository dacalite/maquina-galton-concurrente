import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import TableroGalton from './components/TableroGalton';


function App() {
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [dropBallTrigger, setDropBallTrigger] = useState(false); // Estado para manejar el trigger de dropBall
    useEffect(() => {
        // Usar SockJS para la conexión WebSocket
        const socket = new SockJS('http://localhost:8080/ws'); // URL correcta para SockJS
        const client = new Client({
            webSocketFactory: () => socket, // Usar SockJS como el cliente WebSocket
            reconnectDelay: 5000, // Intentar reconectar cada 5 segundos
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log('Conectado a STOMP con SockJS');

                client.subscribe('/topic/production', (message) => {
                    console.log('Mensaje recibido del servidor:', message.body);
                    setMensaje(message.body);  // Actualizar el estado con el mensaje recibido
                    setDropBallTrigger(true);  // Activar el trigger para soltar la bola en TableroGalton
                });
            },
            onStompError: (frame) => {
                console.error('Error STOMP: ', frame);
            },
            onWebSocketClose: () => {
                console.log('Connection closed to http://localhost:8080/ws');
            }
        });

        // Conectar al servidor STOMP
        client.activate();

        // Limpiar la conexión STOMP cuando el componente se desmonte
        return () => {
            client.deactivate();
        };
    }, []);

    return (
        <div className='grid grid-cols-3 grid-rows-1 gap-4 w-screen h-screen p-0 m-0'>
            <div className='col-span-2 w-full h-full'>
                <h2>Backend Animation</h2>
                <p>{mensaje ? `Mensaje del backend: ${mensaje}` : 'Esperando mensajes...'}</p>
            </div>
            <div className='col-start-3 w-full h-full flex justify-center items-center'>
                {/* Pasar el trigger dropBall como prop a TableroGalton */}
                <TableroGalton levels={8} dropBall={dropBallTrigger} />
            </div>
        </div>
    );
}

export default App;
