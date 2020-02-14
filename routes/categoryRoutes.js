const express = require('express');
const router = express.Router();

const {
  create,
  categoryById,
  read,
  update,
  remove,
  list
} = require('../controllers/categoryController');

const {
  requireSignin,
  isAuth,
  isAdmin
} = require('../controllers/userAuthController');

const { userById } = require('../controllers/userController');

router.get('/category/:categoryId', read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  update
);

router.delete(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.get('/categories', list);

// middleware
router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;
