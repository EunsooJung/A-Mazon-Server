/**
 * User Controller
 */
const User = require('../models/user');

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

/** Update User Profile */
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
