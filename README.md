# Todos
- Make the site more neater and have a better design
   - Have dark mode
   - Nice animations
   - Mobile responsive
- Add commenting to several parts of the backend and frontend for better explanation

# Full-Stack Chat App
- Registration System
- Login System
- Verification System
- Basic Chatting
- Possible Video Chatting

# API Endpoints
## Users
- POST users/register
   - Register users to the app
- POST users/login
   - Login users to the app
- POST users/password-reset/new-password
   - Generate verification code and cache with userID and new password
   - Send code to user's email
- POST users/password-reset/verification
   - Check user's verification code for password resetting
   - Update user password in database

## Profiles
- POST profiles/create
   - Add profile data of user to database
- POST profiles/updateProfilePicture
   - Store the user's profile picture in the 'profile_pictures' folder
- PUT profiles/update
   - Update profile data of user to database
- GET profiles/users
   - Get list of all usernames
- GET profiles/users/:username
   - Get profile data of a specific user from their username
- GET profiles/me
   - Get profile data of the current user (me)

## Messages
- POST messages/add
   - Insert cached messages of chat to database (Messages table)

# Plan (will remove parts over time)
- User Registration
   - Use Auth0 only after making registry system
- User Login / Authentication
   - Use sessions first and then try using tokens (JWT) for learning only
- User joining chatroom
   - Assign websocket id to user from their userid and cache it on server (i.e. { socketId: xxxx, userid: xxxx })
   - Get username and profile picture from database (based on userid) from GET API
   - Send userid, username and picture to websocket ( in AVAILABLE USERS section ) to show this user is online and cache it on all user's device
   - When user leaves the chatroom - remove from AVAILABLE USERS section and from user's devices
- Messaging
   - User enters message to chatroom (message contains user's message and userid)
   - When received from other users, message should have the message content, profile picture and username
   - Cache each message (message content and userid) on the server
   - In certain intervals, store the all messages in a database
   - User clears all messages from their browser only
- Optional
   - User is not able to open some of the pages unless they are logged in
      - Use the session/token to check if the user is logged in, otherwise redirect them to the login page
   - Users able to send links, docs, images, videos, etc.
   - Users able to show live webcam video with audio (Video Chatting)
   - Activity tracking - users changing their password, sending messages, joining chats, etc. overtime

# Database Schema
- User
   - userID: auto-incremented, primary key, integer
   - username: varchar(50), unique
   - email: varchar(100), unique
   - password: varchar(length), hashed and salted for encryption
   - createdAt: timestamp, auto-added when data is inserted
   - updatedAt: timestamp, auto-added when data is inserted and updates when data is updated
- Profile
   - profileID: auto-incremented, primary key, integer
   - username: foreign key from User table, varchar(50)
   - bio: varchar(200)
   - createdAt: timestamp, auto-added when data is inserted
   - updatedAt: timestamp, auto-added when data is inserted and updates when data is updated
- Messages
   - messageID: auto-incremented, primary key, integer
   - userID: foreign key from User table, integer
   - content: varchar(2000)
   - createdAt: timestamp, auto-added when data is inserted

# Installation and Launching
- Clone this repository
   ```
   git clone https://github.com/rekredhead/Chat-App.git
   ```
- Install all packages for backend using:
   ```
   npm install
   ```
- Install the following softwares on the local device:
   - MySQL
   - Redis
- Setup the client
   - Run the following commands to install nextjs dependencies
      ```
      cd client
      npm install
      ```
   - In next.config.js, use the Domain URL of your server for the SERVER_DOMAIN environment variable
   - In next.config.js, set the protocol, hostname and port of your SERVER DOMAIN
- Create a gmail account to be used for sending emails to users
   - Create a new gmail account or use an unused account
   - Open the main page of the gmail account
   - Go to settings and enable 2-step verification - Done (1/2)
   - Search for 'App Passwords' in the search bar or in the settings tab
   - Select "Mail" from the "Select app" drop down
   - Select the device that you are hosting the app on the next dropdown and click the "Generate" button
   - Copy the app password that was generated and paste it in the .env file as mentioned below - Done (2/2)
- Create a .env file for backend containing the following:
   - Do not add the bracket texts
   ```
   PORT=(number:an-available-port-on-your-device)
   FRONTEND_DOMAIN=(string:domain-of-nextJS-server)
   DB_HOST=(string:mysql-host)
   DB_USER=(string:mysql-user)
   DB_PASSWORD=(string:mysql-password)
   DB_PORT=(number:mysql-port-number)
   MESSAGING_EMAIL=(string:gmail-used-to-send-emails-to-users)
   MESSAGING_EMAIL_PASSWORD=(string:app-password-of-email)
   ```
- Open a separate terminal in your IDE/Code Editor and run this command to start the redis server:
   ```
   npm run startRedis
   ```
   - Modify the "startRedis" and "resolveRedis" scripts in package.json if Redis was installed on a different location
   - Make sure redis is running before you test or start the app
- Here are a list of terminal commands used for both server and client
   - ```npm test``` - run test suites for both server and client
   - ```npm start``` - start the nodejs (backend) and nextjs (frontend) servers concurrently
   - ```npm run dev``` - run the nodejs (backend) and nextjs (frontend) server concurrently in dev mode
   - ```npm run testServer``` - run test suites for the server
   - ```npm run testClient``` - run test suites for the client
   - ```npm run startServer``` - start the nodejs (backend) server only
   - ```npm run startClient``` - start the nextjs (frontend) server only
   - ```npm run devServer``` - run the nodejs (backend) server in dev mode
   - ```npm run devClient``` - run the nextjs (frontend) server in dev mode
   - ```npm run buildClient``` - build the nextjs code for production (run this before npm run startClient OR npm start)