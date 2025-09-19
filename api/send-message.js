export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  
    const msg = req.body;
  
    // Exemplo usando API Graph WhatsApp
    const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: msg.to,
        type: msg.type,
        text: { body: msg.content }
      })
    });
  
    const data = await response.json();
    res.status(response.ok ? 200 : 500).json(data);
  }
  