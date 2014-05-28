// Indicamos los modulos que necesitaremos
// Falta indicar el motor de render de las plantillas
var express = require('express'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    jade = require('jade'),
    auth = require('./simpleAuth'),
    app = express()
;

// Definimos Parametros de forma global dentro de la Aplicación
app.set('public', __dirname + '/public');
app.set('views', __dirname + '/views');
app.set('secret cookies', 'texto opcional para el secret de las cookies');
app.set('secret session', "asdf");

// Configuramos el motor de las plantillas
app.engine('jade', jade.__express);
app.set('view engine', 'jade');

// Configuramos los elementos que utilizará Express.
// Recuerda que es importante el orden!
app.use( favicon(app.get('public') + '/favicon.ico') );
app.use( bodyParser() );
app.use( methodOverride() );
app.use( cookieParser(app.get('secret cookies')) );
app.use( cookieSession({secret: app.get('secret session')}) );

//--------------------------------------------
// Función que nos permite extender un objeto
// Utilizaremos para simular los modelos
// Modelos
function extend() {
    var args = [].slice.call(arguments);
    return args.reduce(function(acc, el) {
        for (var k in el) { acc[k] = el[k]; }
        return acc;
    });
} 

var BaseModels = function(data) {
    extend(this, data);
};
extend(BaseModels, {
    initialize: function(klass) {
        extend(klass, {
            _models: [],
            _id: 0,
            find: function(id) {
                return this._models.filter(function(p) { return p.id == id; })[0];
            },
            getAll: function() {
                return this._models;
            }
        });
    }
});
extend(BaseModels.prototype, {
    save: function() {
        this.id = this.constructor._id++;
        this.constructor._models.push(this);
    },
    update: function() {
        var models = this.constructor._models;
        for (var i=0,_len=models.length; i<_len; i++) if (models[i].id === this.id) {
            models.splice(i, 1, this);
            break;
        }
    },
    delete: function() {
        var models = this.constructor._models;
        for (var i=0,_len=models.length; i<_len; i++) if (models[i].id === this.id) {
            models.splice(i, 1);
            break;
        }
    }
});

var Post = function(data) {
    data = extend({}, {title: "", content: "", date: Date.now(), views: 0}, data);
    BaseModels.call(this, data);
};
BaseModels.initialize(Post);
extend(Post.prototype, BaseModels.prototype);

var User = function(data) {
    data = extend({email: "", date: Date.now(), password: ""}, data);
    BaseModels.call(this, data);
};
BaseModels.initialize(User);
extend(User, {
    findByEmail: function(email) {
        return this._models.filter(function(u) {
            return u.email === email;
        })[0];
    }
});
extend(User.prototype, BaseModels.prototype);
//--------------------------------------------
//--------------------------------------------
/*
    parte donde escribiremos nuestro codigo:
    * los controladores
    * middleware
    * rutas
    * errores
*/


var postsController = {
    index: function(req, res){
        /*if (req.session.logged){
            console.log("entro");
            res.render("post-list",{posts: Post.getAll(), user: req.session.user });
        }else{
            console.log("no entro");
            res.render("post-list",{posts: Post.getAll()});
        }*/
        res.render("post-list",{posts: Post.getAll(), user: req.session.user });
    },
    view: function(req, res){
        //console.log(req.postPlantilla);
        req.postPlantilla.views++;
        res.render("post-detail",{post: req.postPlantilla, user: req.session.user});
    },
    edit: function(req, res){
        //console.log(req.postPlantilla);
        res.render("new-post",{post: req.postPlantilla, user: req.session.user});
    },
    create: function(req, res){
        console.log('creating new post');
        //res.render("new-post",{post: new Post()});
        res.render("new-post",{post: {}});
    },
    save: function(req, res){
        var post = new Post({title: req.body.title, content: req.body.content});
        post.save();
        res.redirect('/posts');
    },
    delete: function(req, res){
        console.log('entrem');
        req.postPlantilla.delete();
        res.redirect('/posts');
    },
    actualitzar: function(req, res){
        var post = new Post(req.postPlantilla);
        post.title = req.body.title;
        post.content = req.body.content;
        post.update();
        res.redirect('/posts');
    },
    param: function(req, res, next, postid){
        req.postPlantilla = Post.find(postid);
        next();
    }
};
// Procesamos el parametro : postid, utilizando el metodo creado en 
// el controlador. Seimpre se relalizan antes de procesar las rutas
app.param("postid", postsController.param);

// Procesamos las rutas
app.get('/', function (req, res){ res.render('base', {user: req.session.user })});
 //   res.render("post-list",{posts: Post.getAll(), user: req.session.user });


app.get('/posts', postsController.index);
app.get('/posts/new', auth.requiereSession, postsController.create);
app.post('/posts', postsController.save);
app.get('/posts/:postid', postsController.view);
app.get('/posts/:postid/edit', auth.requiereSession, postsController.edit);
app.put('/posts/:postid',postsController.actualitzar);
app.delete('/posts/:postid', auth.requiereSession, postsController.delete);
app.post('/login', auth.createSession);
app.get('/logout', auth.destroySession);
app.post('/register', auth.createUser);

/*
    Parte donde escribiremos nuestro código:
    * los controladores
    * middleware
    * rutas
    * errores
 */

app.use( express.static(app.get('public')) );
// Indicamos el puerto
app.listen(3000);
console.log('Application Started on http://localhost:3000/');

/* Datos: los Posts */
var post = new Post({title: "Prueba", content: "Esto es una prueba"});
post.save();
post = new Post({title: "Prueba2", content: "Esto es una prueba2"});
post.save();
