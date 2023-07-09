const { PORT } = require('./config');
const express = require('express');

// Enable the websocket using an HTTP server
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {
    const id = socket.id;
    console.log(`${id} connected`);

    socket.emit('id', id); // Send the id to the connected user

    // Broadcast notifications when users get connected
    io.emit('notification', id);

    // Broadcast messages to all users
    socket.on('message', (message) => {
        const data = {
            id,
            text: message
        }
        io.emit('message', JSON.stringify(data));
    });
});

// Import Routers
const clientPageRouter = require('./routers/clientPage');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Host the routers on the app
app.use(clientPageRouter);

// I tried to use app.listen but that wouldn't work yet
// Try to use the http server only for clientPageRouter
http.listen(PORT, () => console.log(`App available on http://localhost:${PORT}/chat`));