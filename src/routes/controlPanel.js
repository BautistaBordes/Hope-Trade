const express = require('express');
const router = express.Router();
const controlPanelController = require("../controllers/controlPanel.js");

const authEmployeeMiddleware = require('../middlewares/authEmployeeMiddleware.js');
const authRepresentanteMiddleware = require('../middlewares/authRepresentanteMiddleware.js');
const validationsRegisterEmployee = require('../middlewares/validations/validationsRegisterEmployee.js');
const validationsFilial = require('../middlewares/validations/validationsFilial.js');
const validationsChangeFilial = require('../middlewares/validations/validationsChangeFilial.js');

// define the home page route
router.get('/controlPanel', authEmployeeMiddleware, controlPanelController.index);
// router.post('/',(req,res) => {res.send("que")});

router.get('/controlPanel/registerVoluntario', authRepresentanteMiddleware, controlPanelController.registerVoluntario);
router.post('/controlPanel/registerVoluntario', authRepresentanteMiddleware, validationsRegisterEmployee, validationsFilial, controlPanelController.registerVoluntarioProcess);

router.get('/controlPanel/registerRepresentante', authRepresentanteMiddleware, controlPanelController.registerRepresentante);
router.post('/controlPanel/registerRepresentante', authRepresentanteMiddleware, validationsRegisterEmployee, controlPanelController.registerRepresentanteProcess);

router.get('/controlPanel/changeFilial', authRepresentanteMiddleware, controlPanelController.changeFilial);
router.post('/controlPanel/changeFilial', authRepresentanteMiddleware, validationsFilial, validationsChangeFilial, controlPanelController.changeFilialProcess);

module.exports = router;