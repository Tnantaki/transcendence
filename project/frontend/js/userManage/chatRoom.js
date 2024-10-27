import * as constant from "../constants.js";
import { fetchAPI } from "./api.js";

export class ChatRoom {
  constructor(chatBody) {
    this.ws = new WebSocket(constant.WS_CHAT_ROOM + "/" + id)
    this.chatBody = chatBody
    this.lastMsg = null
    console.log('Live Chat Open')
  }

  setWebSocketEvent = () => {
    this.webSocketSession.onopen = this.webSocketEventOnOpen;
    this.webSocketSession.onclose = this.webSocketEventOnClose;
    this.webSocketSession.onmessage = this.webSocketEventOnMessage;
    this.webSocketSession.onerror = this.webSocketEventOnError;
  }

  webSocketEventOnOpen = () => {
    console.log("connected.")
  };

  webSocketEventOnError = (event) => {
    console.log("Error: ", event);
  };

  webSocketEventOnClose = (event) => {
    console.log("disconnected")
  };

  webSocketEventOnMessage = (event) => {
    let data = JSON.parse(event.data);
    if (data.sender === "SERVER") {
      switch (data.command) {
        case "MESSAGE":
          console.log('hello')
          break;
        default:
          break;
      }
    }
  };

  sendMessage = (message) => {
    this.ws.send(JSON.stringify(message));
  };

  createMsgSent = (msg) => {
    if (this.lastMsg !== 'me') {
      const msgSent = document.createElement('div')
      msgSent.classList.add("")
    }

  }
}