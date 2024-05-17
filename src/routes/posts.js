const express = require('express');
const router = express.Router();
const postsController = require("../controllers/posts");

const authComunMiddleware = require("../middlewares/authComunMiddleware");

const validationsPost = require('../middlewares/validationsPost');



router.get('/posts', authComunMiddleware, postsController.index);
router.get('/myPosts', authComunMiddleware, postsController.myPosts);
router.get('/posts/add', authComunMiddleware, postsController.add);
router.post('/posts/add', authComunMiddleware, validationsPost, postsController.addProccess);


module.exports = router;