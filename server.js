const { PORT } = require('./config');
const express = require('express');

// Import Routers
const clientPageRouter = require('./routers/clientPage');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Host the routers on the app
app.use(clientPageRouter);

app.listen(PORT, () => console.log(`App available on http://localhost:${PORT}/chat`));

/*
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
*/