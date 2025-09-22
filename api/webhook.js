import supabase from "../src/helper/superBaseClient.jsx";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const msg = req.body;

  const message = {
    from: msg.from,
    to: msg.to,
    timestamp: msg.timestamp,
    type: msg.type,
    content: msg.content,
  };
  const { data, error } = await supabase.channel("messages").insert([message]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ data });
}
