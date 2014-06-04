// Indicamos los modulos que necesitaremos
// Falta indicar el motor de render de las plantillas
var express = require('express'),
    bodyParser = require('body-parser'),
    auth = require("./simpleAuth");
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    app = express()
;

app.set('public', __dirname + '/public');
app.set('secret cookies', 'texto opcional para el secret de las cookies');
app.set('secret session', "asdf");

app.use( bodyParser() );
app.use( cookieParser(app.get('secret cookies')) );
app.use( cookieSession({secret: app.get('secret session')}) );

app.post('/login', auth.createSession, function(request,response){
    //var json = request.body;
    console.log("Log in done!");
    //console.log('Paco posting login');
    response.send(200);
});
app.post('/register', auth.createUser, function(request,response){
    //var json = request.body;
    console.log("Register done!");
    //console.log('Paco posting register');
    response.send(200);
});

/*app.post('/login', function (request, response) {
    var json = request.body;
    console.log(json);
    console.log('Paco posting login');
    response.send(200);
});
app.post('/register', function (request, response) {
    var json = request.body;
    console.log(json);
    console.log('Paco posting register');
    response.send(200);
});*/
app.get('/', function (request, response) {
    var task = request.body;
    console.log(task);
    console.log('Paco getting');
    response.send(200);
});


app.use( express.static(app.get('public')) );
app.listen(3000);
console.log('Application Started on http://localhost:3000/');
