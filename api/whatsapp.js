// pages/api/whatsapp.js
import dotenv from "dotenv";
import supabase from "../src/helper/superBaseClient.js";

dotenv.config();

let clients = [];

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Verificação do webhook
    const verify_token = process.env.WEBHOOK_VERIFY_TOKEN;

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
    const msg = req.body.entry[0].changes[0];

    const message = {
      from: msg?.value?.messages?.[0]?.from,
      to: msg?.value?.metadata?.display_phone_number,
      timestamp: new Date(msg?.value?.messages?.[0]?.timestamp * 1000),
      type: msg?.value?.messages?.[0]?.type,
      text: msg?.value?.messages?.[0]?.text?.body || null,
    };


    const { data, error } = await supabase
      .from("messages")
      .insert([message]);
      
    if(error){
      console.error("Erro ao enviar mensagem:", error);
    }
    res.status(200).send("EVENT_RECEIVED");
  }
}
