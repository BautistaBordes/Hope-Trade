function authComunMiddleware (req, res, next) {
    if (req.session.usuario !== undefined && req.session.usuario.rol == "comun") {
        next()
    } else {
        res.redirect("/")
    }
}
module.exports = authComunMiddleware
//aca avanzas si sos un usuario registrado (Comun)