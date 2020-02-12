const express = require('express');
const router = express.Router();

const { signup } = require('../controllers/userController');
const { userSignupValidator } = require('../validator');

/**
 * @method post signup
 * @method userSignupValidator from '../validator/index.js
 * @parametors signup
 */
router.post('/signup', userSignupValidator, signup);

module.exports = router;
