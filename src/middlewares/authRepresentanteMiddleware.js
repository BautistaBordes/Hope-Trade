function authRepresentanteMiddleware (req, res, next) {
    if (req.session.usuario && req.session.usuario.rol == "representante") {
        next()
    } else {
        let redirect = req.session.usuario ? ( req.session.usuario == "comun" ? "/posts" : "/controlPanel") : "/" ;
        res.redirect(redirect)
    }
}
module.exports = authRepresentanteMiddleware
//aca avanzas si sos un usuario registrado (representante)