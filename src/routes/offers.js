const express = require('express');
const router = express.Router();
const offersController = require("../controllers/offers");

const authComunMiddleware = require("../middlewares/authComunMiddleware");
const validationsOffer = require("../middlewares/validations/validationsOffers");



router.get('/offers/:id', authComunMiddleware, offersController.create);
router.post('/offers/:id', authComunMiddleware, validationsOffer, offersController.createProccess);


router.get('/offerAcept/:id', authComunMiddleware, offersController.aceptOffer); //REVISAR MIDDLEWARES PARA QUE NO LA PUEDA ACEPTAR CUALQUIERA ENTRANDO A LA URL

router.get('/offerReject/:id', authComunMiddleware, offersController.rejectOffer); //REVISAR MIDDLEWARES PARA QUE NO LA PUEDA RECHAZAR CUALQUIERA ENTRANDO A LA URL

module.exports = router;