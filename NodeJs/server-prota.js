// Indicamos los modulos que necesitaremos
// Falta indicar el motor de render de las plantillas
var express = require('express'),
    //favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    //*jade = require('jade'),
    auth = require('./simpleAuth'),
    app = express()
;

// Definimos Parametros de forma global dentro de la Aplicación
app.set('public', __dirname + '/public');
//*app.set('views', __dirname + '/views');
app.set('secret cookies', 'texto opcional para el secret de las cookies');
app.set('secret session', "asdf");

// Configuramos el motor de las plantillas
//*app.engine('jade', jade.__express);
//*app.set('view engine', 'jade');

// Configuramos los elementos que utilizará Express.
// Recuerda que es importante el orden!
//app.use( favicon(app.get('public') + '/favicon.ico') );
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
        //this.id = this.constructor._id++;
        this.id = this.prodQR;
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

var Product = function(data) {
    data = extend({}, {prodQR: 0, name: "", prize: 0, desc: ""}, data);
    BaseModels.call(this, data);
};
BaseModels.initialize(Product);
extend(Product, {
    findByQR: function(email) {
        return this._models.filter(function(u) {
            return u.email === email;
        })[0];
    }
});
extend(Product.prototype, BaseModels.prototype);

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

var productsController = {
    index: function(req, res){
        //res.render("post-list",{posts: Post.getAll(), user: req.session.user });
        console.log(Product.getAll());
        res.send(Product.getAll());
    },
    view: function(req, res){
        console.log(req.postPlantilla);
	res.send(req.postPlantilla);
        //res.send(Product.find(req.productid));
    },
    edit: function(req, res){
        res.render("new-post",{post: req.postPlantilla, user: req.session.user});
    },
    create: function(req, res){
        console.log('creating new post');
        //res.render("new-post",{post: new Post()});
        res.render("new-post",{post: {}});
    },
    save: function(req, res){
        var post = new Product({title: req.body.title, content: req.body.content});
        post.save();
        res.redirect('/posts');
    },
    delete: function(req, res){
        console.log('entrem');
        req.postPlantilla.delete();
        res.redirect('/posts');
    },
    actualitzar: function(req, res){
        var post = new Product(req.postPlantilla);
        post.title = req.body.title;
        post.content = req.body.content;
        post.update();
        res.redirect('/posts');
    },
    param: function(req, res, next, productid){
        req.postPlantilla = Product.find(productid);
        next();
    }
};
// Procesamos el parametro : postid, utilizando el metodo creado en 
// el controlador. Seimpre se relalizan antes de procesar las rutas
app.param("productid", productsController.param);

// Procesamos las rutas
app.get('/', function (req, res){ res.render('base', {user: req.session.user })});
 //   res.render("post-list",{posts: Post.getAll(), user: req.session.user });


app.get('/products', productsController.index);
//app.get('/posts/new', auth.requiereSession, productsController.create);
//app.post('/posts', productsController.save);
app.get('/products/:productid', productsController.view);
//app.get('/posts/:postid/edit', auth.requiereSession, productsController.edit);
//app.put('/posts/:postid',productsController.actualitzar);
//app.delete('/posts/:postid', auth.requiereSession, productsController.delete);

//app.post('/login', auth.createSession);
app.get('/logout', auth.destroySession);
//app.post('/register', auth.createUser);

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

app.use( express.static(app.get('public')) );
// Indicamos el puerto
app.listen(3000);
console.log('Application Started on http://localhost:3030/');

/* Datos: los Posts */
var product = new Product({prodQR: 33442, name: "Patatuques", prize:40, desc:"Les patatuques de la aguela"});
product.save();
product = new Product({prodQR: 55542, name: "Melonucos", prize:30, desc:"Els melonucos de la aguela"});
product.save();
