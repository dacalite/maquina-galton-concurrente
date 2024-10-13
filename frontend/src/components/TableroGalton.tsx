import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { Client } from '@stomp/stompjs'; // Importar StompJS para WebSocket

const BACKGROUND_COLOR = '#000000';
const FOREGROUND_COLOR = '#555555';

const BALL_SIZE = 3;
const PEG_SIZE = 6;
const WIDTH = 500;
const HEIGHT = 850;

const colors = [
  '#ff2d55',
  '#5856d6',
  '#ff9500',
  '#ffcc00',
  '#ff3b30',
  '#5ac8fa',
  '#007aff',
  '#4cd964',
];

// Función para seleccionar aleatoriamente un color
function sample(array: string[]) {
  const length = array == null ? 0 : array.length;
  return length ? array[Math.floor(Math.random() * length)] : undefined;
}

const color = sample(colors) ?? 'yellow';

// Función que inicializa el motor y la renderización de Matter.js
const initMatterJs = (
    {levels, boxRef, canvasRef}: {
      levels: number,
        boxRef: React.MutableRefObject<HTMLDivElement | null>,
        canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
    }
) => {
  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const Runner = Matter.Runner;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;
  const Events = Matter.Events;

  const engine = Engine.create({
    enableSleeping: true,
  });

  const render = Render.create({
    element: boxRef.current as never,
    engine: engine,
    canvas: canvasRef.current as never,
    options: {
      width: WIDTH,
      height: HEIGHT,
      background: BACKGROUND_COLOR,
      wireframes: false,
      showSleeping: false,
    },
  });

  Render.run(render);

  const runner = Runner.create();
  Runner.run(runner, engine);

  // Función que crea una bola
  const ball = (x: number, y: number) =>
      Bodies.circle(x, y, BALL_SIZE, {
        restitution: 0.4,
        friction: 0.00001,
        frictionAir: 0.042,
        sleepThreshold: 25,
        render: {
          fillStyle: color,
        },
      });

  // Función que crea una clavija
  const peg = (x: number, y: number) =>
      Bodies.circle(x, y, PEG_SIZE, {
        isStatic: true,
        render: {
          fillStyle: FOREGROUND_COLOR,
        },
      });

  // Función que crea una pared
  const wall = (x: number, y: number, width: number, height: number) =>
      Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        render: {
          fillStyle: FOREGROUND_COLOR,
        },
      });

  const line = (
      x: number,
      y: number,
      width: number,
      height: number,
      angle: number
  ) =>
      Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        angle: angle,
        render: {
          fillStyle: FOREGROUND_COLOR,
        },
      });

  // outer walls
  World.add(engine.world, [
    wall(WIDTH / 2, 0, WIDTH, 20), // top
    wall(WIDTH / 2, HEIGHT, WIDTH, 20), // bottom
    wall(0, HEIGHT / 2, 20, HEIGHT), // left
    wall(WIDTH, HEIGHT / 2, 20, HEIGHT), // right
  ]);

  // inner walls
  World.add(engine.world, [
    line(WIDTH * 0.92, 25, 430, 10, Math.PI * -0.15), // right top
    line(WIDTH * 0.08, 25, 430, 10, Math.PI * 0.15), // left top
    line(WIDTH * 0.24, 330, 480, 10, Math.PI * 0.66), // left top
    line(WIDTH * 0.76, 330, 480, 10, Math.PI * -0.66), // left top
  ]);

  // Adjust spacing for levels
  const totalHeightForLevels = HEIGHT * 0.5;
  const spacingY = totalHeightForLevels / levels;
  const spacingX = WIDTH / (levels + 1);
  const pegs = [];
  for (let i = 0; i < levels; i++) {
    for (let j = 0; j <= i; j++) {
      pegs.push(
          World.add(
              engine.world,
              peg(WIDTH / 2 + (j * spacingX - i * (spacingX / 2)), 170 + i * spacingY)
          )
      );
    }
  }

  // divider walls
  const numDividers = levels + 3;
  for (let x = 1; x <= numDividers; x++) {
    const divider = wall((x * WIDTH) / numDividers, HEIGHT - 125, 2, 280);
    World.add(engine.world, divider);
  }

  // Drop balls randomly
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const dropBall = () => {
    const droppedBall = ball(WIDTH / 2 + rand(-100, 100), 25);
    Body.setVelocity(droppedBall, { x: 0, y: 2 });
    Body.setAngularVelocity(droppedBall, rand(-0.05, 0.05));

    Events.on(droppedBall, 'sleepStart', () => {
      Body.setStatic(droppedBall, true);
    });

    World.add(engine.world, droppedBall);
  };

  return { dropBall };
};

const TableroGalton = ({ levels }: { levels: number }) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!boxRef.current || !canvasRef.current) {
      // Asegurarse de que los elementos DOM están montados antes de inicializar Matter.js
      return;
    }

    // Inicializar Matter.js
    const { dropBall } = initMatterJs({ levels, boxRef, canvasRef });

    // WebSocket para recibir mensajes del backend
    const stompClient = new Client({
      brokerURL: 'ws://localhost:5173/ws', // Aquí va tu endpoint WebSocket
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Conectado al WebSocket');

        // Suscribirse a /topic/production para recibir mensajes de los componentes ensamblados
        stompClient.subscribe('/topic/production', (message) => {
          console.log('Mensaje recibido del servidor:', message.body);
          // Aquí puedes manejar el mensaje recibido, como trigger para dropBall o notificación
          dropBall(); // Llama a dropBall cuando recibes un mensaje del servidor
        });
      },
      onStompError: (error) => {
        console.error('Error STOMP:', error);
      }
    });

    stompClient.activate();

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      stompClient.deactivate();
    };
  }, [levels]);

  return (
      <div
          ref={boxRef}
          style={{
            width: WIDTH,
            height: HEIGHT,
          }}
      >
        <canvas ref={canvasRef} />
      </div>
  );
};

export default TableroGalton;
