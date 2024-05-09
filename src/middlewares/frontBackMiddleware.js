function frontBackMiddleware (req, res, next) {
    if (req.session.name != undefined) {
       res.locals.nombre = req.session.name;
    }
    next()
}
module.exports = frontBackMiddleware   
