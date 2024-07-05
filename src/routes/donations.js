const express = require('express');
const router = express.Router();
const donationsController = require("../controllers/donations");

const authComunMiddleware = require("../middlewares/authComunMiddleware");
const redirectLogin = require("../middlewares/redirectLogin");
const validationsDonation = require("../middlewares/validations/validationsDonation");


router.get("/donate", redirectLogin, authComunMiddleware, donationsController.donate);

router.post("/donate", authComunMiddleware, validationsDonation, donationsController.donateProccess);

module.exports = router;