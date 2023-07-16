# Todos
- Include testing in the program as well
- Make the site more neater and have a better design
   - Have dark mode
   - Nice animations
   - Mobile responsive
- Make different features from different git branches

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
- POST users/password-reset
   - Alter users passwords

## Profiles
- POST profiles/create
   - Add profile data of user to database
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
   - Redirect user to login page
   - Use Auth0 only after making registry system
- User Login / Authentication
   - Use sessions first and then try using tokens (JWT) for learning only
- Password reset
   - User enters their new password twice to the page
   - Server sends a random-generated code to the user's email
   - Server caches the userId and verification code and will remove it after 5 minutes
   - Send response to user to inform them about the email and show a countdown of 5 minutes on the page
   - User enters the verification code to page
   - Send code to server using POST API
   - Server checks if userId is cached within the server
      - If yes, server checks if verification code matches the one in the server
         - If yes, update the password of the user from the User table
         - If no, inform the user that the verification code is invalid
      - If no, inform user that the verification code has expired
- User profile
   - Send profile data (if available) of user from database to profile page using GET API
   - Users enters (optional) profile data to profile page
   - Add profile data to database (based on userid) from a POST API
   - Update profile data to database (based on userid) from a PUT API
   - Allow image (profile picture) uploading - store images on server
   - Use a GET API to make the profile data public
   - Send OK message to user
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
   - id: auto-incremented, primary key, integer
   - username: varchar(50), unique
   - email: varchar(100), unique
   - password: varchar(length), hashed and salted for encryption
   - createdAt: timestamp
   - updatedAt: timestamp
- Profile
   - id: auto-incremented, primary key, integer
   - userId: foreign key from User table, integer
      - username: use data from User table
   - profilePictureLocation: location of profile picture file on server, varchar(100)
   - bio: varchar(200)
   - createdAt: Timestamp
   - updatedAt: Timestamp
- Messages
   - id: auto-incremented, primary key, integer
   - userId: foreign key from User table, integer
   - content: varchar(2000)
   - createdAt: timestamp

# Installation
- Clone this repository
   ```
   git clone https://github.com/rekredhead/Chat-App.git
   ```
- Install all packages using:
   ```
   npm install
   ```
- Install the following softwares:
   - MySQL
   - Redis
- Create a .env file containing the following:
   - Do not add the bracket texts
   ```
   PORT=(number:an-available-port-on-your-device)
   DB_HOST=(string:mysql-host)
   DB_USER=(string:mysql-user)
   DB_PASSWORD=(string:mysql-password)
   DB_PORT=(number:mysql-port-number)
   ```
- Run this command to test the program:
   ```
   npm test
   ```
- Run the 1st command to run in dev mode. Run 2nd command to start the app:
   ```
   npm run dev
   ```
   ```
   npm start
   ```