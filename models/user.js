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
