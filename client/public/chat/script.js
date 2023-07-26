// This is the script tag used to enable the websocket of the vanilla html page
// <script src="https://cdn.socket.io/socket.io-3.0.0.js"></script>

const socketURL = `ws${window.location.origin.substring(4)}`;
const socket = io(socketURL);

const textBody = document.querySelector('.text-body');
const submit = document.getElementById('submit');
const clear = document.getElementById('clear');
const input = document.getElementById('message-input');

// Render messages on page if any message is added in the socket connection
socket.on('message', data => {
   const { id, text } = JSON.parse(data);

   if (id === localStorage.getItem('id')) {
      textBody.innerHTML += `<div class="message user">${text}</div>`;
   } else {
      textBody.innerHTML += `<div class="message other">${text}</div>`;
   }
   textBody.scrollTop = textBody.scrollHeight; // Scroll down as messages appear
});

// Cache the user's websocket id
socket.on('id', (id) => {
   localStorage.setItem('id', id);
});

// Render notifications on page if any notification is added in the socket connection
socket.on('notification', (id) => {
   if (id === localStorage.getItem('id')) {
      textBody.innerHTML += '<div class="message notification">You joined this chat</div>';
   } else {
      textBody.innerHTML += `<div class="message notification">${id} joined this chat</div>`;
   }
});

const sendMessage = () => {
   const value = input.value.trim();
   if (value === "") return; // Don't send message if empty

   socket.emit('message', value);
   input.value = ''; // Clear input box
}

const clearMessage = () => {
   if (!confirm("Are you sure you want to clear all messages")) return;
   textBody.innerHTML = '';
}

input.addEventListener('keypress', (e) => {
   if (e.key === 'Enter') sendMessage();
});
submit.addEventListener('click', sendMessage);
clear.addEventListener('click', clearMessage);