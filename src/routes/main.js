const express = require('express');
const router = express.Router();
const mainController = require("../controllers/main");

const guestOrComunMiddleware = require("../middlewares/guestOrComunMiddleware"); 
const authComunMiddleware = require('../middlewares/authComunMiddleware');
const validationsDonation = require("../middlewares/validations/validationsDonationOnline");


// define the home page route
router.get('/', guestOrComunMiddleware,  mainController.index);
router.get('/donate', authComunMiddleware,  mainController.donate);

router.get("/cardDonate", authComunMiddleware, mainController.donateCard);
router.post("/cardDonate", authComunMiddleware, validationsDonation, mainController.donateCardProccess);


module.exports = router;