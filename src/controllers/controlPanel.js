const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator")
const Voluntario = require('../database/models/Voluntario') 
const Representante = require('../database/models/Representante') 


const controlador = {
    index: (req,res) =>{
        res.render("employee/index")
    },

    registerVoluntario: (req,res)=>{
        res.render("controlPanel/registerVoluntario")
    },
    registerVoluntarioProcess: async(req,res)=>{
        const result = validationResult(req);

        const {nombre, apellido, mail} = req.body;
        const password = Math.random() * (999999 + 100000) + 100000;


        if(result.errors.length > 0){
            return res.render("controlPanel/registerVoluntario", {
                errors: result.mapped(),
                msgError: "No se pudo registrar al nuevo voluntario",
                oldData: req.body
            });
        }

        const encryptedPassword = bcrypt.hashSync(password.toString(), 10);
        try {
            const voluntario = await Voluntario.create({
                nombre: nombre, 
                apellido: apellido,
                mail: mail,
                password: encryptedPassword,
                filial_id: 1 //AGREGAR EN EL FORMULARIO PARA ELEGIR FILIAL
            });
            res.redirect("/controlPanel")
        } catch (error) {
            console.log(error)
        }
    },

}

module.exports = controlador;