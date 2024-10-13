import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { EtapasProduccion } from '../lib/types'

const BACKGROUND_COLOR = '#000000'
const FOREGROUND_COLOR = '#555555'

const PEG_SIZE = 6
const WIDTH = 500
const HEIGHT = 850

interface TableroGaltonConstruccionProps {
  levels: number
  numDividers: number
  hasTablero: boolean
  nPegs: number
  nContainers: number
  nBalls: number
  startSimulacion: () => void
  faseActual: number
  siguienteFase: () => void
  etapaActual: EtapasProduccion
}

const TableroGaltonConstruccion = ({
  levels,
  numDividers,
  hasTablero,
  nPegs,
  nContainers,
  nBalls,
  startSimulacion,
  faseActual,
  siguienteFase,
  etapaActual,
}: TableroGaltonConstruccionProps) => {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  const ballCount = levels * 100

  useEffect(() => {
    faseActual === 1 && hasTablero && siguienteFase()
  }, [hasTablero])

  useEffect(() => {
    faseActual === 2 &&
      nPegs === (levels * (levels + 1)) / 2 &&
      nContainers === numDividers &&
      siguienteFase()
  }, [nPegs, nContainers])

  useEffect(() => {
    faseActual === 3 && nBalls === ballCount && startSimulacion()
  }, [nBalls])

  useEffect(() => {
    let Engine = Matter.Engine
    let Render = Matter.Render
    let Runner = Matter.Runner
    let World = Matter.World
    let Bodies = Matter.Bodies

    let engine = Engine.create({
      enableSleeping: true,
    })

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
    })

    Render.run(render)

    const runner = Runner.create()
    Runner.run(runner, engine)

    const peg = (x: number, y: number) =>
      Bodies.circle(x, y, PEG_SIZE, {
        isStatic: true,
        render: {
          fillStyle: FOREGROUND_COLOR,
        },
      })

    const wall = (x: number, y: number, width: number, height: number) =>
      Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        render: {
          fillStyle: FOREGROUND_COLOR,
        },
      })

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
      })

    // outer walls
    World.add(engine.world, [
      wall(WIDTH / 2, 0, WIDTH, 20), // top
      wall(WIDTH / 2, HEIGHT, WIDTH, 20), // bottom
      wall(0, HEIGHT / 2, 20, HEIGHT), // left
      wall(WIDTH, HEIGHT / 2, 20, HEIGHT), // right
    ])

    // inner walls (adapted for new size)
    hasTablero &&
      World.add(engine.world, [
        line(WIDTH * 0.92, 25, 430, 10, Math.PI * -0.15), // right top
        line(WIDTH * 0.08, 25, 430, 10, Math.PI * 0.15), // left top
        line(WIDTH * 0.24, 330, 480, 10, Math.PI * 0.66), // left top
        line(WIDTH * 0.76, 330, 480, 10, Math.PI * -0.66), // left top
      ])

    // Adjust spacing so that the total space for levels is fixed
    const totalHeightForLevels = HEIGHT * 0.5 // 60% of the total height reserved for levels
    const spacingY = totalHeightForLevels / levels // Spacing based on number of levels
    const spacingX = WIDTH / (levels + 1) // Adjust X spacing based on levels
    let i, j
    const pegs = []
    let pegsCount = 0
    for (i = 0; i < levels; i++) {
      for (j = 0; j <= i; j++) {
        pegsCount < nPegs &&
          pegs.push(
            World.add(
              engine.world,
              peg(
                WIDTH / 2 + (j * spacingX - i * (spacingX / 2)),
                170 + i * spacingY
              )
            )
          ) &&
          (pegsCount += 1)
      }
    }

    // divider walls
    for (let x = 1; x <= numDividers; x++) {
      let divider = wall((x * WIDTH) / numDividers, HEIGHT - 125, 2, 280)
      x <= nContainers && World.add(engine.world, divider)
    }
  }, [hasTablero, nPegs, nContainers, nBalls, levels, numDividers])

  return (
    <div
      ref={boxRef}
      style={{
        width: WIDTH,
        height: HEIGHT,
      }}
      className='relative'
    >
      <canvas ref={canvasRef} />
      {faseActual === 3 && etapaActual === EtapasProduccion.CONSTRUCCION && (
        <div className='absolute top-4 left-1/2 -translate-x-1/2 text-white text-center text-2xl'>
          Bolas Fabricadas
          <br />
          {nBalls} de {ballCount}{' '}
        </div>
      )}
    </div>
  )
}

export default TableroGaltonConstruccion
