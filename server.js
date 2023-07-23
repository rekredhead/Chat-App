const { PORT } = require("./config");
const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('./database/createDB'); // Create database when server is launched

const app = express();

// Setup sessions middleware
app.use(session({
   secret: 'randomcharacters',
   resave: false,
   saveUninitialized: true,
   cookie: {
      expires: false
   }
}));

app.use(express.json()); // Enable app to use JSON data
app.use(express.urlencoded({ extended: true }));
app.use('*', cors());

// Import Routers
const chatRouter = require('./routers/chat/chatPage');
const loginRouter = require('./routers/login');
const passwordResetRouter = require('./routers/passwordReset');
const profileRouter = require('./routers/profile');
const registrationRouter = require('./routers/registration');

// Enable the routers on the app
app.use(chatRouter);
app.use(loginRouter);
app.use(passwordResetRouter);
app.use(profileRouter);
app.use(registrationRouter);

// Listen to requests from users
const server = app.listen(PORT, () => console.log(`Available on PORT ${PORT}`));

// Enable websocket connection for the app
const chatSocket = require('./routers/chat/chatSocket');
chatSocket(server);