import { useState } from 'react'
import Register from './Components/Register'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <Login />
    </main>
  )
}

export default App
