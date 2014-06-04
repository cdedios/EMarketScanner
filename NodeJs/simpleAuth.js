var users = [];
var id = 0; 
 //{email:"admin@asdf.com",pass: "1", id: 0}
// • createSession comprueba las credenciales del usuario y crea una nueva sesión si son correctos
// • requireSession protege laruta y solo deja pasar a los usuarios autentiﬁcados)
// • destroySession elimina la sesión del usuario logout
 
exports.createSession = function (req, res, next){
    for (var i=0,_len=users.length; i<_len; i++) {
        console.log("!!!" + users[i].email);
        console.log(req.body.name);
        if (users[i].email === req.body.name && users[i].pass === req.body.password) {
            console.log("existe!!!");
            req.session.user = users[i];
            next();
        }else{
            console.log("No existeix");
            res.send(400);
            return;
        }
    }    
}
 
exports.requiereSession = function (req, res, next){
    if (req.session.user) {
        next();
    }else{
        req.session.error = 'Access denied!';
        console.log("Acces denied");
        //res.redirect('/posts');
    }
}
 
exports.destroySession = function (req, res, next){
    req.session = null;
    next();
}

exports.createUser = function (req, res, next){
    user = {email:req.body.name, pass:req.body.password, id:id++};
    users.push(user);
    req.session.user = user;
    console.log("200, User: "+user.email+" created");
    next();
}