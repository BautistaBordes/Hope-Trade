const express = require('express');
const router = express.Router();
const postsController = require("../controllers/posts");

const authComunMiddleware = require("../middlewares/authComunMiddleware");

const validationsPost = require('../middlewares/validations/validationsPost');



router.get('/posts', authComunMiddleware, postsController.index);
router.get('/posts/add', authComunMiddleware, postsController.add);
router.post('/posts/add', authComunMiddleware, validationsPost, postsController.addProccess);

router.get('/posts/:id', authComunMiddleware, postsController.detailPost);
router.post('/posts/:id', authComunMiddleware, postsController.uploadComment);
router.post('/comments/:id', authComunMiddleware, postsController.uploadReply);
router.post('/comments/delete/:id', authComunMiddleware, postsController.deleteComment);

module.exports = router;