const electron = require('electron');

console.log("Hola desde el proceso de la web index.js!!");

//-- Obtener elementos de la interfaz
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");
const version_node = document.getElementById("version_node");
const version_electron = document.getElementById("version_electron");
const version_chrome = document.getElementById("version_chrome");
const arquitectura = document.getElementById("arquitectura");
const plataforma = document.getElementById("plataforma");
const directorio = document.getElementById("directorio");
const ip_address = document.getElementById("ip_address");
const users = document.getElementById("users");

//------ Mensajes recibidos del proceso MAIN ------

//-- Información del sistema
electron.ipcRenderer.on('information', (event, message) => {
    console.log("Recibido: " + message);

    //-- Extraemos cada dato
    version_node.textContent = message[0];
    version_chrome.textContent = message[1];
    version_electron.textContent = message[2];
    arquitectura.textContent = message[3];
    plataforma.textContent = message[4];
    directorio.textContent = message[5]
    ip = message[6];
    port = message[7];
    chat = message[8]
    url = ("http://" + ip + ":" + port + "/" + chat);
    ip_address.textContent = url;

});

//-- Numero de usuarios
electron.ipcRenderer.on('users', (event, message) => {
    console.log("Recibido: " + message);
    users.textContent = message;
});

//-- Mensajes de los clientes
electron.ipcRenderer.on('msg_client', (event, message) => {
    console.log("Recibido: " + message);
    display.innerHTML += message + "<br>";
});

//------ Mensajes enviados al proceso MAIN ------
btn_test.onclick = () => {
    display.innerHTML += "Holiii!!! <br>";
    console.log("Botón apretado!");

    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA: Boton apretado");
};