import { useEffect, useState } from 'react'
import { EtapasProduccion } from './lib/types'
import ConfiguracionFabrica from './components/ConfiguracionFabrica'
import TableroGaltonVacio from './components/TableroGaltonVacio'
import TableroGaltonConstruccion from './components/TableroGaltonConstruccion'
import TableroGaltonSimulacion from './components/TableroGaltonSimulacion'
import axios from 'axios'

function App() {
  const [selectedLevels, setSelectedLevels] = useState(8)

  const [etapaActual, setEtapaActual] = useState<EtapasProduccion>(
    EtapasProduccion.CONFIGURACION
  )

  const incrementLevels = () => {
    selectedLevels < 10 && setSelectedLevels((prevLevels) => prevLevels + 1)
  }

  const decrementLevels = () => {
    selectedLevels > 5 && setSelectedLevels(selectedLevels - 1)
  }

  const [hasTablero, setHasTablero] = useState(false)
  const [nPegs, setNPegs] = useState(0)
  const [nContainers, setNContainers] = useState(0)
  const [nBalls, setNBalls] = useState<number>(0)
  const [startConstruction, setStartConstruction] = useState(false)

  const [faseActualConstruccion, setFaseActualConstruccion] = useState(1)

  const siguienteFase = () => {
    setFaseActualConstruccion((prevFase) => prevFase + 1)
  }

  useEffect(() => {
    let interval: number | null | undefined = null

    if (etapaActual === EtapasProduccion.CONSTRUCCION) {
      interval = setInterval(async () => {
        axios.get('http://localhost:8080/building-info').then((response) => {
          const {
            contadorClavos,
            contadorContenedores,
            contadorBolas,
            contadorTableros,
          } = response.data
          setNPegs(contadorClavos)
          setNContainers(contadorContenedores)
          setNBalls(contadorBolas)
          setHasTablero(contadorTableros > 0)
        })
      }, 100) // Llamar cada 100 ms
    } else {
      interval && clearInterval(interval)
    }

    return () => {
      interval && clearInterval(interval) // Limpiar el intervalo al desmontar el componente
    }
  }, [etapaActual]) // Solo se ejecuta cuando se inicia la construcción

  return etapaActual === EtapasProduccion.SIMULACION ? (
    <div className='select-none w-screen h-screen flex flex-col items-center justify-center'>
      <TableroGaltonSimulacion
        levels={selectedLevels}
        numDividers={selectedLevels + 3}
      />
    </div>
  ) : (
    <div className='select-none grid grid-cols-6 grid-rows-1 gap-4 w-screen h-screen p-0 m-0'>
      <div className='col-span-4 w-full h-full p-12 flex justify-center items-center'>
        <ConfiguracionFabrica
          etapaActual={etapaActual}
          faseActualConstruccion={faseActualConstruccion}
          startConstruction={startConstruction}
          levels={selectedLevels}
        />
      </div>
      <div className='col-start-5 col-span-2 w-full h-full flex justify-center items-center'>
        {etapaActual === EtapasProduccion.CONFIGURACION ? (
          <TableroGaltonVacio
            currentLevels={selectedLevels}
            decrementLevels={decrementLevels}
            incrementLevels={incrementLevels}
            startConstruction={() => {
              setEtapaActual(EtapasProduccion.CONSTRUCCION)
              setStartConstruction(true)
            }}
          />
        ) : (
          etapaActual === EtapasProduccion.CONSTRUCCION && (
            <TableroGaltonConstruccion
              hasTablero={hasTablero}
              levels={selectedLevels}
              nBalls={nBalls}
              nContainers={nContainers}
              nPegs={nPegs}
              numDividers={selectedLevels + 3}
              startSimulacion={() =>
                setEtapaActual(EtapasProduccion.SIMULACION)
              }
              faseActual={faseActualConstruccion}
              siguienteFase={siguienteFase}
              etapaActual={etapaActual}
            />
          )
        )}
      </div>
    </div>
  )
}

export default App
