const express = require('express');
const router = express.Router();

//con esto controlas si alguien es usuario sin registrar o registrado
const authMiddleware = require("../middlewares/authMiddleware");
const authComunMiddleware = require("../middlewares/authComunMiddleware");

//con esto podes decir que validaciones hace cada ruta
const profileController = require('../controllers/profile');
const validationsPassword = require('../middlewares/validations/validationsPassword');


// ----- rutas -----
router.get('/profile',  authComunMiddleware, profileController.profile);

router.get('/profile/myPosts', authComunMiddleware, profileController.myPost);

router.get('/profile/changePassword', authMiddleware, profileController.changePassword);

router.post('/profile/changePassword', authMiddleware, validationsPassword, profileController.changePasswordProcess);


module.exports = router;