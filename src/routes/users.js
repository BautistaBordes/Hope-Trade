const express = require('express');
const router = express.Router();
const usersController = require("../controllers/users");

//con esto controlas si alguien es usuario sin registrar o registrado
const authMiddleware = require("../middlewares/authMiddleware");
const guestMiddleware = require("../middlewares/guestMiddleware");

//con esto podes decir que validaciones hace cada ruta
const validationsRegister = require('../middlewares/validationsRegister');
const validationsLogin = require('../middlewares/validationsLogin');


// ----- rutas -----
router.get('/login',  guestMiddleware, usersController.login);
router.post('/login', guestMiddleware, validationsLogin, usersController.loginProcess);

router.get('/register', guestMiddleware, usersController.register);
router.post('/register', guestMiddleware, validationsRegister, usersController.registerProcess);

router.get('/logout', authMiddleware, usersController.logout);

router.get('/profile',  authMiddleware);



module.exports = router;