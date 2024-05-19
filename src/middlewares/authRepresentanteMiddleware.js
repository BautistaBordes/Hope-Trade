function authRepresentanteMiddleware (req, res, next) {
    if (req.session.usuario !== undefined && req.session.usuario.rol == "representante") {
        next()
    } else {
        res.redirect("/")
    }
}
module.exports = authRepresentanteMiddleware
//aca avanzas si sos un usuario registrado (representante)