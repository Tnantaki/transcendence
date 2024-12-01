import { WS_TOUR_ROOM } from "../constants.js";
import { CONTAINER } from "../constants.js";
import { loadPage } from "../router.js";

class TourSocket {
  constructor(room, joinWaitingRoom) {
    this.token = localStorage.getItem('token');
    this.my_id = localStorage.getItem('my_id');
    this.room = room
    this.joinWaitingRoom = joinWaitingRoom
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
    console.warn("Disconnet from TourSocket")
  };

  webSocketEventOnMessage = (event) => {
    let data = JSON.parse(event.data);
    console.log('got message from server', data)
    if (data.type === 'SERVER_MESSAGE') {
      switch (data.command) {
        case "TOURNAMENT_INFOMATION":
          this.updateRoom(data.data)
          break;
        case "ROUND_START":
          this.roundStart(data.data)
          break;
        default:
          break;
      }
    }
  };

  startGame = () => {
    console.log('tour game started') // debug
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
    this.joinWaitingRoom(this.room.name, nameList)
  }

  roundStart = (data) => {
    let myRoomId = -1
    data.forEach(room => {
      if (this.my_id === room.player1.id || this.my_id === room.player2.id) {
        myRoomId = room.room_id
      }
    })
    if (myRoomId > 0) {
      loadPage("/online?room_id=" + myRoomId);
    }
  }

  clear = () => {
    this.ws.close()
    this.ws = null
  }
}

export function connectTourSocket(room, joinWaitingRoom) {
  console.log("connect to tour socket");
  CONTAINER.tourSocket = new TourSocket(room, joinWaitingRoom)
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