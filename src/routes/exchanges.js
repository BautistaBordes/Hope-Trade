const express = require('express');
const router = express.Router();
const exchangesController = require("../controllers/exchanges");

const authVoluntarioMiddleware = require("../middlewares/authVoluntarioMiddleware");



router.post('/acceptExchange/:id', authVoluntarioMiddleware, exchangesController.acceptExchange);

router.post('/rejectExchange/:id', authVoluntarioMiddleware, exchangesController.rejectExchange);

module.exports = router;