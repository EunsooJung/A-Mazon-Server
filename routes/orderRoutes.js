/**
 * Documentation
 * @description
 * @usedIn server.js
 */
const express = require('express');
const router = express.Router();

const { requireSignin, isAuth } = require('../controllers/userAuthController');
const {
  userById,
  addOrderToUserHistory
} = require('../controllers/userController');

const { createOrder } = require('../controllers/orderController');
const { decreaseQuantity } = require('../controllers/productController');

router.post(
  '/order/create/:userId',
  requireSignin,
  isAuth,
  addOrderToUserHistory,
  decreaseQuantity,
  createOrder
);

router.param('userId', userById);

module.exports = router;
