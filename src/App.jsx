import { useEffect, useState } from "react";
import supabase from "../helper/superBaseClient";


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Buscar histórico inicial
    supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: true })
      .then(({ data }) => setMessages(data));

    // Inscrição Realtime
    const subscription = supabase
      .from('messages')
      .on('INSERT', payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeSubscription(subscription);
  }, []);

  const sendMessage = async () => {
    const msg = { from: 'me', to: 'user2', type: 'text', content: input };
    await fetch('/api/send-message', {
      method: 'POST',
      body: JSON.stringify(msg),
      headers: { 'Content-Type': 'application/json' }
    });
    setInput('');
  };

  return (
    <div>
      <div>
        {messages.map(m => (
          <p key={m.id}>{m.from}: {m.type === 'text' ? m.content : <a href={m.content} target="_blank" rel="noopener noreferrer">Arquivo</a>}</p>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}
