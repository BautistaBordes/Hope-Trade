const express = require('express');
const router = express.Router();
const mainController = require("../controllers/main");

const guestOrComunMiddleware = require("../middlewares/guestOrComunMiddleware"); 
const authComunMiddleware = require('../middlewares/authComunMiddleware');

// define the home page route
router.get('/', guestOrComunMiddleware,  mainController.index);



module.exports = router;