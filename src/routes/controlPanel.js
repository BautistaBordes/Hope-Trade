const express = require('express');
const router = express.Router();
const controlPanelController = require("../controllers/controlPanel");

const authEmployeeMiddleware = require('../middlewares/authEmployeeMiddleware');
const authRepresentanteMiddleware = require('../middlewares/authRepresentanteMiddleware');
const authVoluntarioMiddleware = require('../middlewares/authVoluntarioMiddleware');

const validationsRegisterEmployee = require('../middlewares/validations/validationsRegisterEmployee');
const validationsFilial = require('../middlewares/validations/validationsFilial');
const validationsChangeFilial = require('../middlewares/validations/validationsChangeFilial');


router.get('/controlPanel', authEmployeeMiddleware, controlPanelController.index);


router.get('/controlPanel/registerVoluntario', authRepresentanteMiddleware, controlPanelController.registerVoluntario);
router.post('/controlPanel/registerVoluntario', authRepresentanteMiddleware, validationsRegisterEmployee, validationsFilial, controlPanelController.registerVoluntarioProcess);

router.get('/controlPanel/registerRepresentante', authRepresentanteMiddleware, controlPanelController.registerRepresentante);
router.post('/controlPanel/registerRepresentante', authRepresentanteMiddleware, validationsRegisterEmployee, controlPanelController.registerRepresentanteProcess);

router.get('/controlPanel/changeFilial', authRepresentanteMiddleware, controlPanelController.changeFilial);
router.post('/controlPanel/changeFilial', authRepresentanteMiddleware, validationsFilial, validationsChangeFilial, controlPanelController.changeFilialProcess);


router.get('/controlPanel/exchanges/:filterByDate?', authVoluntarioMiddleware,  controlPanelController.exchangesFilter);

module.exports = router;