import { useEffect, useState } from 'react'
import lottieFabrica from '../lotties/fabrica.json'
import lottieVacio from '../lotties/empty.json'
import Lottie from 'lottie-react'
import { EtapasProduccion } from '../lib/types'
import { triggerConstruction } from '../lib/requests'

const MAX_CLAVOS = 4
const MAX_CONTENEDORES = 4
const MAX_BOLAS = 8

function ConfiguracionFabrica({
  etapaActual,
  faseActualConstruccion,
  startConstruction,
  levels
}: {
  etapaActual: EtapasProduccion
  faseActualConstruccion: number
  startConstruction: boolean
  levels:number
}) {
  const [nClavos, setNClavos] = useState<number>(1)
  const [nContenedores, setNContenedores] = useState<number>(1)
  const [nBolas, setNBolas] = useState<number>(1)

  useEffect(() => {
    startConstruction &&
      triggerConstruction({
        nBalls: nBolas,
        nContainers: nContenedores,
        nPegs: nClavos,
        nLevels: levels,
      })
  }, [startConstruction])

  const isConfiguracion = etapaActual === EtapasProduccion.CONFIGURACION

  return (
    <div className='w-full h-full flex flex-col justify-between items-center bg-lime-100 m-7 p-7 rounded-xl'>
      <div className='w-full h-1/4 rounded-xl bg-lime-200 p-4 flex flex-col justify-start items-start gap-2'>
        <div className='h-1/5 w-full opacity-60 text-xl flex justify-around relative'>
          <h1 className='absolute left-0'>FASE 1</h1>
          <h1>FÁBRICA TABLERO BASE</h1>
        </div>
        <div className='w-full h-3/4 bg-lime-300 rounded-xl bg-opacity-80 flex justify-center items-center'>
          <Lottie animationData={lottieFabrica} loop={true} className='h-1/2' />
        </div>
      </div>
      <div
        className={`w-full h-1/4 rounded-xl bg-lime-200 p-4 flex flex-col justify-start items-start gap-2 ${
          etapaActual === EtapasProduccion.CONSTRUCCION &&
          faseActualConstruccion === 1 &&
          'opacity-50'
        }`}
      >
        <div className='h-1/5 w-full opacity-60 text-xl flex justify-around relative'>
          <h1 className='absolute left-0'>FASE 2</h1>
          <h1>FÁBRICAS CLAVOS</h1>
          <h1>FÁBRICAS CONTENEDORES</h1>
        </div>
        <div className='w-full h-4/5 bg-lime-300 rounded-xl bg-opacity-80 grid grid-cols-2 grid-rows-1 gap-4 relative'>
          <div className='absolute left-1/2 h-full w-1 top-0 opacity-50 bg-black rounded-3xl'></div>
          <div className='flex justify-center items-center'>
            <Lottie
              animationData={lottieFabrica}
              loop={true}
              className='w-32'
            />

            {Array.from({ length: nClavos - 1 }).map((_, index) => (
              <Lottie
                key={index}
                animationData={lottieFabrica}
                loop={true}
                className='w-32'
                onClick={() => isConfiguracion && setNClavos(nClavos - 1)}
              />
            ))}

            {Array.from({ length: MAX_CLAVOS - nClavos }).map((_, index) => (
              <Lottie
                key={`empty-${index}`}
                animationData={lottieVacio}
                loop={true}
                className='w-24 mx-5 opacity-60'
                onClick={() =>
                  isConfiguracion && setNClavos((prevNClvos) => prevNClvos + 1)
                }
              />
            ))}
          </div>

          <div className='flex justify-center items-center'>
            <Lottie
              animationData={lottieFabrica}
              loop={true}
              className='w-32'
            />

            {Array.from({ length: nContenedores - 1 }).map((_, index) => (
              <Lottie
                key={index}
                animationData={lottieFabrica}
                loop={true}
                className='w-32'
                onClick={() =>
                  isConfiguracion && setNContenedores(nContenedores - 1)
                }
              />
            ))}

            {Array.from({ length: MAX_CONTENEDORES - nContenedores }).map(
              (_, index) => (
                <Lottie
                  key={`empty-${index}`}
                  animationData={lottieVacio}
                  loop={true}
                  className='w-24 mx-5 opacity-60'
                  onClick={() =>
                    isConfiguracion &&
                    setNContenedores(
                      (prevNContenedores) => prevNContenedores + 1
                    )
                  }
                />
              )
            )}
          </div>
        </div>
      </div>
      <div
        className={`w-full h-1/4 rounded-xl bg-lime-200 p-4 flex flex-col justify-start items-start gap-2 ${
          etapaActual === EtapasProduccion.CONSTRUCCION &&
          faseActualConstruccion !== 3 &&
          'opacity-50'
        }`}
      >
        <div className='h-1/5 w-full opacity-60 text-xl flex justify-around relative'>
          <h1 className='absolute left-0'>FASE 3</h1>
          <h1>FÁBRICAS BOLAS</h1>
        </div>
        <div className='w-full h-3/4 bg-lime-300 rounded-xl bg-opacity-80 flex justify-center items-center'>
          <Lottie animationData={lottieFabrica} loop={true} className='w-32' />

          {Array.from({ length: nBolas - 1 }).map((_, index) => (
            <Lottie
              key={index}
              animationData={lottieFabrica}
              loop={true}
              className='w-32'
              onClick={() => setNBolas(nBolas - 1)}
            />
          ))}

          {Array.from({ length: MAX_BOLAS - nBolas }).map((_, index) => (
            <Lottie
              key={`empty-${index}`}
              animationData={lottieVacio}
              loop={true}
              className='w-24 mx-4 opacity-60'
              onClick={() => setNBolas((PrevNBolas) => PrevNBolas + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConfiguracionFabrica
