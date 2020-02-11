/**
 * User Contollers: It's responsibility is a controll business flows for all users
 */
const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');
/**
 * @method:
 */
exports.signup = (req, res) => {
  console.log('req.body', req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }
    // Orgarnize salt & hashed password
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user
    });
  });
};
