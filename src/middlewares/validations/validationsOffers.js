const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { body } = require("express-validator");
const Filial = require("../../database/models/Filial");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
    //si no existe la carpeta de /uploads/publicaciones en el directorio raiz la creo
    let pathDestination = path.join(__dirname, '../../../uploads/ofertas');

    if(!fs.existsSync(pathDestination)) fs.mkdirSync(pathDestination, {recursive: true});

    cb(null, pathDestination);
    },
    filename: (req, file, cb) => {
      const newFilename = "product" + '-' + Date.now() + path.extname(file.originalname);
      cb(null, newFilename);
    }
});
  
const upload = multer({ storage: multerStorage });

const validationsOffer = [
    upload.single("foto"),

    body("nombre").trim()
    .notEmpty().withMessage("No puede estar vacio"),
    

    body("descripcion").trim()
    .notEmpty().withMessage("No puede estar vacio"),

    body("categoria")
    .notEmpty().withMessage("Debe seleccionar una categoria"),

    body("filial")
    .notEmpty().withMessage("Debe seleccionar una filial"),

    body("fecha")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .custom(value => {
        const dia = new Date(value).getDay();

        if ((dia === 6) || (dia  === 5)){
            throw new Error("Solo dias de semana")
        } 
        return true; 
    }),

    body("hora")
    .notEmpty().withMessage("No puede estar vacio").bail()
    .custom(async (value, {req}) => {
        if (!req.body.filial){
            throw new Error("Debe seleccionar una filial");
        }

        const filial = await Filial.findOne({ where: { id: req.body.filial } });
        const hora_apertura = filial.hora_apertura.slice(0,-3)
        const hora_cierre = filial.hora_cierre.slice(0,-3)
        

        if (value < hora_apertura || value > hora_cierre){
            throw new Error(`Horario de atencion: ${hora_apertura} a ${hora_cierre}`);
        }
    }),

    body("foto")
    .custom((value, {req}) => {
      
        if(!req.file) throw new Error("Selecciona una imagen");

        const ext = path.extname(req.file.originalname);
        

        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            throw new Error("Solo se aceptan imagenes");
        } else if (req.file.size > (Math.pow(2048,2) ) ) {
            throw new Error("Archivo muy grande");
        }
        return true;
    })

];

module.exports = validationsOffer;