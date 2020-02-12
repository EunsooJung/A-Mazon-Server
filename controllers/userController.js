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
