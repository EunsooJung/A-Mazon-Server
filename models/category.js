const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: true,
    maxlength: 32
  }
});

module.exports = mongoose.model('Category', categorySchema);
