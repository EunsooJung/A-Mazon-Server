const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userScheam = new mongoose.Schema(
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
      required: true
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
