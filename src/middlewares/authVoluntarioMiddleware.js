function authVoluntarioMiddleware (req, res, next) {
    if (req.session.usuario !== undefined && req.session.usuario.rol == "voluntario") {
        next()
    } else {
        let redirect = req.session.usuario ? ( req.session.usuario == "comun" ? "/posts" : "/controlPanel") : "/" ;
        res.redirect(redirect)
    }
}
module.exports = authVoluntarioMiddleware;
//aca avanzas si sos un usuario registrado (voluntario)