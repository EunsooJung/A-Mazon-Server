/**
 * Documentation
 * @description
 * @usedIn server.js
 */
const express = require('express');
const router = express.Router();

const {
  requireSignin,
  isAuth,
  isAdmin
} = require('../controllers/userAuthController');

const {
  userById,
  addOrderToUserHistory
} = require('../controllers/userController');

const { createOrder, listOrders } = require('../controllers/orderController');
const { decreaseQuantity } = require('../controllers/productController');

router.post(
  '/order/create/:userId',
  requireSignin,
  isAuth,
  addOrderToUserHistory,
  decreaseQuantity,
  createOrder
);

/**
 * @method GET
 * @requestedFrom src/admin/adminApi.js - listOrders = (userId, token) ... Front-End
 */
router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders);

router.get('/order/status-values/:userId', requireSignin, isAuth, isAdmin);
router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin);

router.param('userId', userById);

module.exports = router;
