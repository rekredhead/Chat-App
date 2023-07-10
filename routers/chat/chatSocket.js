const { Server } = require('socket.io');

module.exports = (server) => {
   const io = new Server(server, {
      cors: { origin: "*" }
   });

   // The code handles all websocket interactions 
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
}