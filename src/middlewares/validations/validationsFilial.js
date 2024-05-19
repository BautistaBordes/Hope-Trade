const { body } = require("express-validator")

const validationsFilial = [
    
    body("filial")
    .notEmpty().withMessage("Debe seleccionar una filial"),

];

module.exports = validationsFilial;