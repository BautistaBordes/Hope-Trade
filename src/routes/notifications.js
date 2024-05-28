const express = require('express');
const router = express.Router();
const notificationsController = require("../controllers/notifications");

const authComunMiddleware = require("../middlewares/authComunMiddleware");




router.get('/notifications', authComunMiddleware, notificationsController.view);


module.exports = router;