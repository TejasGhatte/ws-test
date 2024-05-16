"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on('connection', function connection(ws) {
    console.log("Connection established");
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        if (message.type == "identify-as-sender") {
            senderSocket = ws;
        }
        else if (message.type == "identify-as-receiver") {
            receiverSocket = ws;
        }
        else if (message.type == "create-offer") {
            if (ws !== senderSocket) {
                return;
            }
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "offer", offer: message.offer }));
        }
        else if (message.type == "create-answer") {
            if (ws !== receiverSocket) {
                return;
            }
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "answer", answer: message.answer }));
        }
    });
    ws.send('something');
});
