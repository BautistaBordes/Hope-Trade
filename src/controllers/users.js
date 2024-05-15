const { validationResult, matchedData } = require("express-validator")
const bcrypt = require('bcryptjs');

const Usuario = require('../database/models/Usuario')
const Voluntario = require("../database/models/Voluntario");
const Representante = require("../database/models/Representante");

const controlador = {
    register: (req, res) => {
        res.render("loginRegister/register");
    },
    registerProcess: async (req, res) => {
        //antes de ejecutarse esta funcion se verifican los campos (vease en las rutas).
        const result = validationResult(req);
        //req.body, el cuerpo de la solicitud viene del formulario, los inputs se vinculan mediante el atributo "name"
        const {nombre, apellido, dni, mail, password, telefono, fecha} = req.body;

        if (result.errors.length > 0) {
            return res.render("loginRegister/register", {
                errors: result.mapped(),
                msgError: "Hubo un problema al registrarse. intentelo de nuevo",
                oldData: req.body
            });
        }

        const encryptedPassword = bcrypt.hashSync(password, 10);
        try {
            const usuario = await Usuario.create({
                nombre: nombre, 
                apellido: apellido,
                dni: dni,
                mail: mail,
                password: encryptedPassword,
                telefono: telefono,
                fecha_nacimiento: fecha
            });
            res.redirect("/login")
        } catch (error) {
            console.log(error)
        }
        
    },
    login: (req, res) => {
        res.render("loginRegister/login");
    },
    loginProcess: async (req, res) => {
        const result = validationResult(req);
        const {dni_mail, password} = req.body;
        let usuario,rol;

        if(result.errors.length > 0){
            return res.render("loginRegister/login", {
                errors: result.mapped(),
                msgError: "Hubo un problema con su inicio de sesión",
                oldData: req.body
            });
        }

        //aca le hace peticiones a la BD
        if(!dni_mail.includes("@") ){
            usuario = await Usuario.findOne({ where: { dni: dni_mail } });
            rol = "normal"
        } else {
            usuario = await Voluntario.findOne({ where: { mail: dni_mail } });
            if (!usuario) {
                usuario = await Representante.findOne({ where: { mail: dni_mail } });
                rol = "representante";
            } else rol = "voluntario";
        }

        if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
            return res.render("loginRegister/login", {
                msgError: "Hubo un problema con su inicio de sesión",
                oldData: req.body
            });
        }
        //definimos usuario para que solo sea un objeto con sus propiedades (era un modelo de sequelize) y agregamos el rol
        usuario = {...usuario.dataValues, rol: rol}
        //eaca defino que ahora todas las solicitudes van a tener el objeto session que tiene  otro objeto con todos los datos del usuario
        req.session.usuario = usuario;
        res.redirect("/")

     },
     logout: (req,res) =>{
        req.session.destroy();
        res.redirect('/')
      },
}

module.exports = controlador;