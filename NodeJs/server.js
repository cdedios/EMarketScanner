// Indicamos los modulos que necesitaremos
// Falta indicar el motor de render de las plantillas
var express = require('express'),
    app = express()
;

app.set('public', __dirname + '/public');

app.post('/', function (request, response) {
    var task = request.body;
    console.log(task);
    console.log('Paco');
    response.send(200);
});
app.get('/', function (request, response) {
    var task = request.body;
    console.log(task);
    console.log('Paco');
    response.send(200);
});
/*
    Parte donde escribiremos nuestro código:
    * los controladores
    * middleware
    * rutas
    * errores
 */

app.use( express.static(app.get('public')) );
app.listen(3000);
console.log('Application Started on http://localhost:3000/');
