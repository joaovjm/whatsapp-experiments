import { useEffect, useState } from "react";
import supabase from "../src/helper/superBaseClient.js";


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
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.unsubscribe(subscription);
  }, []);

  const sendMessage = async () => {
    const to = '5521983046033';
    const type = 'text';
    const message = input;

    const response = await fetch('/api/send-message', {
      method: 'POST',
      body: JSON.stringify({to, type, message}),
      headers: { 'Content-Type': 'application/json' }
    });
    
    setInput('');
  };

  return (
    <div>
      <div>
        {messages.map(m => (
          <p key={m.id}>{m.from}: {m.type === 'text' ? m.text : <a href={m.text} target="_blank" rel="noopener noreferrer">Arquivo</a>}</p>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}
