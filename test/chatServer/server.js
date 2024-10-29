import { createServer } from 'http'
import WebSocket, { WebSocketServer } from 'ws';
import url from 'url'

const host = 'localhost'
const port = 3000
// noServer : allow websocket to detachec from http server when upgrade
// make it can use the same port
const wss = new WebSocketServer({ noServer: true });

// Create http server
const server = createServer()

// Get trigger when receive http request with 'Upgrade' header
server.on('upgrade', (req, socket, head) => {
  const { pathname, query } = url.parse(req.url, true)

  if (pathname === '/chat/noti') {
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req, query.userId)
    })
  }
})

wss.on('connection', (ws, req, userId) => {
  console.log('Client connect: ', userId)

  ws.on('message', msg => {
    console.log(msg)
  })
})

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})




// wss.on("connection", (ws, req, id, meta) => { // ws is single connection
  // console.log('meta', meta)
  // console.log("New client connected!");

  // ws.on("message", data => { // Waiting for data from client
  //   console.log(`Client has send us: ${data}`);
  //   const dataObj = JSON.parse(data);
  //   broadcastMsg(dataObj)
  // });

  // ws.on("close", () => { // Trigger when connection is close
  //   console.log("Cliend has disconnected!");
  //   const dataObj = { sender: "SERVER", type: "MESSAGE_WARNING", message: "Friend has leave the room." }
  //   broadcastMsg(dataObj)
  // });

  // // Start chat when there are 2 clients in socket
  // if (wss.clients.size > 1) {
  //   console.log("Start Chat");
  //   const dataObj = { sender: "SERVER", type: "CHAT_START", message: "" }
  //   broadcastMsg(dataObj)
  // }
// });

// console.log("Start socket server on port: 3000")

// // For testing Tournament Warning
// setTimeout(() => {
//   const dataObj = { sender: "SERVER", type: "MESSAGE_WARNING", message: "Tournament are starting." }
//   broadcastMsg(dataObj)
// }, (20 * 1000))

// function broadcastMsg(dataObj) {
//   wss.clients.forEach(c => {
//     if (c.readyState === WebSocket.OPEN) {
//       c.send(JSON.stringify(dataObj))
//       console.log("Send message to client")
//     }
//   })
// }