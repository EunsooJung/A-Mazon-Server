# A-Mazon-Server

Build your own A-Mazon-Server applicaion with Node.js, Express and MongoDB with MVC Pattern.

- [A-Mazon-Server: Demo](http://167.71.146.22/)

- [Applied to My Reponsive Portfolio](https://eunsoojung.github.io/Responsive-Portfolio/portfolio.html)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
See deployment for notes on how to deploy the project on a live system.

```bash
# Install packages
npm i mongoose, if-env, concurrently

# Run
npm start
```

## Usage

### Basic Usage

To get A-Mazon-Server, after downloading, you need to make sure Git Bash terminal open and looking at the correct folder. When you are within the correct location, you may type the following commands to ask her for information:

- npm start

### Guidelines:

- Proceeds as follows:

To use this applicaion, Clone the applicaion to your local git repository or directory:

- In your terminal, git clone https://github.com/EunsooJung/A-Mazon-Server.git

To start:

- You have to install npm packages depend on my package.json file: "npm install"
- Open your terminal then "npm start"

### Code Snippet

- Project structure

  [![A-Mazon-Server Project Structure]()]

- Source Code Check point

1. folder "models": It provides mongoose Schema model

```javascript
const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema(
  {
    //
    name: {
      type: String,
      trim: true,
      require: true,
      maxlength: 32
    },

    email: {
      type: String,
      trim: true,
      require: true,
      unique: 32
    },
    // virtual filed
    hashed_password: {
      type: String,
      required: true
    },
    // User profile
    about: {
      type: String,
      trim: true
    },
    // salt needs unique string
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    // user purchased history
    history: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

// virtual field for clien side after install uuid
userSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    // salt gives us random string as the hashed password
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Create userSchema method to apply encryptPassword
userSchema.methods = {
  // Create authenticate method in user model
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  }
};

module.exports = mongoose.model('User', userSchema);
```

2. helpers: It provides dbErroHaler helper modules.

3. routes: Server-Side routes

- Create all of this A-Mazon-Server application's routes (maps) using a exppress router.

```javascript
/*  Get user authentication */
router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile
  });
});
```

4. Controller layer:

- It provide application logic to process application logics with models.

```javascript
/**
 * @method userById
 * @Description This method will run automatically and make the user available in the request object.
 * To redirect them to the user desperate and you want to display the basic information.
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
```

4. server.js:

   - Setup Online-Marketplace web applicaion's environments (npm package dependencies)
   - Import Register the Routers to access.

5. validator: It provides helper method to validate user data on signup process,apply to user routes

```javascript
exports.userSignupValidator = (req, res, next) => {
  req.check('name', 'Name is required').notEmpty();
  req
    .check('email', 'Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
      min: 4,
      max: 32
    });
  req.check('password', 'Password is required').notEmpty();
  req
    .check('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number');
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
```

## Built With

- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node.js](https://nodejs.org/en/)
- [MVC Patterns](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
- [Mogoose](https://mongoosejs.com/docs/)
- [MongoDB](https://www.mongodb.com/)

## Authors

- **Michael(Eunsoo)Jung**
- **Lucas Coffee**
- **Tai Le**

* [A-Mazon-Server: Demo](http://167.71.146.22/)
* [My Portfolio](https://eunsoojung.github.io/Responsive-Portfolio/portfolio.html)
* [Link to A-Mazon-Server Github: Server-Side](https://github.com/EunsooJung/A-Mazon-Server.git)
* [Link to LinkedIn](www.linkedin.com/in/eun-soo-jung/)

## License

This project is licensed under the MIT License
