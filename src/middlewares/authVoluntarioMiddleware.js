function authVoluntarioMiddleware (req, res, next) {
    if (req.session.usuario !== undefined && req.session.usuario.rol == "voluntario") {
        next()
    } else {
        res.redirect("/")
    }
}
module.exports = authVoluntarioMiddleware
//aca avanzas si sos un usuario registrado (representante)