const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
      maxlength: 32
    },
    description: {
      type: String,
      require: true,
      maxlength: 2000
    },
    price: {
      type: Number,
      trim: true,
      require: true,
      maxlength: 32
    },
    category: {
      // When we reffered to the product category it will go to category model
      type: ObjectId,
      // refer to Category model
      ref: 'Category',
      required: true
    },
    quantity: {
      type: Number
    },
    sold: {
      type: Number,
      default: 0
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    shipping: {
      required: false,
      type: Boolean
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
