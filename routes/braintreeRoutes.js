/**
 * Documentation
 * @description Braintree third-party payment solution
 * @usedIn server.js
 */

const express = require('express');
const router = express.Router();

const { requireSignin, isAuth } = require('../controllers/userAuthController');
const { userById } = require('../controllers/userController');
const { generateToken } = require('../controllers/braintreeController');

router.get('/braintree/getToken/:userId', requireSignin, isAuth, generateToken);

router.param('userId', userById);

module.exports = router;
