import { Container } from '@mui/material'
import './App.css'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <Container sx={{ mt: -6 }}>
      <main>
        <h3>Vehicle Travelled Location History</h3> <Outlet />
      </main>
    </Container>
  )
}

export default App
