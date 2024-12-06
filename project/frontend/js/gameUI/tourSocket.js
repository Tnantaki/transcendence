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
    this.modalInfoTour = new bootstrap.Modal(document.getElementById('infoTour'));

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
  };

  webSocketEventOnError = (event) => {
    console.log("Error: ", event);
  };

  webSocketEventOnClose = () => {
  };

  webSocketEventOnMessage = (event) => {
    let data = JSON.parse(event.data);
    if (data.type === 'SERVER_MESSAGE') {
      switch (data.command) {
        case "TOURNAMENT_INFOMATION":
          console.log(data)
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
    const msgObj = {
      type: "CLIENT_MESSAGE",
      command: "START_GAME",
      data: {}
    }
    this.ws.send(JSON.stringify(msgObj));
    console.log('send start to backend')
  }

  updateRoom = (data) => {
    const users = data.user.sort((a, b) => b.is_owner - a.is_owner);
    const nameList = users.map(u => u.display_name ? u.display_name : u.username)
    this.joinWaitingRoom(this.room.name, nameList)
  }

  roundStart = (data) => {
    let myRoomId = -1
    let myRoom = null
    data.forEach(room => {
      if(!room.player1 || !room.player2) return

      if (this.my_id === room.player1.id || this.my_id === room.player2.id) {
        myRoomId = room.room_id
        myRoom = room
      }
    })
    if (myRoomId > 0) {
      this.infoPlayers(myRoom)
      setTimeout(() => {
        this.modalInfoTour.hide();
        loadPage("/online?room_id=" + myRoomId);
      }, 1500)
    }
  }

  displayWinnerTour = (name) => {
    const nameObj = document.getElementById("winnerTourName")
    nameObj.innerHTML = name
    modalWinnerTour.show();
  }

  infoPlayers = ({player1, player2}) => {
    const infoTourObj = document.getElementById('infoTour')
    const p1 = infoTourObj.querySelector('#player1')
    const p2 = infoTourObj.querySelector('#player2')

    p1.innerHTML = player1.display_name ? player1.display_name : player1.username
    p2.innerHTML = player2.display_name ? player2.display_name : player2.username

    this.modalInfoTour.show();
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