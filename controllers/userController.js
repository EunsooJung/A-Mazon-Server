/**
 * User Contollers: It's responsibility is a controll business flows for all users
 */

const User = require('../models/user');
/**
 * @method:
 */
exports.signup = (req, res) => {
  console.log('req.body', req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err
      });
      res.json({
        user
      });
    }
  });
};
