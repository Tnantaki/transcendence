import { WS_CHAT_ROOM } from "../constants.js";
import ChatRoom from "./chatRoom.js";
let chatSocket = null

class ChatSocket {
  constructor() {
    this.token = localStorage.getItem('token');
    this.my_id = localStorage.getItem('my_id');
    this.chatBoxModal = document.getElementById('chatBoxModal')
    this.chatBox = new bootstrap.Modal(chatBoxModal);
    this.notiMsgModal = document.getElementById('notiMsgModal')
    this.notiMsg = new bootstrap.Modal(this.notiMsgModal);
    this.friendIdTarget = ''
    this.chatRoom = null

    this.ws = new WebSocket(`${WS_CHAT_ROOM}?token=${this.token}`) // connect socket
    this.setWebSocketEvent() // setup event on socket
    this.setUpChatBox() // set chat input on popup chat to focus when open chat
    this.setUpNotiMsg() // set popup noti request notification message when popup
  }

  setWebSocketEvent = () => {
    this.ws.onopen = this.webSocketEventOnOpen;
    this.ws.onclose = this.webSocketEventOnClose;
    this.ws.onmessage = this.webSocketEventOnMessage;
    this.ws.onerror = this.webSocketEventOnError;
  }

  setUpChatBox = () => {
    this.chatBoxModal.addEventListener('shown.bs.modal', this.handleChatBoxFocusInput)
    this.chatBoxModal.addEventListener('hidden.bs.modal', this.handleChatBoxCloseChat)
  }

  setUpNotiMsg = () => {
    this.notiMsgModal.addEventListener('shown.bs.modal', this.handleNotiMsg)
  }

  webSocketEventOnOpen = () => {
    console.warn("ChatSocket Connected")
  };

  webSocketEventOnError = (event) => {
    console.warn("Error: ", event);
  };

  webSocketEventOnClose = () => {
    console.warn("Disconnet from ChatSocket")
  };

  // TODO: Waiting for backend change protocol
  webSocketEventOnMessage = (event) => {
    let data = JSON.parse(event.data);
    console.log('got message from server', data)
    if (data.type === 'SERVER_MESSAGE') {
      switch (data.command) {
        case "LIST_MESSAGE_BOX":
          this.displayMsgBox(data.data)
          break;
        case "LIST_USER_MESSAGE":
          this.listReceivedMessage(data.data)
          break;
        case "NEW_MESSAGE":
          console.log('receive new message')
          this.receivedMessage(data.data)
          break;
        // case "PONT_INVITE":
        //   if (data.sender !== this.my_profile.id)
        //     this.displayPongInvite()
        //   break;
        default:
          break;
      }
    }
  };

  requestChatList = () => {
    const msgObj = {
      type: "CLIENT_MESSAGE",
      command: "REQUEST_CHAT_LIST",
      data: {}
    }
    this.ws.send(JSON.stringify(msgObj));
  }

  openChat = async (friendId) => {
    // Popup Chat box
    this.chatRoom = await ChatRoom.create(friendId, this.chatBoxModal, this.sendMessage, this.sendInvitePong, this.answerInvitePong)
    this.chatBox.show()

    this.friendIdTarget = friendId // set friendIdTarget

    const msgObj = {
      type: "CLIENT_MESSAGE",
      command: "OPEN_CHAT",
      data: {
        user_id: friendId
      }
    }
    this.ws.send(JSON.stringify(msgObj));
  }

  closeChat = () => {
    this.chatRoom.clear()
    this.chatRoom = null
  }

  sendInvitePong = (friendId) => {
    console.log('send invite')
    const msgObj = {
      type: "CLIENT_MESSAGE",
      command: "INVITE_PLAY_VERSUS",
      data: {
        user_id: friendId
      }
    }
    this.ws.send(JSON.stringify(msgObj));
  }

  answerInvitePong = (answer) => {
    const msgObj = {
      type: "CLIENT_MESSAGE",
      command: "ANSWER_INVITE",
      data: { answer }
    }
    this.ws.send(JSON.stringify(msgObj));
  }

  sendMessage = (msg) => {
    const msgObj = {
      type: "CLIENT_MESSAGE",
      command: "SENT_MESSAGE",
      data: {
        recipient: this.friendIdTarget,
        message: msg
      }
    }
    this.ws.send(JSON.stringify(msgObj));
  };

  receivedMessage = (data) => {
    if (this.chatRoom) {
      if (data.sender === this.my_id) {
        this.chatRoom.displayMsgSent(data.message)
      } else {
        this.chatRoom.displayMsgReceive(data.message)
      }
    } else {
      this.requestChatList()
    }
  }

  listReceivedMessage = (data) => {
    data.forEach(item => {
      if (item.sender.id === this.my_id) {
        this.chatRoom.displayMsgSent(item.message)
      } else {
        this.chatRoom.displayMsgReceive(item.message)
      }
    })
  }

  displayMsgBox(msgBox) {
    console.log('msgBox', msgBox)
    const notiMsgList = document.getElementById("notiMsgList");
    // to reset noti message
    notiMsgList.innerHTML = ''

    msgBox.forEach(msg => {
      const item = document.createElement("li");
      item.classList.add("noti-list-item", "w-100");
      item.innerHTML = `
          <div class="d-flex align-items-center">
            <div class="noti-item-picture">
              <img alt="profile-picture" src="api/${msg.user[0].profile}">
            </div>
            <div class="d-flex flex-column">
              <p class="font-bs fs-lg" style="color: #A2B1B5;">${msg.user[0].username}</p>
            </div>
          </div>
          <div class="d-flex justify-content-end me-3 align-items-center">
            <img id="notiMsgBtn" class="icon-menu ic-lg btn-hover"
              src="../static/svg/chat.svg" alt="chat button" onclick="openChat('${msg.user[0].id}')" data-bs-dismiss="modal">
          </div>
        `
      notiMsgList.appendChild(item);
    })
  }

  handleChatBoxFocusInput = () => {
    document.getElementById('chatInput').focus()
  }

  handleChatBoxCloseChat = () => {
    this.closeChat()
  }

  handleNotiMsg = () => {
    this.requestChatList()
  }

  clear = () => {
    this.chatBoxModal.removeEventListener('shown.bs.modal', this.handleChatBoxFocusInput)
    this.chatBoxModal.removeEventListener('hidden.bs.modal', this.handleChatBoxCloseChat)
    this.notiMsgModal.removeEventListener('shown.bs.modal', this.handleNotiMsg)
    this.ws.close()
    this.ws = null
  }
}

export function connectWebSocket() {
  if (!chatSocket) {
    chatSocket = new ChatSocket()
  }
}

export function disconnetWebSocket() {
  chatSocket.clear()
  chatSocket = null
}

export function checkNofiMsg() {
  const notiMsgBtn = document.getElementById("notiMsgBtn");
  if (!notiMsgBtn) return
  notiMsgBtn.src = "../../static/svg/noti-msg-have.svg"
}

window.openChat = openChat;

function openChat(friendId) {
  chatSocket.openChat(friendId)
}
