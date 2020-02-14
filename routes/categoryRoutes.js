const express = require('express');
const router = express.Router();

const {
  create,
  categoryById,
  read
} = require('../controllers/categoryController');

const {
  requireSignin,
  isAuth,
  isAdmin
} = require('../controllers/userAuthController');

const { userById } = require('../controllers/userController');

router.get('/category/:categoryId', read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);

// middleware
router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;
