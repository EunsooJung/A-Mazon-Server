const express = require('express');
const router = express.Router();

const {
  requireSignin,
  isAuth,
  isAdmin
} = require('../controllers/userAuthController');

const {
  userById,
  retrieveProfile,
  updateProfile
} = require('../controllers/userController');

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile
  });
});

/* User profile */
router.get('/user/:userId', requireSignin, isAuth, retrieveProfile);
router.put('/user/:userId', requireSignin, isAuth, updateProfile);

router.param('userId', userById);

module.exports = router;
