import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'

const BACKGROUND_COLOR = '#000000'
const FOREGROUND_COLOR = '#555555'
const WIDTH = 500
const HEIGHT = 850

interface TableroGaltonVacioProps {
  incrementLevels: () => void
  decrementLevels: () => void
  currentLevels: number
  startConstruction: () => void
}

const TableroGaltonVacio = ({
  currentLevels,
  decrementLevels,
  incrementLevels,
  startConstruction,
}: TableroGaltonVacioProps) => {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)

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

    const wall = (x: number, y: number, width: number, height: number) =>
      Bodies.rectangle(x, y, width, height, {
        isStatic: true,
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
  }, [WIDTH, HEIGHT])

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
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-10'>
        <h1 className='text-3xl text-stone-200 w-full text-center'>
          Niveles pirámide de Galton
        </h1>
        <div className='bg-stone-300 opacity-75 w-48 h-28 rounded-2xl flex items-center justify-between text-6xl px-3 bg-opacity-70'>
          <button onClick={decrementLevels}>{'<'}</button>
          <h1>{currentLevels}</h1>
          <button onClick={incrementLevels}>{'>'}</button>
        </div>
        <button
          className='p-3 bg-stone-300 w-full rounded-xl text-xl'
          onClick={startConstruction}
        >
          Empezar Fabricación
        </button>
      </div>
    </div>
  )
}

export default TableroGaltonVacio
