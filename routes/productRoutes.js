const express = require('express');
const router = express.Router();

const {
  create,
  productById,
  read,
  remove
} = require('../controllers/productController');
const {
  requireSignin,
  isAuth,
  isAdmin
} = require('../controllers/userAuthController');
const { userById } = require('../controllers/userController');

/** Product Management */
router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
