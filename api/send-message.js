export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  
    const {to, message, type} = req.body;
  
    // Envia mensagem usando API Graph WhatsApp
    const response = await fetch(`https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: type, // text, image, video, document, audio
        text: { body: message }, // text: { body: message }, image: { id: image_id }, video: { id: video_id }, document: { id: document_id }, audio: { id: audio_id }
      })
    });
  
    //const data = await response.json();
    console.log(response);
    /*if (data){
      await supabase.from('messages').insert([{
        from: process.env.WHATSAPP_PHONE_NUMBER,
        to: to,
        type: type,
        content: message,
        timestamp: new Date()
      }]);
    }*/
    //res.status(response.ok ? 200 : 500).json(data);
    res.status(200).json(response);
  }
  