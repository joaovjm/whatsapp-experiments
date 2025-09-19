// pages/api/whatsapp.js
import dotenv from "dotenv";
dotenv.config();

let messages = []

export default function handler(req, res) {
    if (req.method === "GET") {
      // Verificação do webhook
      const verify_token = process.env.WEBHOOK_VERIFY_TOKEN;
      console.log("Tokend e verificação do webhook: ", process.env.WEBHOOK_VERIFY_TOKEN)
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];
        
      if (mode && token && mode === "subscribe" && token === verify_token) {
        console.log("WEBHOOK VERIFICADO");
        res.status(200).send(challenge);
      } else {
        res.status(403).send("Token inválido");
      }
    }
  
    if (req.method === "POST") {
      // Recebe mensagens do WhatsApp
      console.log("Mensagem recebida:", JSON.stringify(req.body.entry[0].changes[0].value.messages[0].text.body));
      const text = req.body.entry[0].changes[0].value.messages[0].text.body
      messages.push(text)

      res.status(200).send("EVENT_RECEIVED");
    }
  }
  