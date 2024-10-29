import WebSocket, { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", ws => { // ws is single connection
  console.log("New client connected!");

  ws.on("message", data => { // Waiting for data from client
    console.log(`Client has send us: ${data}`);
    const dataObj = JSON.parse(data);
    broadcastMsg(dataObj)
  });

  ws.on("close", () => { // Trigger when connection is close
    console.log("Cliend has disconnected!");
    const dataObj = { sender: "SERVER", type: "MESSAGE_WARNING", message: "Friend has leave the room." }
    broadcastMsg(dataObj)
  });

  // Start chat when there are 2 clients in socket
  if (wss.clients.size > 1) {
    console.log("Start Chat");
    const dataObj = { sender: "SERVER", type: "CHAT_START", message: "" }
    broadcastMsg(dataObj)
  }
});

console.log("Start socket server on port: 3000")

// For testing Tournament Warning
setTimeout(() => {
  const dataObj = { sender: "SERVER", type: "MESSAGE_WARNING", message: "Tournament are starting." }
  broadcastMsg(dataObj)
}, (20 * 1000))

function broadcastMsg(dataObj) {
  wss.clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) {
      c.send(JSON.stringify(dataObj))
      console.log("Send message to client")
    }
  })
}