const express = require('express');
const router = express.Router();
const offersController = require("../controllers/offers");

const authComunMiddleware = require("../middlewares/authComunMiddleware");
const validationsOffers = require("../middlewares/validations/validationsOffers");
const validationsContraOffers = require("../middlewares/validations/validationsContraOffers");



router.get('/offers/:id', authComunMiddleware, offersController.create);
router.post('/offers/:id', authComunMiddleware, validationsOffers, offersController.createProccess);

router.get('/contraOffers/:id', authComunMiddleware, offersController.createContraOffer);
router.post('/contraOffers/:id', authComunMiddleware, validationsContraOffers, offersController.createContraOfferProccess);


router.post('/offerAccept/:id', authComunMiddleware, offersController.acceptOffer);

router.post('/offerReject/:id', authComunMiddleware, offersController.rejectOffer);

module.exports = router;