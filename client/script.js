console.log(window.location.origin);
/*
const socket = io('ws://localhost:8080');

const textBody = document.querySelector('.text-body');
const submit = document.getElementById('submit');
const clear = document.getElementById('clear');
const input = document.getElementById('message-input');

socket.on('message', data => {
   const { id, text } = JSON.parse(data);

   if (id === localStorage.getItem('id')) {
      textBody.innerHTML += `<div class="message user">${text}</div>`;
   } else {
      textBody.innerHTML += `<div class="message other">${text}</div>`;
   }
   textBody.scrollTop = textBody.scrollHeight; // Scroll down as messages appear
});

socket.on('id', (id) => {
   localStorage.setItem('id', id);
});

socket.on('notification', (id) => {
   if (id === localStorage.getItem('id')) {
      textBody.innerHTML += '<div class="message notification">You joined this chat</div>';
   } else {
      textBody.innerHTML += `<div class="message notification">${id} joined this chat</div>`;
   }
});

const sendMessage = () => {
   const value = input.value;
   if (value.trim() === "") return;

   socket.emit('message', value);
   input.value = '';
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
*/