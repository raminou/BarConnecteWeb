const express = require('express');
const drink = require('./routes/drink');
const recipe = require('./routes/recipe');
const app = express();
const bodyParser  = require('body-parser');
const WebSocket = require('ws');

require('dotenv').config();

// HTTP
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/drink', drink.router);
app.use('/recipe', recipe);

app.listen(process.env.PORT_HTTP, function () {
    console.log(`Listen HTTP on port ${process.env.PORT_HTTP}!`);
});

// WebSockets
const wss = new WebSocket.Server({ port: process.env.PORT_WS });
console.log(`Listen WS on port ${process.env.PORT_WS}!`)

wss.on('connection', function connection(ws) {
    ws.on('message', (message) => {
        drink.linkToDrink(message, ws);
    });
});

