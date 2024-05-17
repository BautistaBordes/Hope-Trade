function backToFrontMiddleware (req, res, next) {
    if (req.session.usuario != undefined) {
       res.locals.usuario = req.session.usuario;
    }
    next()
}
module.exports = backToFrontMiddleware   

//aca es donde mediante el objeto locals (de ejs) le paso la informacion del usuario, si esta conecatdo o no 

/*
si yo tengo algo asi:

(req, res) => {
        res.render("index", {
            title: "hola"
        } );
    },

    o sea ahi lo q dice, es renderiza la pagina index y ademas le voy a pasar mediante el objeto locals un titulo
    para acceder podria ser locals.titl
*/