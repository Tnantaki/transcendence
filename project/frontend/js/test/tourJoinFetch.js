import * as constant from "../constants.js";

function joinTourRoom(id) {
  const ws = new WebSocket(constant.WS_TOUR_ROOM + "/" + id)

  // When connect to ws success
  ws.addEventListener('open', () => {
    console.log("connected.")
  })

  // Listen response from server
  ws.addEventListener('message', (event) => {
    // if someone join the room backend will response with array
    // if someone exit from the room backend will response with array
    // if leader of room exit explore the room
    console.log(event.data)
  })

  // For log error
  ws.addEventListener('error', (event) => {
    console.log("Error: ", event);
  })

  // Check if leader of room and there are 4 player. Have permission to start
  // ws.send("start") :TODO wait for backent define protocol.
}