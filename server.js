const { PORT, FRONTEND_DOMAIN } = require("./config");
const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('./database/createDB'); // Create database when server is launched

const app = express();

// Setup sessions and cookies middleware
const oneDayInMilliSeconds = 1000 * 60 * 60 * 24;
app.use(session({
   secret: 'randomcharacters',
   resave: false,
   saveUninitialized: true,
   cookie: {
      maxAge: oneDayInMilliSeconds
   }
}));

app.use(express.json()); // Enable app to use JSON data
app.use(express.urlencoded({ extended: true }));

// Enabled CORS to allow access to the frontend domain and allow credentials to pass
app.use(cors({ origin: FRONTEND_DOMAIN, credentials: true }));

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