function authMiddleware (req, res, next) {
    if (req.session.name !== undefined) {
        next()
    } else {
        res.redirect("/")
    }
}
module.exports = authMiddleware
//aca avanzas si sos un usuario registrado