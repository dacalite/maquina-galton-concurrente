import ConfiguracionFabrica from './components/ConfiguracionFabrica'
import TableroGalton from './components/TableroGalton'

function App() {
  return (
    <div className='grid grid-cols-6 grid-rows-1 gap-4 w-screen h-screen p-0 m-0'>
      <div className='col-span-4 w-full h-full p-12 flex justify-center items-center'>
        <ConfiguracionFabrica />
      </div>
      <div className='col-start-5 col-span-2 w-full h-full flex justify-center items-center'>
        <TableroGalton levels={8} numDividers={11} />
      </div>
    </div>
  )
}

export default App
