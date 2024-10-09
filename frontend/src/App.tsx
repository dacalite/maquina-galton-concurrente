import TableroGalton from './components/TableroGalton'

function App() {
  return (
    <div className='grid grid-cols-3 grid-rows-1 gap-4 w-screen h-screen p-0 m-0'>
      <div className='col-span-2 w-full h-full'>Backend Animation</div>
      <div className='col-start-3 w-full h-full flex justify-center items-center'>
        <TableroGalton levels={8} />
      </div>
    </div>
  )
}

export default App
