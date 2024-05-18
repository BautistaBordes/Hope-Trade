const { body } = require("express-validator");
const { changePassword } = require("../controllers/profile");
const Usuario = require("../database/models/Usuario");
const bcrypt = require('bcryptjs');

const validationsPassword = [

    body("new_psw").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isLength({min:6}).withMessage("Deben 6 caracteres como minimo"),
    body('confirm_psw').custom((value, { req }) => {
        if (value !== req.body.new_psw)
            throw new Error("No coinciden las contraseñas")
        return true;
      
    }),
    body("old_psw").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .isLength({min:6}).withMessage("Deben 6 caracteres como minimo")
    .custom( async (value, { req }) => {
        const usuario = await Usuario.findOne({ where: { id : req.session.usuario.id } });
        if (!bcrypt.compareSync(req.body.old_psw, usuario.password))
            throw new Error("Contraseña erronea")
        return true;
    }),
];

module.exports = validationsPassword;