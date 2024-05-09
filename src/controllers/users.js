const path = require('path');
const fs = require('fs');


const controlador = {
    login: (req, res) => {
        res.render("loginRegister/login");
    },
    register: (req, res) => {
        res.render("loginRegister/register");
    },
    loginProcess: (req, res) => {
        // Prepare output in JSON format
        console.log(req.body)
        //aca es donde se crea la sesion que me CAMBIA TODO
        req.session.name = req.body.nombre;

        res.redirect("/")

        // res.render("loginRegister/login", {
        //     info: JSON.stringify(req.body)
        // });
    
     },
     logout: (req,res) =>{
        req.session.destroy();
        res.redirect('/')
      },
}

module.exports = controlador;