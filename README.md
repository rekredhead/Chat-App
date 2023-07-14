# Todos
- Make a small video streaming/chat/viewing program to understand how it works before deciding project plan
- Watch more about systems design
- Plan how the development will proceed forward with all the other features
- Include testing in the program as well
- Create figma designs or wireframes of all pages before codingz
- Make the site more neater and have a better design
- Make different features from different git branches

# Requirements
- User Registration
   - Users enters sign-in data to registration page
      ```
      {
         username
         email_address
         password
      }
      ```
   - Add sign-in data to database from a POST API
   - Redirect user to login page
   - Use Auth0 only after making registry system
- User Login / Authentication
   - Users enter login data to login page
      ```
      {
         username
         password
      }
      ```
   - Check if login data matches data from database using POST API
      - Check if username matches any username from database
         - If yes, check if password matches the user's saved password
            - If yes, send a session/token (containing the userId) to the user
            - If no, send error message to user saying 'password is invalid'
         - If no, send error message to user saying 'username is invalid'
   - Redirect user to chatroom
   - Use sessions first and then try using tokens (JWT) for learning only
- Password reset
   - User sees page with their username and email address ( disable text boxes )
      - Fetch these data from the database using the userId from the user's session/token from a GET API
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
- Account deletion
   - Users enter login data to account deletion page
   - Check if login data matches data from database using DELETE API
   - Remove the user from the database
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

# Data (from ChatGPT)
User:
   id: auto-incremented, primary key, integer
   username: varchar(50), unique
   email: varchar(100), unique
   password: varchar(length), hashed and salted for encryption
   createdAt: timestamp
   updatedAt: timestamp

Profile:
   id: auto-incremented, primary key, integer
   userId: foreign key from User table, integer
      username: use data from User table
   profilePictureLocation: location of profile picture file on server, varchar(100)
   bio: varchar(200)
   createdAt: Timestamp
   updatedAt: Timestamp

Messages:
   id: auto-incremented, primary key, integer
   userId: foreign key from User table, integer
   content: varchar(2000)
   createdAt: timestamp

# Full-Stack Chat App
- Registration System
- Login System
- Authentication System
- Basic Chatting
- Possible Video Chatting

# Installation
- Clone this repository
   ```
   git clone https://github.com/rekredhead/Chat-App.git
   ```
- Install all packages using:
   ```
   npm install
   ```
- Create a .env file containing the following:
   - Do not add the bracket texts
   ```
   PORT=(number:an-available-port-on-your-device)
   ```
- Run the 1st command to run in dev mode. Run 2nd command to start the app:
   ```
   npm run dev
   ```
   ```
   npm start
   ```