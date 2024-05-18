const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator")
const Voluntario = require('../database/models/Voluntario') 
const Representante = require('../database/models/Representante') 
const Filial = require('../database/models/Filial')


const controlador = {
    index: (req,res) =>{
        res.render("employee/index")
    },

    registerVoluntario: async (req,res)=>{
        const filiales = await Filial.findAll();
        res.render("controlPanel/registerVoluntario", { filiales : filiales })
    },
    registerVoluntarioProcess: async(req,res)=>{
        const result = validationResult(req);
        const filiales = await Filial.findAll();
        const {nombre, apellido, mail, filial} = req.body;
        console.log(filial);
        const password = Math.random() * (999999 + 100000) + 100000;


        if(result.errors.length > 0){
            return res.render("controlPanel/registerVoluntario", {
                errors: result.mapped(),
                msgError: "No se pudo registrar al nuevo voluntario",
                oldData: req.body,
                filiales : filiales
            });
        }

        const encryptedPassword = bcrypt.hashSync(password.toString(), 10);
        try {
            const voluntario = await Voluntario.create({
                nombre: nombre, 
                apellido: apellido,
                mail: mail,
                password: encryptedPassword,
                filial_id: filial
            });
            res.redirect("/controlPanel")
        } catch (error) {
            console.log(error)
        }
    },

    registerRepresentante: (req,res)=>{
        res.render("controlPanel/registerRepresentante")
    },
    registerRepresentanteProcess: async(req,res)=>{
        const result = validationResult(req);

        const {nombre, apellido, mail} = req.body;
        const password = Math.random() * (999999 + 100000) + 100000;


        if(result.errors.length > 0){
            return res.render("controlPanel/registerRepresentante", {
                errors: result.mapped(),
                msgError: "No se pudo registrar al nuevo representante",
                oldData: req.body
            });
        }

        const encryptedPassword = bcrypt.hashSync(password.toString(), 10);
        try {
            const representante = await Representante.create({
                nombre: nombre, 
                apellido: apellido,
                mail: mail,
                password: encryptedPassword
            });
            res.redirect("/controlPanel")
        } catch (error) {
            console.log(error)
        }
    },

}

module.exports = controlador;