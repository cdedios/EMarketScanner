var users = [ {
	email : "admin@asdf.com",
	pass : "1234",
	id : 0
} ];
var id = 0;

module.exports = {
	// • createSession comprueba las credenciales del usuario y crea una nueva sesión si son correctos
	createSession : function(req, res, next) {
		var found = false;
		for ( var i = 0, _len = users.length; i < _len; i++) {
			console.log(users[i].email);
			if (users[i].email === req.body.name
					&& users[i].pass === req.body.password) {
				req.session.user = users[i];
				console.log("Create Session done!");
				res.send(200);
				found = true;
			}
		}
		if (!found){
			res.send(400);
		}
			
	},
	// • requireSession protege la ruta y solo deja pasar a los usuarios autentiﬁcados)
	requiereSession : function(req, res, next) {
		if (req.session.user) {
			console.log("RequireSession OK!");
			next();
		} else {
			console.log("RequireSession ERROR!");
			req.session.error = 'Access denied!';
			res.send(400);
		}
	},
	// • destroySession elimina la sesión del usuario logout
	destroySession : function(req, res, next) {
		req.session = null;
	},
	createUser : function(req, res, next) {
		var exist = false;
		for ( var i = 0, _len = users.length; i < _len; i++) {
			if (users[i].email === req.body.name) {
				console.log("Name already taken");
				res.send(400);
				exist = true;
			}
		}
		if (!exist) {
			console.log("Hi "+req.body.name+" Welcome!! you are now registred");
			var newUser = {
				email : req.body.name,
				pass : req.body.password,
				id : id++
			}
			users.push(newUser);
			req.session.user = users[id];
			res.send(200);
		}

	},
};
