import { useEffect, useState } from 'react'
import { EtapasProduccion } from './lib/types'
import ConfiguracionFabrica from './components/ConfiguracionFabrica'
import TableroGaltonVacio from './components/TableroGaltonVacio'
import TableroGaltonConstruccion from './components/TableroGaltonConstruccion'
import TableroGaltonSimulacion from './components/TableroGaltonSimulacion'

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

  const [faseActualConstruccion, setFaseActualConstruccion] = useState(1)

  const siguienteFase = () => {
    setFaseActualConstruccion((prevFase) => prevFase + 1)
  }

  const addTablero = () => {
    setHasTablero(true)
  }

  const addPeg = () => {
    setNPegs((prevPegs) => prevPegs + 1)
  }

  const addContainer = () => {
    setNContainers((prevContainers) => prevContainers + 1)
  }

  const addBall = () => {
    setNBalls((prevBalls) => prevBalls + 1)
  }

  useEffect(() => {
    const handleKey = (event: { key: string }) => {
      switch (event.key) {
        case '1':
          addTablero()
          break
        case '2':
          addPeg()
          break
        case '3':
          addContainer()
          break
        case '4':
          addBall()
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <div className='grid grid-cols-6 grid-rows-1 gap-4 w-screen h-screen p-0 m-0'>
      <div className='col-span-4 w-full h-full p-12 flex justify-center items-center'>
        <ConfiguracionFabrica
          etapaActual={etapaActual}
          faseActualConstruccion={faseActualConstruccion}
        />
      </div>
      <div className='col-start-5 col-span-2 w-full h-full flex justify-center items-center'>
        {etapaActual === EtapasProduccion.CONFIGURACION ? (
          <TableroGaltonVacio
            currentLevels={selectedLevels}
            decrementLevels={decrementLevels}
            incrementLevels={incrementLevels}
            startConstruction={() =>
              setEtapaActual(EtapasProduccion.CONSTRUCCION)
            }
          />
        ) : etapaActual === EtapasProduccion.CONSTRUCCION ? (
          <TableroGaltonConstruccion
            hasTablero={hasTablero}
            levels={selectedLevels}
            nBalls={nBalls}
            nContainers={nContainers}
            nPegs={nPegs}
            numDividers={selectedLevels + 3}
            startSimulacion={() => setEtapaActual(EtapasProduccion.SIMULACION)}
            faseActual={faseActualConstruccion}
            siguienteFase={siguienteFase}
            etapaActual={etapaActual}
          />
        ) : (
          <TableroGaltonSimulacion
            levels={selectedLevels}
            numDividers={selectedLevels + 3}
          />
        )}
      </div>
    </div>
  )
}

export default App
