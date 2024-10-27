import { getMyProfile, getProfile } from "../services/profileService.js";

export default class ChatRoom {
  constructor(chatBody, my_profile, your_profile) {
    this.chatBody = chatBody
    this.ws = null
    this.my_profile = my_profile
    this.your_profile = your_profile
    this.lastMsgUser = null

    console.log('Live Chat Open')
  }

  static async create(chatBody, your_id) {
    // this.ws = new WebSocket(constant.WS_CHAT_ROOM + "/" + id)
    const my_profile = await getMyProfile()
    const your_profile = await getProfile(your_id)

    return new ChatRoom(chatBody, my_profile, your_profile)
  }

  setWebSocketEvent = () => {
    this.ws.onopen = this.webSocketEventOnOpen;
    this.ws.onclose = this.webSocketEventOnClose;
    this.ws.onmessage = this.webSocketEventOnMessage;
    this.ws.onerror = this.webSocketEventOnError;
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
    if (this.lastMsgUser && this.lastMsgUser.firstElementChild.id === 'message-sent') {
      const msgParagraph = document.createElement('p')
      msgParagraph.innerHTML = msg
      this.lastMsgUser.querySelector('#message-sent').appendChild(msgParagraph)
    } else {
      const msgSent = document.createElement('div')
      console.log(this.my_profile)
      msgSent.classList.add("chat-message")
      msgSent.innerHTML = `
        <div id="message-sent" class="flex-grow-1 d-flex flex-column text-end chat-text justify-content-center">
          <p>${msg}</p>
        </div>
        <div class="chat-picture">
          <img src="/api${this.my_profile.profile}" alt="profile-picture">
        </div>
      `
      this.chatBody.appendChild(msgSent)
      this.lastMsgUser = msgSent
    }
  }
}