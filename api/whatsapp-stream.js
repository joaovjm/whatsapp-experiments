import dotenv from "dotenv";
dotenv.config();

let clients = [];

function sendMessageToClients(message) {
  clients.forEach((res) => {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  });
}

export default function handler(req, res) {
  if (req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write("\n");
    clients.push(res);
    req.on("close", () => {
      clients = clients.filter((client) => client !== res);
    });
  }

  if (req.method === "POST") {
    // Recebe mensagem do WhatsApp e envia para todos os clients
    console.log("Mensagem recebida:", req.body);
   

    res.status(200).send("EVENT_RECEIVED");
  }
}
