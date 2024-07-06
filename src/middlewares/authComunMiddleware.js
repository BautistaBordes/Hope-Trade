function authComunMiddleware (req, res, next) {
    if (req.session.usuario && req.session.usuario.rol == "comun") {
        next()
    } else {
        let redirect = req.session.usuario ? "/controlPanel" : "/login";
        res.redirect(redirect)
    }
}
module.exports = authComunMiddleware
//aca avanzas si sos un usuario registrado (Comun)