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

/** Update Product */
exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be updated'
      });
    }

    // check for all fiels to update
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
    /**  */
    let product = req.product;
    /**
     * @method _.extend lodash method it comes from lodash lib
     * @description
     * - _.assign(object, [sources]): Assigns own enumerable
     * string keyed properties of source objects to the destination object.
     * Source objects are applied from left to right. Subsequent sources overwrite property assignments of previous sources.
     *
     * Note: This method mutates object and is loosely based on Object.assign.
     *
     * _.assignIn(object, [sources])
     * This method is like _.assign except that it iterates over own and inherited source properties.
     * Note: This method mutates object.
     * Aliases: _.extend
     * Arguments: object (Object): The destination object. / [sources] (...Object): The source objects.
     * @argument product, fields
     */
    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size.'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(result);
    });
  });
};
