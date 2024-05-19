const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { body } = require("express-validator");
const Publicacion = require("../../database/models/Publicacion");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
    //si no existe la carpeta de /uploads/publicaciones en el directorio raiz la creo
    let pathDestination = path.join(__dirname, '../../../uploads/publicaciones');

    if(!fs.existsSync(pathDestination)) fs.mkdirSync(pathDestination, {recursive: true});

    cb(null, pathDestination);
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
    .notEmpty().withMessage("No puede estar vacio").bail(),

    body("categoria").trim()
    .notEmpty().withMessage("No puede estar vacio").bail(),

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

module.exports = validationsPost;