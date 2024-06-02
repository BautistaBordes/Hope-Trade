const express = require('express');
const router = express.Router();
const offersController = require("../controllers/offers");

const authComunMiddleware = require("../middlewares/authComunMiddleware");
const validationsOffer = require("../middlewares/validations/validationsOffers");



router.get('/offers/:id', authComunMiddleware, offersController.create);
router.post('/offers/:id', authComunMiddleware, validationsOffer, offersController.createProccess);


router.post('/offerAccept/:id', authComunMiddleware, offersController.acceptOffer);

router.post('/offerReject/:id', authComunMiddleware, offersController.rejectOffer);

module.exports = router;