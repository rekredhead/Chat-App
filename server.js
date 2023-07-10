const { PORT } = require("./server/config");
const express = require('express');

const app = express();

app.use(express.json()); // Enable app to use JSON data
app.use(express.urlencoded({ extended: true }));

// Import Routers
const clientPageRouter = require('./routers/clientPage');

// Host the routers on the app
app.use(clientPageRouter);

const server = app.listen(PORT, () => console.log(`App available on http://localhost:${PORT}/chat`));

const chatSocket = require('./routers/chatSocket');
chatSocket(server);