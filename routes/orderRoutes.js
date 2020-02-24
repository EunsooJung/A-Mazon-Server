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

const {
  createOrder,
  listOrders,
  getStatusValues,
  orderById,
  updateOrderStatus
} = require('../controllers/orderController');

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

/** @requestedFrom src/admin/adminApi.js - const getStatusValues = (userId, token) ... Front-End */
router.get(
  '/order/status-values/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  getStatusValues
);

/** @requestedFrom src/admin/adminApi.js - *const updateOrderStatus = (userId, token, orderId, status) ... */
router.put(
  '/order/:orderId/status/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  updateOrderStatus
);

router.param('userId', userById);
router.param('orderId', orderById);

module.exports = router;
