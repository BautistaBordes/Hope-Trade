function guestMiddleware (req, res, next) {
    if (!req.session.usuario) {
        next()
    } else {
        let redirect = req.session.usuario.rol == "comun" ? "/posts" : "/controlPanel";
        res.redirect(redirect)
        //podria redirigirte al perfil
    }
}
module.exports = guestMiddleware
//aca solo vas a poder avanzas si sos un usuario no registrado