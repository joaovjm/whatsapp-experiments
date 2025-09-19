import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState([])

  useEffect(() => {
    fetch("/api/whatsapp")
    .then(response => response.json())
    .then(data => setMessage(data))
  }, [])

  return (
    <>
      {message}
    </>
  )
}

export default App
