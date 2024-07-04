const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator")
const { sendToMail } = require('../globals')
const { Op } = require('sequelize');
const Voluntario = require('../database/models/Voluntario') 
const Representante = require('../database/models/Representante') 
const Filial = require('../database/models/Filial')
const Intercambio = require('../database/models/Intercambio')
const Oferta = require('../database/models/Oferta')
const Usuario = require('../database/models/Usuario')
const Publicacion = require('../database/models/Publicacion')



const generarContrasenaAleatoria = (longitud)=> {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let contrasena = '';

    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        contrasena += caracteres.charAt(indiceAleatorio);
    }
  
    return contrasena;
}

const controlador = {
    index: async (req,res) => {
        let filial;
        if (req.session.usuario.rol === "voluntario") filial = await Filial.findOne({where: {id : req.session.usuario.filial_id}})
        res.render("controlPanel/index", {filial})
    },

    registerVoluntario: async (req,res)=>{
        const filiales = await Filial.findAll();
        res.render("controlPanel/registerVoluntario", { filiales : filiales })
    },
    registerVoluntarioProcess: async(req,res)=>{
        const result = validationResult(req);
        const filiales = await Filial.findAll();
        const {nombre, apellido, mail, filial} = req.body;


        if(result.errors.length > 0){
            return res.render("controlPanel/registerVoluntario", {
                errors: result.mapped(),
                msgError: "No se pudo registrar al nuevo voluntario",
                oldData: req.body,
                filiales : filiales
            });
        }

        const password = generarContrasenaAleatoria(6);

        const encryptedPassword = bcrypt.hashSync(password, 10);
        try {
            await Voluntario.create({
                nombre: nombre, 
                apellido: apellido,
                mail: mail,
                password: encryptedPassword,
                filial_id: filial
            });
            
            sendToMail(mail, 'Bienvenido a Hope Trade' ,` ¡Bienvenido ${nombre}! Tu contraseña es ${password}`);
            
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


        if(result.errors.length > 0){
            return res.render("controlPanel/registerRepresentante", {
                errors: result.mapped(),
                msgError: "No se pudo registrar al nuevo representante",
                oldData: req.body
            });
        }

        const password = generarContrasenaAleatoria(6);

        const encryptedPassword = bcrypt.hashSync(password, 10);
        try {
            const representante = await Representante.create({
                nombre: nombre, 
                apellido: apellido,
                mail: mail,
                password: encryptedPassword
            });

            sendToMail(mail, 'Bienvenido a Hope Trade' ,` ¡Bienvenido ${nombre}! Tu contraseña es ${password}`);

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
    exchangesFilter: async (req,res) => {
        try {
            const fechaURL = req.params.filterByDate;
            let whereObject = {filial_id: req.session.usuario.filial_id};
            if(fechaURL != undefined) whereObject = {...whereObject, fecha: fechaURL};
            
            const intercambios = await Intercambio.findAll( { 
                include: [ 
                    { model: Oferta, include: [Usuario, Filial],  where: whereObject } ,
                    { model: Publicacion, include: [Usuario] }
                ], 
                where: {estado: "pendiente"} 
            } );

            const intercambios2 = await Promise.all(intercambios.map( async intercambio => {
                if(intercambio.Publicacion.usuario_id == intercambio.Oferta.usuario_id) {
                    const ofertaPadre = await Oferta.findOne({   
                        where: { id: intercambio.Oferta.oferta_padre_id },
                        include: [ Usuario ]
                    });
                    intercambio.Oferta = {...intercambio.Oferta, ofertaPadre};
                }
               
                return intercambio;
            }));
            


            res.render("controlPanel/exchanges", {intercambios: intercambios2, fecha:fechaURL});

        } catch (error) {
            console.log(error);
            res.status(500).send("error al ver los intercambios")
        }
    },
    historyExchanges: async (req, res) => {
        try {
            const filial = req.query.filial;
            let whereObject;
            if (filial) {
                whereObject = { filial_id : filial}
            }
            if (filial == 0){whereObject = {}}
            
            const intercambios = await Intercambio.findAll( { 
                include: [ 
                    { model: Oferta, include: [Usuario, Filial],  where: whereObject } ,
                    { model: Publicacion, include: [Usuario] }
                ], 
                where: {estado: {[Op.ne]: "pendiente"}} 
            } );

            const intercambios2 = await Promise.all(intercambios.map( async intercambio => {
                if(intercambio.Publicacion.usuario_id == intercambio.Oferta.usuario_id) {
                    const ofertaPadre = await Oferta.findOne({   
                        where: { id: intercambio.Oferta.oferta_padre_id },
                        include: [ Usuario ]
                    });
                    intercambio.Oferta = {...intercambio.Oferta, ofertaPadre};
                }
               
                return intercambio;
            }));
            
            const filiales = await Filial.findAll();


            res.render("controlPanel/historyExchanges", {intercambios: intercambios2, filiales: filiales, selectedFilial: filial});

        } catch (error) {
            console.log(error);
            res.status(500).send("error al ver los intercambios")
        }
    }

}

module.exports = controlador;