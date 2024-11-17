import { WS_TOUR_ROOM } from "../constants.js";
import { CONTAINER } from "../constants.js";

class TourSocket {
  constructor(room, initPlayers, clearPlayer) {
    this.token = localStorage.getItem('token');
    this.my_id = localStorage.getItem('my_id');
    this.room = room
    this.initPlayers = initPlayers
    this.clearPlayer = clearPlayer
    this.users = []

    this.ws = new WebSocket(`${WS_TOUR_ROOM}?token=${this.token}&room_id=${room.id}`) // connect socket
    this.setWebSocketEvent() // setup event on socket
  }

  setWebSocketEvent = () => {
    this.ws.onopen = this.webSocketEventOnOpen;
    this.ws.onclose = this.webSocketEventOnClose;
    this.ws.onmessage = this.webSocketEventOnMessage;
    this.ws.onerror = this.webSocketEventOnError;
  }

  webSocketEventOnOpen = () => {
    console.warn("Tour Socket Connected")
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
        case "TOURNAMENT_INFOMATION":
          this.updateRoom(data.data)
          break;
        // case "LIST_USER_MESSAGE":
        //   this.listReceivedMessage(data.data)
        //   break;
        default:
          break;
      }
    }
  };

  startGame = () => {
    console.log('start tour click')

    const msgObj = {
      type: "CLIENT_MESSAGE",
      command: "START_GAME",
      data: {}
    }
    this.ws.send(JSON.stringify(msgObj));
  }

  updateRoom = (data) => {
    const nameList = data.user.map(u => u.username)
    console.log(nameList)
    this.clearPlayer()
    this.initPlayers(nameList)
  }

  clear = () => {
    this.ws.close()
    this.ws = null
  }
}

export function connectTourSocket(room, initPlayers, clearPlayer) {
  CONTAINER.tourSocket = new TourSocket(room, initPlayers, clearPlayer)
  return CONTAINER.tourSocket
}

export function disconnetTourSocket() {
  if (CONTAINER.tourSocket) {
    CONTAINER.tourSocket.clear()
    CONTAINER.tourSocket = null
  }
}

export function startTour() {
  CONTAINER.tourSocket.startGame()
}