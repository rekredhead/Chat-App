# Todos
- Make a small video streaming/chat/viewing program to understand how it works before deciding project plan
- Plan how the development will proceed forward with all the other features
- Create figma designs or wireframes of all pages before codingz
- Make the site more neater and have a better design
- Make different features from different git branches

# Requirements
- Users able to register to create an account (from gmail only)
   - Use Auth0 only after making registry system
   - Data: username, email address, password
- Users can optionally make a profile
   - Data: username, profile picture, bio
- Users able to login with their account profile
   - Data: email address and password
- Users able to join the chatroom
- Users able to send and receive messages from the chatroom
- Users able to clear the chat completely from their browser
- Users able to see previous chats (view full chat history)
- Users able to see active chat users
- Users abel to update their profiles
- Users able to delete their accounts
- Users able to send links, docs, images, videos, etc.
- Users able to show live webcam video with audio (Video Chatting)

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