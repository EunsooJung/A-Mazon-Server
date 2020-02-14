/**
 * Product Controller
 *  - Installed formidable, lodash package to image upload
 */
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Find By productId
exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category')
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: 'Product not found'
        });
      }
      req.product = product;
      next();
    });
};

// Read
exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.create = (req, res) => {
  // recieve image
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; // to images type: gif, jpg...
  /** image parse using callback func */
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }

    // check for all fiels
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required!'
      });
    }

    let product = new Product(fields);

    /**
     * get access file system
     * 1 kb = 1000
     * 1 mb = 1000000
     */
    if (files.photo) {
      // console.log('Files photo: ', files.photo);
      /** check image size */
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    // Create Product using callback func
    product.save((err, result) => {
      if (err) {
        console.log('Product create error! ', err);
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(result);
    });
  });
};

/** Remove Product */
exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deleteProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json({
      message: 'Product deleted successfully'
    });
  });
};
