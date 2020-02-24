/**
 * User Controller
 */
const User = require('../models/user');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

/**
 * @method userById
 * @Description This method will run automatically and make the user available in the request object. To redirect them to the user desperate and you want to display the basic information.
 */
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    req.profile = user;
    // go to next page
    next();
  });
};

/** Retrieve to User profile */
exports.retrieveProfile = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

/**
 * Update User Profile
 */
exports.updateProfile = (req, res) => {
  console.log('user update', req.body);
  req.body.role = 0; // role will always be 0
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: 'You are not authorized to perform this action'
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );
};

/**
 * @description When we create new order, this method push to order data to user collection with history documents
 * @usedIn router.post(
  '/order/create/:userId',
  requireSignin,
  isAuth,
  createOrder,
  addOrderToUserHistory
);
 */
exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];

  req.body.order.products.forEach(item => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: 'Could not update user purchase history'
        });
      }
      next();
    }
  );
};
