function guestOrComunMiddleware (req, res, next) {
    if (req.session.usuario === undefined || req.session.usuario.rol == "comun") {
        next()
    } else {
        res.redirect("/panel")
    }
}
module.exports = guestOrComunMiddleware
//aca solo vas a poder avanzas si sos un usuario no registrado o si sos usuario comun