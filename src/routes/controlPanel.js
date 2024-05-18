const express = require('express');
const router = express.Router();
const controlPanelController = require("../controllers/controlPanel.js");

const authEmployeeMiddleware = require('../middlewares/authEmployeeMiddleware.js');
const validationsRegisterVoluntario = require('../middlewares/validationsRegisterVoluntario');

// define the home page route
router.get('/controlPanel', authEmployeeMiddleware, controlPanelController.index);
// router.post('/',(req,res) => {res.send("que")});

router.get('/controlPanel/registerVoluntario', authEmployeeMiddleware, controlPanelController.registerVoluntario);
router.post('/controlPanel/registerVoluntario', authEmployeeMiddleware, validationsRegisterVoluntario, controlPanelController.registerVoluntarioProcess);


module.exports = router;