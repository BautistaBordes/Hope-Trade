const express = require('express');
const router = express.Router();

//con esto controlas si alguien es usuario sin registrar o registrado
const authMiddleware = require("../middlewares/authMiddleware");

//con esto podes decir que validaciones hace cada ruta
const profileController = require('../controllers/profile');


// ----- rutas -----
router.get('/profile',  authMiddleware, profileController.profile);

router.get('/profile/myPosts', authMiddleware, profileController.myPost);





module.exports = router;