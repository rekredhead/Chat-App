const http = require('http').createServer();
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

http.listen(8080, () => console.log('Listening on http://localhost:8080'));