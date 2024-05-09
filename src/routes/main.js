const express = require('express');
const router = express.Router();
const mainController = require("../controllers/main");

// define the home page route
router.get('/', mainController.index);
// router.post('/',(req,res) => {res.send("que")});



module.exports = router;