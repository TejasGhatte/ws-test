import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({port:8080});

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
    console.log("Connection established")
    ws.on('error', console.error);

    ws.on('message', function message(data: any) {
        const message = JSON.parse(data);

        if (message.type == "identify-as-sender") {
            senderSocket = ws;
        } else if (message.type == "identify-as-receiver") {
            receiverSocket = ws;
        } else if (message.type == "create-offer") {
            if(ws!==senderSocket){
                return;
            }
            receiverSocket?.send(JSON.stringify({ type: "offer", offer: message.offer }))
        } else if (message.type == "create-answer") {
            if(ws!==receiverSocket){
                return;
            }
            senderSocket?.send(JSON.stringify({ type: "answer", answer: message.answer }))
        }

    });

    ws.send('something');
});