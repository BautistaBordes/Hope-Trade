function authEmployeeMiddleware (req, res, next) {
    if (req.session.usuario !== undefined && (req.session.usuario.rol == "voluntario" || req.session.usuario.rol == "representante")) {
        next()
    } else {
        res.redirect("/posts")
    }
}
module.exports = authEmployeeMiddleware