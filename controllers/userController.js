/**
 * User Contollers:
 * - It's responsibility is a controll business flows for all users and
 *   communiate with user router(to) and models(bring in)
 * - Applied jwt to generate signed token
 * - Appied express-jwt for authorization check
 */
const User = require('../models/user');
// To generate signed token
const jwt = require('jsonwebtoken');
// For authorization check
const expressJWT = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

/**
 * @method signup Register new user with salt & hashed password
 */
exports.signup = (req, res) => {
  console.log('req.body', req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
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

/**
 * @method signin
 */
exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please signup!'
      });
    }
    // if user is found make sure the email and password match
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and Password do not match'
      });
    }

    // generate a signed token with user id (from mongodb) and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // set persist the token as 't' in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 999 });

    // return response with user and token too front-end client
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};
