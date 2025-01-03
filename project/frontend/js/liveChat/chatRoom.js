import { getMyProfile, getProfile } from "../services/profileService.js";
import { getTranslateLanguage } from "../i18n.js";

export default class ChatRoom {
  constructor(my_profile, friend_profile, chatBoxModal, sendMessage, sendInvitePong, answerInvitePong) {
    this.chatBody = document.getElementById('chatBody')
    this.chatInput = document.getElementById('chatInput')
    this.my_profile = my_profile
    this.friend_profile = friend_profile
    this.chatBoxModal = chatBoxModal
    this.lastMsgUser = null
    this.titleBarName = null
    this.sendMessage = sendMessage
    this.sendInvitePong = sendInvitePong
    this.answerInvitePong = answerInvitePong

    this.setInvitePongIcon()
    this.createTitleBarName()
    this.setEnterKey()
    this.validatePermissionChat()
  }

  static async create(friend_id, chatBoxModal, sendMessage, sendInvitePong, answerInvitePong) {
    const my_profile = await getMyProfile()
    const friend_profile = await getProfile(friend_id)

    return new ChatRoom(my_profile, friend_profile, chatBoxModal, sendMessage, sendInvitePong, answerInvitePong)
  }

  displayMsgSent = (msg) => {
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

  displayMsgReceive = (msg) => {
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

  displayMsgWaning = (msg) => {
    const msgWarning = document.createElement('div')
    msgWarning.classList.add("chat-message", "justify-content-center")
    msgWarning.innerHTML = `
      <p class="badge rounded-pill text-bg-danger chat-text-warning p-3">${msg}</p>
    `
    this.chatBody.appendChild(msgWarning)
    this.lastMsgUser = null
  }

  displayPongInvite = () => {
    // Delete Old invite Box
    this.removeInviteBox()

    const msgWarning = document.createElement('div')
    msgWarning.setAttribute("id", "chat-invite-pont-msg")
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
    document.getElementById('chat-invite-pong')
      .addEventListener('click', () => this.sendInvitePong(this.friend_profile.id))
  }

  pongJoinInvite = () => {
    this.removeInviteBox()
    this.answerInvitePong('YES')
  }

  pongRejectInvite = () => {
    this.removeInviteBox()
    this.answerInvitePong('No')
  }

  removeInviteBox = () => {
    const inviteBox = this.chatBody.querySelector('#chat-invite-pont-msg')
    if (inviteBox) inviteBox.remove()
  }

  setEnterKey = () => {
    chatInput.addEventListener('keypress', this.enterToSendMessage)
  }

  enterToSendMessage = (e) => {
    if (e.key === 'Enter') {
      const msg = this.chatInput.value
      this.sendMessage(msg)
      this.chatInput.value = ''
      setTimeout(() => {
        this.chatBody.scrollTop = this.chatBody.scrollHeight
      }, 100);
    }
  }

  validatePermissionChat = () => {
    // Not allow input if not friend
    if (this.friend_profile.is_friend !== 'ACCEPT') {
      const language = localStorage.getItem('currentLanguage') || 'en'
      const message = getTranslateLanguage(language, 'chat_permiss')
      this.chatInput.placeholder = message
      this.chatInput.disabled = true
    } else {
      this.chatInput.placeholder = ''
      this.chatInput.disabled = false
    }
  }

  createTitleBarName = () => {
    this.titleBarName = document.getElementById('chatTitleBarName')    
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
    this.chatInput.removeEventListener('keypress', this.enterToSendMessage)
    this.chatBody.innerHTML = ''
    this.chatInput.value = ''
  }
}