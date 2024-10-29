import { getMyProfile, getProfile } from "../services/profileService.js";
import { WS_CHAT_ROOM } from "../constants.js";

export default class ChatRoom {
  constructor(my_profile, friend_profile, chatBoxModal) {
    this.chatBody = document.getElementById('chatBody')
    this.chatInput = document.getElementById('chatInput')
    this.my_profile = my_profile
    this.friend_profile = friend_profile
    this.ws = new WebSocket(WS_CHAT_ROOM) // TODO: for Testing
    this.chatBoxModal = chatBoxModal
    this.lastMsgUser = null
    this.titleBarName = null

    this.setWebSocketEvent()
    this.setInvitePongIcon()
    this.setTitleBar()
  }

  static async create(friend_id, chatBoxModal) {
    const my_profile = await getMyProfile()
    const friend_profile = await getProfile(friend_id)

    return new ChatRoom(my_profile, friend_profile, chatBoxModal)
  }

  setWebSocketEvent = () => {
    this.ws.onopen = this.webSocketEventOnOpen;
    this.ws.onclose = this.webSocketEventOnClose;
    this.ws.onmessage = this.webSocketEventOnMessage;
    this.ws.onerror = this.webSocketEventOnError;
  }

  webSocketEventOnOpen = () => {
    console.log("connected.")
    // Open chat box
    const chatBox = new bootstrap.Modal(chatBoxModal);
    chatBox.show()
  };

  webSocketEventOnError = (event) => {
    console.log("Error: ", event);
  };

  webSocketEventOnClose = () => {
    console.log("disconnected")
  };

  // TODO: Waiting for backend change protocol
  webSocketEventOnMessage = (event) => {
    let data = JSON.parse(event.data);
    switch (data.type) {
      case "MESSAGE_CHAT":
        if (data.sender === this.my_profile.id)
          this.createMsgSent(data.message)
        else
          this.createMsgReceive(data.message)
        break;
      case "MESSAGE_WARNING":
        this.createMsgWaning(data.message)
        break;
      case "PONT_INVITE":
        if (data.sender !== this.my_profile.id)
          this.createPongInvite()
        break;
      case "CHAT_START":
        this.createTitleBarName()
        this.setEnterKey()
        break;
      default:
        break;
    }
  };

  sendMessage = (msg) => {
    const msgObj = {
      sender: this.my_profile.id,
      type: "MESSAGE_CHAT",
      message: msg
    }
    this.ws.send(JSON.stringify(msgObj));
  };

  createMsgSent = (msg) => {
    if (this.lastMsgUser && this.lastMsgUser.getElementsByTagName('div')[0].id === 'message-sent') {
      const msgParagraph = document.createElement('p')
      msgParagraph.innerHTML = msg
      this.lastMsgUser.querySelector('#message-sent').appendChild(msgParagraph)
    } else {
      const msgSent = document.createElement('div')
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

  createMsgReceive = (msg) => {
    if (this.lastMsgUser && this.lastMsgUser.getElementsByTagName('div')[1].id === 'message-received') {
      const msgParagraph = document.createElement('p')
      msgParagraph.innerHTML = msg
      this.lastMsgUser.querySelector('#message-received').appendChild(msgParagraph)
    } else {
      const msgReceived = document.createElement('div')
      msgReceived.classList.add("chat-message")
      msgReceived.innerHTML = `
        <div class="chat-picture">
          <img src="/api${this.friend_profile.profile}" alt="profile-picture">
        </div>
        <div id="message-received" class="flex-grow-1 d-flex flex-column text-start chat-text justify-content-center">
          <p>${msg}</p>
        </div>
      `
      this.chatBody.appendChild(msgReceived)
      this.lastMsgUser = msgReceived
    }
  }

  createMsgWaning = (msg) => {
    const msgWarning = document.createElement('div')
    msgWarning.classList.add("chat-message", "justify-content-center")
    msgWarning.innerHTML = `
      <p class="badge rounded-pill text-bg-danger chat-text-warning p-3">${msg}</p>
    `
    this.chatBody.appendChild(msgWarning)
    this.lastMsgUser = null
  }

  createPongInvite = () => {
    const msgWarning = document.createElement('div')
    msgWarning.classList.add("chat-message", "justify-content-center")
    msgWarning.innerHTML = `
      <div class="d-flex flex-column align-items-center gap-2 border rounded p-2 bg-secondary">
        <p class="chat-text" style="color: black;">${this.friend_profile.display_name} Invite you to play game.</p>
        <div class="d-flex justify-content-center gap-3">
          <button id="chatPongJoin" class="font-bs-bold fs-lg btn btn-primary m-0">Join</button>
          <button id="chatPongReject" class="font-bs-bold fs-lg btn btn-secondary m-0">Reject</button>
        </div>
      </div>
    `
    this.chatBody.appendChild(msgWarning)
    this.lastMsgUser = null
    document.getElementById("chatPongJoin").addEventListener('click', this.pongJoinInvite)
    document.getElementById("chatPongReject").addEventListener('click', this.pongRejectInvite)
  }

  setInvitePongIcon = () => {
    const invitePontBtn = document.getElementById('chat-invite-pong')
    invitePontBtn.addEventListener('click', () => {
      const msgObj = {
        sender: this.my_profile.id,
        type: "PONT_INVITE",
        message: ""
      }
      this.ws.send(JSON.stringify(msgObj));
    })
  }

  pongJoinInvite = () => {
    console.log('Join Pong invite')
    // TODO: send message to server to join
  }

  pongRejectInvite = () => {
    console.log('Join Reject invite')
    // TODO: send message to server to reject
  }

  setTitleBar = () => {
    this.titleBarName = document.getElementById('chatTitleBarName')    
    this.titleBarName.innerHTML = `
      <p class="d-flex align-items-center">Waiting for friend...</p>
    `
  }

  setEnterKey = () => {
    // Chat input
    chatInput.addEventListener('keypress', this.enterToSendMessage)
  }

  enterToSendMessage = (e) => {
    if (e.key === 'Enter') {
      const msg = this.chatInput.value
      this.sendMessage(msg)
      this.chatInput.value = ''
    }
  }

  createTitleBarName = () => {
    this.titleBarName.innerHTML = `
      <div class="chat-picture me-2">
        <img src="/api/${this.friend_profile.profile}" alt="profile-picture">
      </div>
      <p class="font-bs-bold fs-lg friend-name" data-bs-toggle="modal" data-bs-target="#profileModal" 
        onclick="getProfileById('${this.friend_profile.id}')">
        ${this.friend_profile.display_name}
      </p>
    `
  }

  clear = () => {
    document.removeEventListener('keypress', this.enterToSendMessage)
    this.chatBody.innerHTML = ''
    this.ws.close()
  }
}