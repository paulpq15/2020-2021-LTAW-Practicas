//-- Cargamos las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const electron = require('electron');
const ip = require('ip');
const process = require('process');

//-- Definimos el puerto que se usará en el chat
const PORT = 9000;

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;

//-- Creamos una nueva aplicacion web
const app = express();

//-- Creamos un servidor, asociado a la App de express
const server = http.Server(app);

//-- Creamos el servidor de websockets, asociado al servidor http
const io = socket(server);

//-- Obtenemos la fecha actual
const tiempo = Date.now();
const fecha = new Date(tiempo);

//-------- VARIABLES
//-- Definimos la variable de numero de usuarios conectados
let users_count = 0;

//-------- MENSAJES DEL SERVER
//-- Para el recurso '/help'
let help_message = ("Comandos del servidor:<br>" +
                "/help: Devuelve una lista con todos los comandos soportados<br>" +
                "/list: Devuelve el número de usuarios conectados<br>" +
                "/hello: Devuelve el saludo del servidor<br>" +
                "/date: Devuelve la fecha<br>");
//-- Para el recurso '/list'
let list_message = ("Número de usuarios conectados: ");

//-- Para el recurso '/hello'
let hello_message = ("¡HOLA!!! Te has unido a un chat");

//-- Para el recurso '/date'
let date_message = ("Fecha: <b>" + fecha.toUTCString()+ "</b>");
                    
//-- Para un recurso distinto
let error_message = ("Comando no reconocido, vuelve a intentarlo");

//-- Mensaje de Bienvenida
let welc_message = ("¡Bienvenido al chat!");

//-- Mensaje de nueva conexión
let conec_message = ("¡Nuevo usuario conectado!");

//-- Mensaje fin conexión
let disc_message = ("Un usuario ha abandonado el chat");

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  
    console.log('** NUEVA CONEXIÓN **'.yellow);
    //-- Incrementamos el numero de usuarios conectados
    users_count += 1;

    //-- Enviar numero de usuarios al renderer
    win.webContents.send('users', users_count);

    //-- Enviar mensaje de bienvenida al usuario
    socket.send(welc_message);

    //-- Enviar mensaje de nuevo usuario a todos los usuarios
    io.send(conec_message);

    //-- Enviar al render mensaje de conexion
    win.webContents.send('msg_client', conec_message);
  
    //-- Evento de desconexión
    socket.on('disconnect', function(){
      console.log('** CONEXIÓN TERMINADA **'.yellow);
      //-- Decrementamos el numero de usuarios conectados
      users_count -= 1;

      //-- Enviar numero de usuarios al renderer
      win.webContents.send('users', users_count);

      //-- Enviar mensaje de nuevo usuario a todos los usuarios
      io.send(disc_message);

      //-- Enviar al render mensaje de desconexion
      win.webContents.send('msg_client', disc_message);

    });  
  
    //-- Mensaje recibido: Hacer eco
    socket.on("message", (msg)=> {
      console.log("Mensaje Recibido!: " + msg.blue);
      if (msg.startsWith('/')){
        if (msg == '/help'){
            console.log("Muestra una lista con todos los comandos soportados");
            msg = help_message;
            socket.send(msg);
        }else if (msg == '/list'){
            console.log("Devuelve el número de usuarios conectados");
            msg = list_message + users_count;
            socket.send(msg);
        }else if (msg == '/hello'){
            console.log("El servidor devuelve el saludo");
            msg = hello_message;
            socket.send(msg);
        } else if(msg == '/date'){
            console.log("Devuelve la fecha");
            msg = date_message;
            socket.send(msg);
        }else{
            console.log("Comando no reconocido");
            msg = error_message;
            socket.send(msg);
        }
      }else {
        //-- Hacer eco
        io.send(msg);
      }

    });
  
});

//-- Lanzar el servidor HTTP
server.listen(PORT);
console.log("Escuchando en puerto: " + PORT);

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
  console.log("Evento Ready!");

  //-- Crear la ventana principal de nuestra aplicación
  win = new electron.BrowserWindow({
      width: 600,   //-- Anchura 
      height: 600,  //-- Altura

      //-- Permitir que la ventana tenga ACCESO AL SISTEMA
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
  });

  //-- En la parte superior se nos ha creado el menu
  //-- por defecto
  //-- Si lo queremos quitar, hay que añadir esta línea
  //win.setMenuBarVisibility(false)
  
  //-- Cargar interfaz gráfica en HTML
  let interfaz_grafica = "index.html"
  win.loadFile(interfaz_grafica);

  //-- Obtener elementos de la interfaz
  version_node = process.versions.node;
  version_electron = process.versions.electron;
  version_chrome = process.versions.chrome;
  arquitectura = process.arch;
  plataforma = process.platform;
  directorio = process.cwd();
  ip_address = ip.address();
  chat = "chat.html";

   //-- Reagrupar los datos a enviar
  let data = [version_node, version_electron, version_chrome, arquitectura, plataforma, directorio, ip_address, PUERTO, chat];

  //-- Esperar a que la página se cargue y se muestre
  //-- y luego enviar el mensaje al proceso de renderizado para que 
  //-- lo saque por la interfaz gráfica
  win.on('ready-to-show', () => {
    win.webContents.send('information', data);
  });

});

//----- Mensajes recibidos del renderizado --------

//-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
//-- renderizado. Al recibirlos se escribe una cadena en la consola
electron.ipcMain.handle('test', (event, msg) => {
  console.log("-> Mensaje: " + msg);
  //-- Reenviarlo a todos los clientes conectados
  io.send("-> Mensaje: " + msg);
});
