const express = require('express');
const router = express.Router();

const { signup } = require('../controllers/userController');

/**
 * @method post signup
 * @parametors signup
 */
router.post('/signup', signup);

module.exports = router;
