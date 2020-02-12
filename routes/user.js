const express = require('express');
const router = express.Router();

const { signup, signin } = require('../controllers/userController');
const { userSignupValidator } = require('../validator');

/**
 * @method post signup
 * @method userSignupValidator from '../validator/index.js
 * @parametors signup
 */
router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);

module.exports = router;
