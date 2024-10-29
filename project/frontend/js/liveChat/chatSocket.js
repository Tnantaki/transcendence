import { WS_CHAT_ROOM } from "../constants.js";
let ws = null

export function connectWebSocket() {
  if (!ws) {
    ws = new WebSocket(WS_CHAT_ROOM)
    console.log('Connect Socket: ', new Date().getTime())
  }
}

export function disconnetWebSocket() {
  ws.close()
  ws = null
  console.log('Disconnect Socket')
}
