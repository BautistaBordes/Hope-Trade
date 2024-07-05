const express = require('express');
const router = express.Router();
const controlPanelController = require("../controllers/controlPanel");

const authEmployeeMiddleware = require('../middlewares/authEmployeeMiddleware');
const authRepresentanteMiddleware = require('../middlewares/authRepresentanteMiddleware');
const authVoluntarioMiddleware = require('../middlewares/authVoluntarioMiddleware');

const validationsRegisterEmployee = require('../middlewares/validations/validationsRegisterEmployee');
const validationsFilial = require('../middlewares/validations/validationsFilial');
const validationsChangeFilial = require('../middlewares/validations/validationsChangeFilial');

const validationsDonationCash = require('../middlewares/validations/validationsDonationCash');
const validationsDonationArticle = require('../middlewares/validations/validationsDonationArticle');


router.get('/controlPanel', authEmployeeMiddleware, controlPanelController.index);


router.get('/controlPanel/registerVoluntario', authRepresentanteMiddleware, controlPanelController.registerVoluntario);
router.post('/controlPanel/registerVoluntario', authRepresentanteMiddleware, validationsRegisterEmployee, validationsFilial, controlPanelController.registerVoluntarioProcess);

router.get('/controlPanel/registerRepresentante', authRepresentanteMiddleware, controlPanelController.registerRepresentante);
router.post('/controlPanel/registerRepresentante', authRepresentanteMiddleware, validationsRegisterEmployee, controlPanelController.registerRepresentanteProcess);

router.get('/controlPanel/changeFilial', authRepresentanteMiddleware, controlPanelController.changeFilial);
router.post('/controlPanel/changeFilial', authRepresentanteMiddleware, validationsFilial, validationsChangeFilial, controlPanelController.changeFilialProcess);


router.get('/controlPanel/exchanges/:filterByDate?', authVoluntarioMiddleware,  controlPanelController.exchangesFilter);

router.get('/controlPanel/historyExchanges', authRepresentanteMiddleware,  controlPanelController.historyExchanges);

router.get('/controlPanel/historyDonations', authRepresentanteMiddleware,  controlPanelController.historyDonations);


router.get('/controlPanel/registerCashDonation', authVoluntarioMiddleware,  controlPanelController.registerCashDonations);
router.post('/controlPanel/registerCashDonation', authVoluntarioMiddleware, validationsDonationCash,  controlPanelController.registerCashDonationsProcess);


router.get('/controlPanel/registerArticleDonation', authVoluntarioMiddleware,  controlPanelController.registerArticleDonations);
router.post('/controlPanel/registerArticleDonation', authVoluntarioMiddleware, validationsDonationArticle,  controlPanelController.registerArticleDonationsProcess);


module.exports = router;