import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState([])

  useEffect(() => {
    const eventSource = new EventSource("/api/whatsapp-stream");
    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessage((prev) => [...prev, newMessage]);
    };
    return () => {
      eventSource.close();
    };
  }, []);
  return (
    <>
    <h2>Mensagem Whatsapp</h2>
      {message.map((msg, index) => (
        <div key={index}>{JSON.stringify(msg)}</div>
      ))}
    </>
  )
}

export default App
