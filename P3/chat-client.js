//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const msg_nick = document.getElementById("msg_nick");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

//-- Cargar sonido para cuando se reciba un mensaje
let tono = new Audio('tonomensaje.mp3');

//Creamos variable para el nick 
let nickname = 'Anónimo';

//-- Variable que muestra si se escribe
let escribiendo = false;

socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:black">' + msg + '</p>';
  if(!msg.includes('esta escribiendo...')){
    tono.play();
  }
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value){
    socket.send(nickname + ': ' + msg_entry.value);
    escribiendo = false;
  }
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}

//-- Al estar escribiendo se les manda un mensaje a los usuarios
msg_entry.oninput = () => {
  //-- Si esta escribiendo
  if(!escribiendo){
    escribiendo = true;
    socket.send('El usuario ' + nickname + ' esta escribiendo...');
  };
};

console.log(nickname)

msg_nick.onchange = () => {
  if (msg_nick.value){
    nick = msg_nick.value;
  }
  console.log(nickname);
};