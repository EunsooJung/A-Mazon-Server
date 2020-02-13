const express = require('express');
const router = express.Router();

const { create } = require('../controllers/categoryController');
const {
  requireSignin,
  isAuth,
  isAdmin
} = require('../controllers/userAuthController');
const { userById } = require('../controllers/userController');

router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);

router.param('userId', userById);

module.exports = router;
