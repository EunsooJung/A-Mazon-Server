/**
 * Documentation
 * @description Braintree third-party payment solution
 * @usedIn server.js
 */

const express = require('express');
const router = express.Router();

const { requireSignin, isAuth } = require('../controllers/userAuthController');
const { userById } = require('../controllers/userController');
const {
  generateToken,
  processPayment
} = require('../controllers/braintreeController');

// GET Braintree Token
router.get('/braintree/getToken/:userId', requireSignin, isAuth, generateToken);
// GET Braintree payment process
router.get('/braintree/payment/:userId', requireSignin, isAuth, processPayment);

router.param('userId', userById);

module.exports = router;
