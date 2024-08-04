let gameEndpoint = "ws://localhost:8132/ws/pong/";
let webSocketURL = "";
let webSocketToken = "2JG1Nb2VCX5BqfOXSL50YFZxDJ7EhQgTnRRv9ls1uwp4t1sKQ5C_Jo3hqnktKt0l";
let roomID = "35";

function connect_socket() {
    webSocketObject = new WebSocket(gameEndpoint + "?token="+ webSocketToken + "&" + "room_id="+ roomID);
    webSocketObject.onopen = function (event) {
        console.log("Connected to server");
    };
    webSocketObject.onmessage = function (event) {
        let data = JSON.parse(event.data);
        console.log(data);
    };
    webSocketObject.onclose = function (event) {
        console.log("Connection closed");
        event.preventDefault();
    };
    webSocketObject.onerror = function (event) {
        console.log("Error: ", event);
    };
}
connect_socket();
