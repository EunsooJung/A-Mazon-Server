const express = require('express');
const router = express.Router();

const {
  signup,
  signin,
  signout,
  requireSignin
} = require('../controllers/userController');
const { userSignupValidator } = require('../validator');

/**
 * @method post signup
 * @method userSignupValidator from '../validator/index.js
 * @parametors signup
 */
router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

// Temporay user to check unauthenticated user
router.get('/uu', requireSignin, (req, res) => {
  res.send('You are un-authenticated user!');
});

module.exports = router;
