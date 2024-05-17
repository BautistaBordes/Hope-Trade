const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { body } = require("express-validator");
const Publicacion = require("../database/models/Publicacion");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads/publicaciones'));
    },
    filename: (req, file, cb) => {
      const newFilename = "product" + '-' + Date.now() + path.extname(file.originalname);
      cb(null, newFilename);
    }
});
  
const upload = multer({ storage: multerStorage });

const validationsPost = [
    upload.single("foto"),

    body("nombre").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .matches(/^[a-zA-Z0-9\s]*$/).withMessage("Sin caracteres especiales")
    .custom( async (value,{req}) => {
        const mismoNombre = await Publicacion.findOne({ 
            where: {
                usuario_id: req.session.usuario.id, 
                nombre: value
            }
        });
      if (mismoNombre)  throw new Error("ya tenes una publicacion llamada asi")
      return true;
    }),
    

    body("descripcion").trim()
    .notEmpty().withMessage("No puede estar vacio").bail()
    .matches(/^[a-zA-Z0-9\s]*$/).withMessage("Sin caracteres especiales"),

    body("foto")
    .custom((value, {req}) => {
      
        if(!req.file) throw new Error("Selecciona una imagen");

        if(req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/jpeg'){
            fs.unlinkSync(req.file.path);
            throw new Error("Solo se aceptan imagenes");
        } else if (req.file.size > (Math.pow(2048,2) ) ) {
            fs.unlinkSync(req.file.path);
            throw new Error("Archivo muy grande");
        }
        return true;
    })

];

module.exports = validationsPost;