const { PORT } = require("./config");
const express = require('express');

const app = express();

app.use(express.json()); // Enable app to use JSON data
app.use(express.urlencoded({ extended: true }));

// Import Routers
const clientPageRouter = require('./routers/chat/chatPage');

// Host the routers on the app
app.use(clientPageRouter);

// Listen to requests from users
const server = app.listen(PORT, () => console.log(`App available on http://localhost:${PORT}/chat`));

// Enable websocket connection for the app
const chatSocket = require('./routers/chat/chatSocket');
chatSocket(server);