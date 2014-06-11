var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    auth = require('./simpleAuth'),
    app = express()
;

// Definimos Parametros de forma global dentro de la Aplicación
app.set('public', __dirname + '/public');
app.set('secret cookies', 'texto opcional para el secret de las cookies');
app.set('secret session', "asdf");

// Configuramos los elementos que utilizará Express.
// Recuerda que es importante el orden!
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
app.get('/', function (req, res){ response.send(200);});

app.get('/products', productsController.index);
app.get('/products/:productid', productsController.view);


app.post('/login', auth.createSession);
app.get('/logout', auth.destroySession);
app.post('/register', auth.createUser);


app.use( express.static(app.get('public')) );
// Indicamos el puerto
app.listen(3000)
console.log('Application Started on http://localhost:3000/');

/* Datos: los Posts */
var product = new Product({prodQR: 33442, name: "Patates", prize:4, desc:"Patates de l'horta de Lleida. Preu el kg"});
product.save();
product = new Product({prodQR: 55541, name: "Melons", prize:3, desc:"Els millors melons de Sucs. Preu el kg"});
product.save();
product = new Product({prodQR: 55543, name: "Plàtans", prize:300, desc:"Plàtans de canàries. Preu el kg"});
product.save();
product = new Product({prodQR: 55544, name: "Peres", prize:30, desc:"Peres conferencia. Preu el kg"});
product.save();
product = new Product({prodQR: 55545, name: "Cindries", prize:30, desc:"Cindries d'importació. Preu el kg"});
product.save();
