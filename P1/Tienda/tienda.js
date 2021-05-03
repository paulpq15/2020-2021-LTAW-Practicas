//-- Importar los módulos a utilizar
const http = require('http');
const fs = require('fs');
const url = require('url');

//-- Definir el puerto a utilizar
const PUERTO = 9000;

//-- Crear el servidor. La función de retrollamada de
//-- atención a las peticiones se define dentro de los
//-- argumentos
const server = http.createServer((req, res) => {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  //-- Construir el objeto url con la url de la solicitud
  //-- Y escribir en consola la ruta de nuestro recurso
  const myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log("  Ruta del recurso: " + myURL.pathname);
});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Servidor activado. Escuchando en puerto: " + PUERTO);