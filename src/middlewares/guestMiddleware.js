function guestMiddleware (req, res, next) {
    if (req.session.name === undefined) {
        next()
    } else {
        res.redirect("/")
        //podria redirigirte al perfil
    }
}
module.exports = guestMiddleware
//aca solo vas a poder avanzas si sos un usuario no registrado