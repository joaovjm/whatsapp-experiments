import supabase from "../src/helper/superBaseClient.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const msg = req.body.entry[0].changes[0];

  const message = {
    from: msg.value.messages[0].from,
    to: msg.value.metadata.display_phone_number,
    timestamp: msg.value.messages[0].timestamp,
    type: msg.value.messages[0].type,
    text: msg.value.messages[0].text.body,
  };

  console.log("Mensagem recebida:", message);

  const { data, error } = await supabase.channel("messages").insert([message]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ data });
}
