//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const msg_nick = document.getElementById("msg_nick");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

//-- Cargar sonido para cuando se reciba un mensaje
let tono = new Audio('tonomensaje.mp3');

//Creamos variable para el nick 
let nickname = 'Desconocido';

socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:blue">' + msg + '</p>';
  tono.play();
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value){
    socket.send(nickname + ': ' + msg_entry.value);
  }
  //-- Borrar el mensaje actual
  msg_entry.value = "";
};

msg_nick.onchange = () => {
  if (msg_nick.value){
    nickname = msg_nick.value;
  }
};