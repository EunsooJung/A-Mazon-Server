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
  updateProfile,
  purchaseHistory
} = require('../controllers/userController');

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile
  });
});

/* User profile Managment*/
/** Read user profile */
router.get('/user/:userId', requireSignin, isAuth, retrieveProfile);
/** Update user profile */
router.put('/user/:userId', requireSignin, isAuth, updateProfile);
/** User purchase history */
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);

router.param('userId', userById);

module.exports = router;
