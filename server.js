const express = require('express');
const app = express();
require('dotenv').config();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

// Import routers
const clientPageRouter = require('./clientPageRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clientPageRouter);

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

const PORT = process.env.PORT;
http.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));