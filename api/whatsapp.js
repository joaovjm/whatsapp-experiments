// pages/api/whatsapp.js
import dotenv from "dotenv";
import supabase from "../src/helper/superBaseClient.js";
import formatPhone from "../src/services/formatPhone.js";
dotenv.config();

let clients = [];

function sendMessageToClients(message) {
  clients.forEach((res) => {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Verificação do webhook
    const verify_token = process.env.WEBHOOK_VERIFY_TOKEN;
    console.log(
      "Tokend e verificação do webhook: ",
      process.env.WEBHOOK_VERIFY_TOKEN
    );
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
    //console.log("Mensagem recebida:", JSON.stringify(req.body, null, 2));
    //sendMessageToClients(req.body);
    const msg = req.body.entry[0].changes[0];

    const message = {
      from: msg?.value?.messages[0]?.from,
      to: msg?.value?.metadata?.display_phone_number,
      timestamp: msg?.value?.messages[0]?.timestamp,
      type: msg?.value?.messages[0]?.type,
      content: msg?.value?.messages[0]?.text?.body || null,
    };


    const { data, error } = await supabase
      .from("messages")
      .insert([message]);

    if(data){
      sendMessageToClients(data);
    }
    if(error){
      console.error("Erro ao enviar mensagem:", error);
    }
    res.status(200).send("EVENT_RECEIVED");
  }
}
