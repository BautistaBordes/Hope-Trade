const { body } = require("express-validator")
const Filial = require("../../database/models/Filial");

const validationContraOffers = [

    body("filialNueva")
    .notEmpty().withMessage("Debe seleccionar una filial"),

    body("fechaNueva")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .custom(value => {
        const dia = new Date(value).getDay();
        if ((dia === 6) || (dia  === 5)){
            throw new Error("Solo dias de semana")
        } 
        return true; 
    }),

    body("horaNueva")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .custom(async (value, {req}) => {
        if (req.body.filialNueva){
            const newFilial = await Filial.findOne({ where: { id: req.body.filialNueva } });
            const oldFilial = await Filial.findOne({ where: { nombre: req.body.filialPropuesta } });
            const hora_apertura = newFilial.hora_apertura.slice(0,-3)
            const hora_cierre = newFilial.hora_cierre.slice(0,-3)
            
    
            if (value < hora_apertura || value > hora_cierre){
                throw new Error(`Horario de atencion: ${hora_apertura} a ${hora_cierre}`);
            }
    
            if (oldFilial.id == req.body.filialNueva && req.body.fechaPropuesta == req.body.fechaNueva && req.body.horaPropuesta == value ){
                throw new Error(`Si es la misma fecha y filial elegí otro horario`);
            }
        }
    }),



];

module.exports = validationContraOffers;