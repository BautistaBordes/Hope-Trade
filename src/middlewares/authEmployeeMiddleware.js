function authEmployeeMiddleware (req, res, next) {
    if (req.session.usuario && (req.session.usuario.rol == "voluntario" || req.session.usuario.rol == "representante")) {
        next()
    } else {
        res.redirect("/posts") //si sos usuario comun quedas en la seccion de posts, si no estas registrado vas al inicio
    }
}
module.exports = authEmployeeMiddleware