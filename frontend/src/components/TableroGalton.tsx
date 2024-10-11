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

function sample(array: string[]) {
  const length = array == null ? 0 : array.length;
  return length ? array[Math.floor(Math.random() * length)] : undefined;
}

const color = sample(colors) ?? 'yellow';

const TableroGalton = ({ levels }: { levels: number }) => {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const ballCount = levels * 100;

  // Integrar WebSocket para recibir mensajes del backend
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws', // Aquí va tu endpoint WebSocket
      reconnectDelay: 5000, // Reintentar conexión cada 5 segundos si se cae
      onConnect: () => {
        console.log('Conectado al WebSocket');

        // Suscribirse a /topic/production para recibir mensajes de los componentes ensamblados
        stompClient.subscribe('/topic/production', (message) => {
          console.log('Mensaje recibido del servidor:', message.body);
          // Aquí puedes manejar el mensaje recibido, como mostrar una notificación o actualizar el estado
        });
      },
      onStompError: (error) => {
        console.error('Error STOMP:', error);
      }
    });

    stompClient.activate(); // Activar conexión

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      stompClient.deactivate();
    };
  }, []); // Solo correr una vez al montar el componente

  // Código original de Matter.js no se modifica
  useEffect(() => {
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let Runner = Matter.Runner;
    let World = Matter.World;
    let Bodies = Matter.Bodies;
    let Body = Matter.Body;
    let Events = Matter.Events;

    let engine = Engine.create({
      enableSleeping: true,
    });

    let render = Render.create({
      element: boxRef.current as any,
      engine: engine,
      canvas: canvasRef.current as any,
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

    const peg = (x: number, y: number) =>
        Bodies.circle(x, y, PEG_SIZE, {
          isStatic: true,
          render: {
            fillStyle: FOREGROUND_COLOR,
          },
        });

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

    // inner walls (adapted for new size)
    World.add(engine.world, [
      line(WIDTH * 0.92, 25, 430, 10, Math.PI * -0.15), // right top
      line(WIDTH * 0.08, 25, 430, 10, Math.PI * 0.15), // left top
      line(WIDTH * 0.24, 330, 480, 10, Math.PI * 0.66), // left top
      line(WIDTH * 0.76, 330, 480, 10, Math.PI * -0.66), // left top
    ]);

    // Adjust spacing so that the total space for levels is fixed
    const totalHeightForLevels = HEIGHT * 0.5; // 60% of the total height reserved for levels
    const spacingY = totalHeightForLevels / levels; // Spacing based on number of levels
    const spacingX = WIDTH / (levels + 1); // Adjust X spacing based on levels
    let i, j;
    const pegs = [];
    for (i = 0; i < levels; i++) {
      for (j = 0; j <= i; j++) {
        pegs.push(
            World.add(
                engine.world,
                peg(
                    WIDTH / 2 + (j * spacingX - i * (spacingX / 2)),
                    170 + i * spacingY
                )
            )
        );
      }
    }

    // divider walls
    const numDividers = levels + 3;
    for (let x = 1; x <= numDividers; x++) {
      let divider = wall((x * WIDTH) / numDividers, HEIGHT - 125, 2, 280);
      World.add(engine.world, divider);
    }

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const dropBall = () => {
      let droppedBall = ball(WIDTH / 2 + rand(-100, 100), 25);

      Body.setVelocity(droppedBall, {
        x: 0,
        y: 2,
      });
      Body.setAngularVelocity(droppedBall, rand(-0.05, 0.05));

      Events.on(droppedBall, 'sleepStart', () => {
        Body.setStatic(droppedBall, true);
      });

      World.add(engine.world, droppedBall);
    };

    /* let count = 0;
    const intervalId = setInterval(function () {
      if (count === ballCount) {
        clearInterval(intervalId);
      }

      dropBall();
      count++;
    }, 50);

    return () => clearInterval(intervalId); */
  }, [WIDTH, HEIGHT, levels]);

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
