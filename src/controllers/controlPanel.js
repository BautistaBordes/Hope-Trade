const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator")
const Voluntario = require('../database/models/Voluntario') 
const Representante = require('../database/models/Representante') 
const Filial = require('../database/models/Filial')
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const passGoogle = require('../../authGoogle')

// Configuración del transporte
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "hopetrade.lp@gmail.com",
      pass: passGoogle,
    },
  });
  
function sendMail(mail, password){
    // Detalles del correo electrónico
    let mailOptions = {
        from: 'hopetrade.lp@gmail.com', // Dirección del remitente
        to: mail, // Dirección del destinatario
        subject: 'Bienvenido a Hope Trade',
        text: `Tu contraseña es ${password}` 
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Error al enviar el correo: ' + error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
}

const controlador = {
    index: (req,res) =>{
        res.render("controlPanel/index")
    },

    registerVoluntario: async (req,res)=>{
        const filiales = await Filial.findAll();
        res.render("controlPanel/registerVoluntario", { filiales : filiales })
    },
    registerVoluntarioProcess: async(req,res)=>{
        const result = validationResult(req);
        const filiales = await Filial.findAll();
        const {nombre, apellido, mail, filial} = req.body;
        const password = parseInt(Math.random() * (999999 + 100000) + 100000);


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
            
            sendMail(mail, password);
            
            res.render("controlPanel/registerVoluntario", {filiales : filiales, operacion:true})

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
        const password = parseInt(Math.random() * (999999 + 100000) + 100000);


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

            sendMail(mail, password);

            res.render("controlPanel/registerRepresentante", {operacion:true})

        } catch (error) {
            console.log(error)
        }
    },

    changeFilial: async (req,res)=>{
        const filiales = await Filial.findAll();
        res.render("controlPanel/changeFilial", {filiales:filiales})
    },
    changeFilialProcess: async(req,res)=>{
        const result = validationResult(req);
        const {mail, filial} = req.body;
        const filiales = await Filial.findAll();

        if(result.errors.length > 0){
            return res.render("controlPanel/changeFilial", {
                errors: result.mapped(),
                msgError: "Hubo un error al cambiar la filial",
                oldData: req.body,
                filiales:filiales
            });
        }

        try {
            const usuario = await Voluntario.update({
                filial_id: filial
            },
            {
                where: {
                    mail: mail
                }
            }
            );
            res.render("controlPanel/changeFilial", {filiales:filiales, operacion:true})
        } catch (error) {
            console.log(error)
        }   
        
    },

}

module.exports = controlador;