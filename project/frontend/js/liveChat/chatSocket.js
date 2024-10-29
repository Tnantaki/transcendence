import { WS_CHAT_ROOM } from "../constants.js";
import ChatRoom from "./chatRoom.js";
let chatSocket = null

class ChatSocket {
  constructor() {
    this.token = localStorage.getItem('token');
    this.my_id = localStorage.getItem('my_id');
    this.chatBoxModal = document.getElementById('chatBoxModal')
    this.chatBox = new bootstrap.Modal(chatBoxModal);
    this.friendIdTarget = ''
    this.chatRoom = null

    this.ws = new WebSocket(`${WS_CHAT_ROOM}?token=${this.token}&userId=${this.my_id}`)
    this.setWebSocketEvent()
    this.setUpChatBox()
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

  webSocketEventOnOpen = () => {
    console.log("ChatSocket Connected")
  };

  webSocketEventOnError = (event) => {
    console.log("Error: ", event);
  };

  webSocketEventOnClose = () => {
    console.log("Disconnet from ChatSocket")
  };

  // TODO: Waiting for backend change protocol
  webSocketEventOnMessage = (event) => {
    let data = JSON.parse(event.data);
    if (data.type === 'SERVER_MESSAGE') {
      switch (data.command) {
        case "LIST_MESSAGE_BOX":
          this.listNoficationMessage(data)
          break;
        case "LIST_USER_MESSAGE":
          this.listReceivedMessage(data)
          break;
        // case "PONT_INVITE":
        //   if (data.sender !== this.my_profile.id)
        //     this.displayPongInvite()
        //   break;
        // case "CHAT_START":
        //   this.createTitleBarName()
        //   this.setEnterKey()
          break;
        default:
          break;
      }
    }
  };

  requestChatList = () => {
    const msgObj = {
      userId: this.my_id,
      type: "CLIENT_MESSAGE",
      command: "REQUEST_CHAT_LIST",
      data: {}
    }
    this.ws.send(JSON.stringify(msgObj));
  }

  openChat = async (friendId) => {
    // Popup Chat box
    this.chatRoom = await ChatRoom.create(friendId, this.chatBoxModal, this.sendMessage)
    this.chatBox.show()

    this.friendIdTarget = friendId // set friendIdTarget

    const msgObj = {
      userId: this.my_id,
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

  invitePongGame = (friendId) => {
    const msgObj = {
      userId: this.my_id,
      type: "CLIENT_MESSAGE",
      command: "INVITE_PLAY_VERSUS",
      data: {
        user_id: friendId
      }
    }
    this.ws.send(JSON.stringify(msgObj));
  }

  answerInvitePongGame = (answer) => {
    const msgObj = {
      userId: this.my_id,
      type: "CLIENT_MESSAGE",
      command: "ANSWER_INVITE",
      data: { answer }
    }
    this.ws.send(JSON.stringify(msgObj));
  }

  sendMessage = (msg) => {
    const msgObj = {
      userId: this.my_id,
      type: "CLIENT_MESSAGE",
      command: "SENT_MESSAGE",
      data: {
        user_id: this.friendIdTarget,
        message: msg
      }
    }
    this.ws.send(JSON.stringify(msgObj));

    this.chatRoom.displayMsgSent(msg) // TODO: should be receive from server
  };

  listNoficationMessage = (data) => {
    localStorage.setItem('Messages', data.length)
    if (data.length > 0)
      checkNofiMsg()
    console.log('Not do yet')
  }

  listReceivedMessage = (data) => {
    data.forEach(item => {
      this.chatRoom.displayMsgReceive(item.message)
    })
  }

  handleChatBoxFocusInput = () => {
    document.getElementById('chatInput').focus()
  }

  handleChatBoxCloseChat = () => {
    this.closeChat()
  }


  clear = () => {
    this.chatBoxModal.removeEventListener('shown.bs.modal', this.handleChatBoxFocusInput)
    this.chatBoxModal.removeEventListener('hidden.bs.modal', this.handleChatBoxCloseChat)
    this.ws.close()
    this.ws = null
    console.log('Disconnect Socket')
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
