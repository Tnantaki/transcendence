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
    this.modalWinnerTour = new bootstrap.Modal(document.getElementById('winnerTourModal'));

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
    // console.log("Connected TourSocket")
  };

  webSocketEventOnError = (event) => {
    console.log("Error: ", event);
  };

  webSocketEventOnClose = () => {
    // console.log("Disconnet TourSocket")
  };

  webSocketEventOnMessage = (event) => {
    let data = JSON.parse(event.data);
    if (data.type === 'SERVER_MESSAGE') {
      switch (data.command) {
        case "TOURNAMENT_INFOMATION":
          this.updateRoom(data.data)
          break;
        case "ROUND_START":
          this.roundStart(data.data)
          break;
        // case "INFORM_WINNER": // cancel
        //   this.displayWinnerTour("I'm the winner")
        //   break;
        default:
          break;
      }
    }
  };

  startGame = () => {
    const msgObj = {
      type: "CLIENT_MESSAGE",
      command: "START_GAME",
      data: {}
    }
    this.ws.send(JSON.stringify(msgObj));
  }

  updateRoom = (data) => {
    const nameList = data.user.map(u => u.display_name ? u.display_name : u.username)
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

  displayWinnerTour = (name) => {
    const nameObj = document.getElementById("winnerTourName")
    nameObj.innerHTML = name
    modalWinnerTour.show();
  }

  clear = () => {
    this.ws.close()
    this.ws = null
  }
}

export function connectTourSocket(room, joinWaitingRoom) {
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