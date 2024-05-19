const { body } = require("express-validator");
const Voluntario = require("../../database/models/Voluntario");

const validationsChangeFilial = [
    
    body("mail")
    .custom(async(value, {req}) => {

        const usuario = await Voluntario.findOne({ where: { mail: req.body.mail } });
        if (!usuario)  throw new Error("El mail ingresado no existe")

        return true;
    }),

    body("filial")
    .custom(async(value, {req}) => {

        const usuario = await Voluntario.findOne({ where: { mail: req.body.mail } });

        if (usuario && value == usuario.filial_id){
            throw new Error("Ya pertenece a esa filial");
        }

        return true;
    })


];

module.exports = validationsChangeFilial;