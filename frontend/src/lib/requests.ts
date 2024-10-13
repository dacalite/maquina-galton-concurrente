import axios from 'axios'

export const triggerConstruction = ({
  nLevels,
  nPegs,
  nContainers,
  nBalls,
}: {
  nLevels: number
  nPegs: number
  nContainers: number
  nBalls: number
}) => {
  const data = {
    niveles: nLevels,
    fabricasClavos: nPegs,
    fabricasContenedores: nContainers,
    fabricasBolas: nBalls,
  }

  axios
    .post('http://localhost:8080/iniciar-produccion', data)
    .then((response) => {
      console.log('Respuesta del servidor:', response.data)
    })
    .catch((error) => {
      console.error(
        'Error en la solicitud:',
        error.response ? error.response.data : error.message
      )
    })
}
