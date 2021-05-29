//-- Importar los módulos a utilizar
const http = require('http');
const fs = require('fs');
const url = require('url');

//-- Definir el puerto a utilizar
const PORT = 9000;

//-- Mensaje de arranque
console.log("Arrancando servidor...");

//-- Crear el servidor
const server = http.createServer((req, res) => {
    //-- Indicamos que se ha recibido una petición
    console.log("Petición recibida!");
    
    //-- Construir el objeto url con la url de la solicitud
    //-- Y escribir en consola la ruta de nuestro recurso
    const myURL = new URL(req.url, 'http://' + req.headers['host']);
    console.log("  Ruta del recurso: " + myURL.pathname);
    
    //-- Según el pathname, se define el fichero
    //-- con el que se responderá la petición
    
    // Definimos la variable fichero
    var filename = "";
    
    // Fichero que obtendremos
    if (myURL.pathname == "/") {
        filename += "/index.html"; //petición de la pag principal 
    } else {
        filename += myURL.pathname; //petición de cualquier otro recurso
    }
    
    //-- Para sacar el tipo de fichero
    type_file = filename.split(".")[1] //--Se coge la extensión del archivo
    filename = "." + filename //--Para leer el fichero. Sin "." no nos funciona
    
    console.log("Nombre del fichero: " + filename);
    console.log("Tipo de fichero: " + type_file);
    
    //-- Lectura del fichero (Asíncrona)
    fs.readFile(filename, function(err, data) {
        //-- Fichero no encontrado. Devolver mensaje de error
        if ((err) || filename == "./error.html") {
            res.writeHead(404, {'Content-Type': 'text/html'});
            console.log("404 Not Found");
        } else {
            // Fichero encontrado OK
            res.writeHead(200, {'Content-Type': 'text/html'});
            console.log("200 OK");
        }

        //-- Tipo mime por defecto: html --> TIPO DE ARCHIVO
        var mime = "text/html"
        
        //Tipo de imágenes
        if (type_file == 'png' || type_file == 'jpg') {
            mime = "image/" + type_file;
        }
        
        // CSS
        if (type_file == "css"){
            mime = "text/css";
        }
        
        //-- Generar el mensaje de respuesta
        res.write(data);
        res.end();
    });
});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PORT);

console.log("Servidor activado. Escuchando en puerto: " + PORT);