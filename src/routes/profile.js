const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');

//con esto controlas si alguien es usuario sin registrar o registrado
const authMiddleware = require("../middlewares/authMiddleware");
const authComunMiddleware = require("../middlewares/authComunMiddleware");

//con esto podes decir que validaciones hace cada ruta

const validationsPassword = require('../middlewares/validations/validationsPassword');


// ----- rutas -----

router.get('/profile/myPosts', authComunMiddleware, profileController.myPost);

router.get('/profile/changePassword', authMiddleware, profileController.changePassword);

router.post('/profile/changePassword', authMiddleware, validationsPassword, profileController.changePasswordProcess);

router.get('/profile/myOffers', authComunMiddleware, profileController.myOffers);

router.get('/profile/offers', authComunMiddleware, profileController.offers);


module.exports = router;